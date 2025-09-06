from typing_extensions import Literal
from pydantic import (
    BaseModel, 
    ConfigDict, 
    PositiveInt, 
    StringConstraints,
)
from enum import IntEnum
from datetime import datetime
from uuid import UUID
from typing import Annotated
from src.schemas import WorkerStatus, WorkerTaskStatus


class TaskIQWorkerState(IntEnum):
    """Enumeration of TaskIQ worker states."""

    stopped = 0        # The process has been stopped due to a stop request or has never been started.
    starting = 10      # The process is starting due to a start request.
    running = 20       # The process is running.
    backoff = 30       # The process entered the STARTING state but exited too quickly to move to RUNNING.
    stopping = 40      # The process is stopping due to a stop request.
    exited = 100       # The process exited from the RUNNING state (expectedly or unexpectedly).
    fatal = 200        # The process could not be started successfully.
    unknown = 1000     # The process state is unknown.

    @staticmethod
    def get_worker_status(process_state: 'TaskIQWorkerState') -> WorkerStatus:
        """Get the worker status from the process state."""

        status = WorkerStatus.unknown
        if process_state in [
            TaskIQWorkerState.stopped,
            TaskIQWorkerState.stopping,
        ]:
            status = WorkerStatus.offline
        elif process_state in [
            TaskIQWorkerState.running,
            TaskIQWorkerState.starting,
        ]:
            status = WorkerStatus.online
        elif process_state in [
            TaskIQWorkerState.exited,
            TaskIQWorkerState.fatal,
            TaskIQWorkerState.backoff,
        ]:
            status = WorkerStatus.offline

        return status


class TaskIQWorkerDetails(BaseModel):
    pid: int
    spawnerr: str
    timestamp: datetime
    group_name: str
    process_name: str
    stop_timestamp: datetime
    start_timestamp: datetime
    status: TaskIQWorkerState


class TaskDetailsSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    worker_id: UUID
    task_name: str
    status: WorkerTaskStatus
    created_at: datetime
    completed_at: datetime | None = None
    competing_task_id: str | None = None


class WorkerDetailSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    logs: str
    is_default: bool
    no_of_threads: int
    status: WorkerStatus
    created_at: datetime
    updated_at: datetime | None = None


class CreateWorkerSchema(BaseModel):
    name: Annotated[str, StringConstraints(min_length=3, max_length=50, strip_whitespace=True)]
    no_of_threads: PositiveInt


class UpdateWorkerSchema(BaseModel):
    no_of_threads: PositiveInt | None = None
    status: Literal['start', 'stop'] | None = None


class SystemLogSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    uptime: datetime | None = None
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    created_at: datetime
