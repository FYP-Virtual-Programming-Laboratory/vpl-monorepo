from typing import Annotated
from fastapi import APIRouter, Depends, status
from src.core.schemas import ErrorResponseSchema, APIErrorCodes
from src.worker.schemas import SystemLogSchema, UpdateWorkerSchema, WorkerDetailSchema
from src.worker.services import (
    add_worker_service,
    delete_worker_service,
    get_system_logs_service,
    list_workers_service,
    update_worker_service,
    worker_details_service,
)


router = APIRouter()


@router.get(
    "/",
    response_model=list[WorkerDetailSchema],
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.UNAUTHORIZED,
                        "message": "Unauthorized access."
                    }
                }
            }
        },
    }
)
def list_workers(
    workers: Annotated[list[WorkerDetailSchema], Depends(list_workers_service)]
) -> list[WorkerDetailSchema]:
    """List all workers."""
    return workers


@router.post(
    "/",
    response_model=WorkerDetailSchema,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Bad request - Worker name already exists",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.BAD_REQUEST,
                        "message": "Worker with this name already exists."
                    }
                }
            }
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.UNAUTHORIZED,
                        "message": "Unauthorized access."
                    }
                }
            }
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.SERVICE_ERROR,
                        "message": "Failed to add new worker."
                    }
                }
            }
        }
    }
)
def create_worker(
    worker: Annotated[WorkerDetailSchema, Depends(add_worker_service)]
) -> WorkerDetailSchema:
    """Create a new worker."""
    return worker


@router.get(
    "/{worker_id}/",
    response_model=WorkerDetailSchema,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized access only available to super admins.",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.UNAUTHORIZED,
                        "message": "Unauthorized access."
                    }
                }
            }
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Worker not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Worker not found."
                    }
                }
            }
        },
    }
)
def get_worker_details(
    worker: Annotated[WorkerDetailSchema, Depends(worker_details_service)]
) -> WorkerDetailSchema:
    """Get details of a specific worker."""
    return worker


@router.patch(
    "/{worker_id}/",
    response_model=WorkerDetailSchema,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Bad request - Cannot perform action on default worker",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.DEFAULT_WORKER,
                        "message": "Can not perform action on default worker."
                    }
                }
            }
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized access only available to super admins.",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.UNAUTHORIZED,
                        "message": "Unauthorized access."
                    }
                }
            }
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Worker not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Worker not found."
                    }
                }
            }
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.SERVICE_ERROR,
                        "message": "Failed to update worker."
                    }
                }
            }
        }
    }
)
def update_worker_details(
    worker: Annotated[WorkerDetailSchema, Depends(update_worker_service)]
) -> WorkerDetailSchema:
    """Update details of a specific worker."""
    return worker


@router.delete(
    "/{worker_id}/",
    response_model=dict[str, str],
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Bad request - Cannot perform action on default worker",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.DEFAULT_WORKER,
                        "message": "Can not perform action on default worker."
                    }
                }
            }
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Unauthorized access only available to super admins.",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.UNAUTHORIZED,
                        "message": "Unauthorized access."
                    }
                }
            }
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Worker not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Worker not found."
                    }
                }
            }
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Internal server error",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.SERVICE_ERROR,
                        "message": "Failed to delete worker."
                    }
                }
            }
        }
    }
)
def delete_worker(_: Annotated[None, Depends(delete_worker_service)]) -> dict[str, str]:
    """Delete a specific worker."""
    return {'message': 'Worker deleted.'}


@router.get("/system")
def fetch_system_status_logs(
    logs: Annotated[list[SystemLogSchema], Depends(get_system_logs_service)]
) -> list[SystemLogSchema]:
    """Fetch system status logs."""
    return logs

