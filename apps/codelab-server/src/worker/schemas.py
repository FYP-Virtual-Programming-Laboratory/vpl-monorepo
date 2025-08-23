from pydantic import BaseModel
from enum import IntEnum
from datetime import datetime
from src.schemas import WorkerStatus


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
    def get_worker_status(
        process_state: 'TaskIQWorkerState', 
        previous_status: WorkerStatus | None = None,
    ) -> WorkerStatus:
        """Get the worker status from the process state."""

        status = WorkerStatus.unknown
        if process_state == TaskIQWorkerState.stopped:
            status = WorkerStatus.offline
        elif process_state == TaskIQWorkerState.starting:
            if previous_status and previous_status in [
                WorkerStatus.offline, 
                WorkerStatus.unknown,
            ]:
                status = WorkerStatus.restarting
            else:
                status = WorkerStatus.adding
        elif process_state == TaskIQWorkerState.running:
            status = WorkerStatus.online
        elif process_state == TaskIQWorkerState.stopping:
            if previous_status and previous_status == WorkerStatus.removing:
                status = WorkerStatus.removing
            else:
                status = WorkerStatus.offline
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
