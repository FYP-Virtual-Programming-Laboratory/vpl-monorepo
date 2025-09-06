from typing import Annotated
from uuid import UUID
from sqlmodel import Session, select
from taskiq import TaskiqDepends
from .worker import broker
from .manager import WorkerManager
from .middleware import require_taskiq_db_session
from src.models import SystemStatusLog, Worker
import psutil
import shutil
from src.core.config import settings
from src.log import logger


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
    schedule=[{"cron": "*/5 * * * *"}],  # Run every 5 minutes
)
async def sync_worker_logs_task(
    db_session: Annotated[Session, TaskiqDepends(require_taskiq_db_session)],
) -> None:
    """Periodically pull logs for all running workers."""
    manager = WorkerManager(db_session=db_session)
    manager.sync_worker_logs()



@broker.task(
    task_name='system_monitor_task',
    prevent_concurrency=True,
    schedule=[{"cron": "*/5 * * * *"}],  # Run every 5 minutes
)
async def system_monitor_task(
    db_session: Annotated[Session, TaskiqDepends(require_taskiq_db_session)]
) -> None:
    """Periodically logs system state."""

    # get cpu usage
    cpu_usage = psutil.cpu_percent()
    memory_usage = psutil.virtual_memory().percent
    
    disk_stats = shutil.disk_usage('/codelab')
    total_space = disk_stats.total
    used_space = disk_stats.used
    disk_usage = float((used_space / total_space) * 100 if total_space > 0 else 0)

    # get uptime of server from supervisord
    manager = WorkerManager(db_session=db_session)
    server_process_details = manager.get_worker_details(
        process_name=settings.SERVER_PROCESS_NAME
    )

    uptime = server_process_details.start_timestamp

    system_log = SystemStatusLog(
        uptime=uptime,
        cpu_usage=cpu_usage,
        disk_usage=disk_usage,
        memory_usage=memory_usage,
    )

    db_session.add(system_log)
    db_session.commit()

