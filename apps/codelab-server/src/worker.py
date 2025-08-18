from collections.abc import Generator
import taskiq_fastapi
from taskiq_redis import RedisAsyncResultBackend, RedisStreamBroker
from src.core.config import settings
from taskiq.schedule_sources import LabelScheduleSource
from taskiq import Context, TaskiqDepends, TaskiqScheduler
from typing import Annotated
from sqlmodel import Session
from src.core.db import engine
from taskiq import TaskiqMessage, TaskiqMiddleware, TaskiqResult
from sqlmodel import select
from src.models import WorkerTask
from src.schemas import WorkerTaskStatus
from src.utils import TaskHelper
from datetime import datetime
from src.log import logger


def require_db_session(context: Annotated[Context, TaskiqDepends()]) -> Generator[Session, None, None]:
    with Session(engine) as db_session:
        yield db_session


class ConcurrencyMiddleware(TaskiqMiddleware):
    """Store task in DB."""

    def pre_send(self, message: TaskiqMessage) -> TaskiqMessage | None:
        """Store task in DB before sending to workers."""

        with Session(engine) as db_session:
            prevent_concurrency = (
                message.labels.get('prevent_concurrency', 'False').lower() == 'True'
            )

            concurrency_key = message.labels.get('concurrency_key', None)

            task = WorkerTask(
                task_id=message.task_id,
                task_name=message.task_name,
                labels=message.labels,
                concurrency_key=concurrency_key,
                prevent_concurrency=prevent_concurrency,
            )
            if prevent_concurrency:
                competing_task = TaskHelper.check_concurrent_task(
                    db_session=db_session,
                    concurrency_key=concurrency_key,
                    task_name=message.task_name,
                )

                if competing_task:
                    task.status = WorkerTaskStatus.cancelled
                    task.competing_task = competing_task
                    task.cancellation_reason = 'Task cancelled due to concurrency.'

            db_session.add(task)
            db_session.commit()

            if task.status == WorkerTaskStatus.cancelled:
                # return none so that message is not sent to worker
                return None

        return message

    def pre_execute(self, message: TaskiqMessage) -> TaskiqMessage | None:
        """This hook is called before a task is executed on the broker."""

        # we implement task cancellation here as taskIQ, doesn't support it natively
        # this is not a sure way to cancel tasks as if the task is already being
        # executed by the broker we cannot stop it
        with Session(engine) as db_session:
            task = db_session.exec(
                select(WorkerTask).where(WorkerTask.task_id == message.task_id)
            ).first()

            if task is None:
                # No DB record found for this task; let it run.
                logger.warning(
                    'src::worker::ConcurrencyMiddleware::pre_execute '
                    f'No DB record found for task {message.task_id}; letting it run.'
                )
                return message

            if task.status == WorkerTaskStatus.cancelled:
                # if task is cancelled, we return None so that the task is not executed
                return None

            task.status = WorkerTaskStatus.in_progress
            db_session.add(task)
            db_session.commit()
            return message

    def post_execute(self, message: TaskiqMessage, result: TaskiqResult) -> None:
        """Update task status in DB to completed."""

        with Session(engine) as db_session:
            task = db_session.exec(
                select(WorkerTask).where(WorkerTask.task_id == message.task_id)
            ).first()

            if task:
                task.status = WorkerTaskStatus.completed
                task.completed_at = datetime.now()
                db_session.add(task)
                db_session.commit()


result_backend = RedisAsyncResultBackend(redis_url=settings.CELERY_BROKER_URL)
broker = RedisStreamBroker(
    url=settings.CELERY_BROKER_URL
).with_result_backend(result_backend)
broker.add_middlewares(ConcurrencyMiddleware())


scheduler = TaskiqScheduler(
    broker=broker,
    sources=[LabelScheduleSource(broker)],
)

taskiq_fastapi.init(broker, "src.main:app")
