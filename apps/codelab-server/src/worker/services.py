from src.core.dependecies import (
    require_db_session, 
    require_super_admin,
)
from typing import Annotated
from datetime import datetime
from fastapi import Depends, Query, Path, Body, status
from src.core.exceptions import APIException
from src.core.schemas import APIErrorCodes
from src.models import Worker, Admin, SystemStatusLog
from src.utils import atomic_transaction_block
from src.schemas import WorkerStatus
from sqlmodel import select, Session, desc
from pydantic import PositiveInt
from uuid import UUID
from src.worker.manager import WorkerManager
from src.worker.schemas import (
    CreateWorkerSchema,
    SystemLogSchema, 
    UpdateWorkerSchema, 
    WorkerDetailSchema,
)


def list_workers_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_super_admin)],
    status_filter: Annotated[WorkerStatus | None, Query(description="Filter by worker status")] = None,
) -> list[WorkerDetailSchema]:
    """List all workers."""

    if status_filter:
        statement = select(Worker).where(Worker.status == status_filter)
    else:
        statement = select(Worker)

    results = db_session.exec(statement)
    workers = results.all()
    return [WorkerDetailSchema.model_validate(worker) for worker in workers]


def get_worker_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_super_admin)],
    worker_id: Annotated[UUID, Path(description="The ID of the worker")],
) -> Worker:
    """Get details of a specific worker."""

    statement = (
        select(Worker)
        .where(Worker.id == worker_id)
    )

    results = db_session.exec(statement)
    worker = results.one_or_none()

    if not worker:
        raise APIException(
            message="Worker not found.",
            error_code=APIErrorCodes.NOT_FOUND,
            status_code=status.HTTP_404_NOT_FOUND,
        )

    return worker


def require_non_default_worker(
    worker: Annotated[Worker, Depends(get_worker_service)]
) -> Worker:
    """Check if worker is not the default worker."""
    if worker.is_default:
        raise APIException(
            message="Can not perform action on default worker.",
            error_code=APIErrorCodes.DEFAULT_WORKER,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return worker


def worker_details_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_super_admin)],
    worker: Annotated[Worker, Depends(get_worker_service)],
) -> WorkerDetailSchema | None:
    """Get details of a specific worker."""
    return WorkerDetailSchema.model_validate(worker)


async def add_worker_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_super_admin)],
    worker_data: Annotated[CreateWorkerSchema, Body()],
) -> WorkerDetailSchema:
    """Add a new worker."""

    # check that worker name is unique
    existing_worker = db_session.exec(
        select(Worker).where(Worker.name == worker_data.name)
    ).one_or_none()
    if existing_worker:
        raise APIException(
            message="Worker with this name already exists.",
            error_code=APIErrorCodes.BAD_REQUEST,
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # create worker record in memory.
        # the record will be saved by the manager.
        worker = Worker(
            **worker_data.model_dump(),
            status= WorkerStatus.online,
        )
        manager = WorkerManager(db_session=db_session)
        manager.add_worker(worker=worker)
        return WorkerDetailSchema.model_validate(worker)
    except RuntimeError:
        raise APIException(
            message="Failed to add new worker.",
            error_code=APIErrorCodes.SERVICE_ERROR,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


async def update_worker_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_super_admin)],
    worker: Annotated[Worker, Depends(require_non_default_worker)],
    worker_data: Annotated[UpdateWorkerSchema, Body()],
) -> WorkerDetailSchema:
    """Start a specific worker."""

    try:
        with atomic_transaction_block(db_session=db_session):
            worker.no_of_threads = worker_data.no_of_threads or worker.no_of_threads        

            # save thread changes first
            if worker_data.no_of_threads:
                db_session.add(worker)
                db_session.flush()  # Use flush instead of commit within transaction block
            manager = WorkerManager(db_session=db_session)
            if worker_data.status is None or worker_data.status == 'start':
                manager.start_worker(worker=worker)
            else:
                manager.stop_worker(worker=worker)
    except RuntimeError:
        status_action = worker_data.status or "update"
        raise APIException(
            message=f"Failed to {status_action} worker.",
            error_code=APIErrorCodes.SERVICE_ERROR,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return WorkerDetailSchema.model_validate(worker)


async def delete_worker_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_super_admin)],
    worker: Annotated[Worker, Depends(require_non_default_worker)],
) -> None:
    """Delete a specific worker."""
    try:
        manager = WorkerManager(db_session=db_session)
        manager.remove_worker(worker=worker)
    except RuntimeError:
        raise APIException(
            message="Failed to delete worker.",
            error_code=APIErrorCodes.SERVICE_ERROR,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


async def get_system_logs_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    # admin: Annotated[Admin, Depends(require_super_admin)],
    start_date_filter: Annotated[datetime | None, Query(description="Filter start date.")] = None,
    end_date_filter: Annotated[datetime | None, Query(description="Filter end-date.")] = None,
    limit: Annotated[PositiveInt | None, Query(description="Limit no of records returned.")] = None,
) -> list[SystemLogSchema]:
    """Fetch system logs service."""

    query = select(SystemStatusLog)

    if start_date_filter:
        query = query.where(SystemStatusLog.created_at >= start_date_filter)

    if end_date_filter:
        query = query.where(SystemStatusLog.created_at <= end_date_filter)

    limit = limit or 50
    query = query.limit(limit)

    records = db_session.exec(query.order_by(desc(SystemStatusLog.created_at))).all()
    return [SystemLogSchema.model_validate(log) for log in records]

