import signal
from collections.abc import Generator
from contextlib import contextmanager

from sqlmodel import Session, select, col
from src.models import WorkerTask
from src.schemas import WorkerTaskStatus


class TaskHelper:

    @staticmethod
    def check_concurrent_task(
        db_session: Session,
        concurrency_key: str | None = None, 
        task_name: str | None = None
    ) -> WorkerTask | None:
        """Checks if there is an active WorkerTask with the same concurrency key or task name."""

        # Ensure that at least one of task_name or concurrency_key is provided
        assert task_name is not None or concurrency_key is not None
        conditions = [WorkerTask.status == WorkerTaskStatus.started]

        if concurrency_key is not None:
            conditions.append(WorkerTask.concurrency_key == concurrency_key)
        elif task_name is not None:
            conditions.append(WorkerTask.task_name == task_name)

        statement = select(WorkerTask).where(*conditions)
        return db_session.exec(statement).first()

    @staticmethod
    def cancel_task(db_session: Session, task_id: str) -> bool:
        """Attempts to cancel a running task."""
        task = db_session.exec(
            select(WorkerTask).where(WorkerTask.task_id == task_id)
        ).first()

        if task and task.status == WorkerTaskStatus.started:
            task.status = WorkerTaskStatus.cancelled
            db_session.add(task)
            db_session.commit()
            return True

        return False


class TimeOutException(Exception):
    pass


class TimeoutStatus:
    def __init__(self):
        self.timed_out = False


@contextmanager
def raise_timeout(timeout: int) -> Generator[None, None, TimeoutStatus]:
    # Create status object
    status = TimeoutStatus()

    # Define signal handler that sets timed_out and raises exception
    def _handler(signum, frame):
        status.timed_out = True
        raise TimeOutException()

    # Set up the signal handler and alarm
    signal.signal(signal.SIGALRM, _handler)
    signal.alarm(timeout)

    try:
        # Yield the status object to be used as 'timed_out' in the with statement
        yield status
    except TimeOutException:
        # Ensure timed_out is True (though the handler already sets it)
        status.timed_out = True
        raise  # Re-raise the exception
    finally:
        # Disable the alarm
        signal.alarm(0)


@contextmanager
def atomic_transaction_block(db_session: Session):
    """Context manager for making a block of code atomic."""

    try:
        yield
        db_session.commit()
    except Exception:
        db_session.rollback()
        raise
