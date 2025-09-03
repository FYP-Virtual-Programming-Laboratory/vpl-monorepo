from typing import Annotated
from uuid import UUID
from sqlmodel import Session, col, select
from src.schemas import WorkerStatus
from taskiq import TaskiqDepends
from .worker import broker
from .manager import WorkerManager
from .middleware import require_taskiq_db_session
from src.models import Worker


@broker.task(
    task_name='sync_worker_state_with_process_task',
    prevent_concurrency=True,
    schedule=[{"cron": "*/5 * * * *"}],  # Run every 5 minutes
)
async def sync_worker_state_with_process_task(
    db_session: Annotated[Session, TaskiqDepends(require_taskiq_db_session)],
    worker_id: UUID | None = None,
) -> None:
    """Synchronize the worker state with the process state."""
    worker = None
    if worker_id:
        worker = db_session.exec(select(Worker).where(Worker.id == worker_id)).first()

    manager = WorkerManager(db_session=db_session)
    manager.sync_worker_state_with_process_state(worker=worker)


@broker.task(
    task_name='sync_worker_logs_task',
    prevent_concurrency=True,
    schedule=[{"cron": "*/1 * * * *"}],  # Run every 5 minutes
)
async def sync_worker_logs_task(
    db_session: Annotated[Session, TaskiqDepends(require_taskiq_db_session)],
) -> None:
    """Periodically pull logs for all running workers."""
    manager = WorkerManager(db_session=db_session)
    manager.sync_worker_logs()

