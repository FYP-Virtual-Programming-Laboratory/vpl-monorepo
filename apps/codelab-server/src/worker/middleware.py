from collections.abc import Generator
from taskiq import (
    Context, 
    TaskiqDepends, 
    TaskiqMessage, 
    TaskiqMiddleware, 
    TaskiqResult,
)
from sqlmodel import Session, select
from src.core.db import engine
from src.models import Worker, WorkerTask
from src.schemas import WorkerTaskStatus
from src.utils import TaskHelper
from src.log import logger
from datetime import datetime
import os


def require_taskiq_db_session(context: Context = TaskiqDepends()) -> Generator[Session, None, None]:
    """Provide a database session to TaskIQ tasks."""
    with Session(engine) as db_session:
        yield db_session


class ConcurrencyMiddleware(TaskiqMiddleware):
    """Middleware to handle task concurrency and store task information in DB."""

    def pre_send(self, message: TaskiqMessage) -> TaskiqMessage | None:
        """Store task in DB before sending to workers and handle concurrency."""

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
                # Return None so that message is not sent to worker
                return None

        return message

    def pre_execute(self, message: TaskiqMessage) -> TaskiqMessage | None:
        """Check task cancellation before execution."""

        # We implement task cancellation here as TaskIQ doesn't support it natively
        # This is not a sure way to cancel tasks as if the task is already being
        # executed by the broker we cannot stop it
        with Session(engine) as db_session:
            task = db_session.exec(
                select(WorkerTask).where(WorkerTask.task_id == message.task_id)
            ).first()

            if task is None:
                # No DB record found for this task; let it run.
                logger.warning(
                    'src::middleware::ConcurrencyMiddleware::pre_execute '
                    f'No DB record found for task {message.task_id}; letting it run.'
                )
                return message

            if task.status == WorkerTaskStatus.cancelled:
                # If task is cancelled, we return None so that the task is not executed
                return None

            PID = os.getppid()
            worker = db_session.exec(select(Worker).where(Worker.pid == PID)).first()
            task.status = WorkerTaskStatus.in_progress
            task.worker = worker
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

