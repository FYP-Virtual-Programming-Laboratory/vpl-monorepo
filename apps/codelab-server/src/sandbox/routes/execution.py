from fastapi import APIRouter, Depends, status
from typing import Annotated
from src.models import ExerciseSubmission, Task
from src.core.schemas import ErrorResponseSchema, APIErrorCodes
from src.sandbox.services import (
    cancel_queued_exercise_submission_service,
    cancel_queued_task_service,
    create_exercise_submission_service,
    create_task_execution_service,
    get_exercise_submission_by_id_service,
    get_task_by_id_service,
    get_tasks_queue_list_service,
)


router = APIRouter()


@router.post(
    '/{session_id}/tasks/',
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Queue is full or task already in queue",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "examples": {
                        "queue_full": {
                            "summary": "Queue is full",
                            "value": {
                                "error_code": APIErrorCodes.TASK_QUEUE_FULL,
                                "message": "Queue is full, please try again later"
                            }
                        },
                        "threshold_exceeded": {
                            "summary": "Execution threshold exceeded",
                            "value": {
                                "error_code": APIErrorCodes.TASK_EXECUTION_THRESHOLD_EXCEEDED,
                                "message": "Student has exceeded their task execution threshold for this session"
                            }
                        },
                        "already_in_queue": {
                            "summary": "Task already in queue",
                            "value": {
                                "error_code": APIErrorCodes.TASK_ALREADY_IN_QUEUE,
                                "message": "Student already has a task in execution queue"
                            }
                        }
                    }
                }
            }
        }
    }
)
def create_task_executions(
    task_execution: Annotated[Task, Depends(create_task_execution_service)]
) -> Task:
    return task_execution


@router.get('/{session_id}/tasks/')
def list_tasks_in_execution_queue(
    tasks: Annotated[list[Task], Depends(get_tasks_queue_list_service)]
) -> list[Task]:
    """List all tasks in the execution queue."""
    return tasks


@router.get(
    '/{session_id}/tasks/{task_id}/',
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Task not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Task not found."
                    }
                }
            }
        }
    }
)
def get_execution_task(
    task: Annotated[Task, Depends(get_task_by_id_service)]
) -> Task:
    """Get details of a task."""
    return task


@router.delete(
    '/{session_id}/tasks/{task_id}/',
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Task cancellation failed",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.TASK_CANCELLATION_FAILED,
                        "message": "Failed to cancel task. Task already in progress."
                    }
                }
            }
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Exercise not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Exercise not found."
                    }
                }
            }
        },
    }
)
def cancel_execution_task(
    task: Annotated[Task, Depends(cancel_queued_task_service)]
) -> Task:
    """Cancel a task from the execution queue."""
    return task


def create_exercise_submission(
    submission: Annotated[ExerciseSubmission, Depends(create_exercise_submission_service)]
) -> ExerciseSubmission:
    """Create a new exercise submission."""
    return submission


@router.get('/{session_id}/submission/{submission_id}/')
def get_exercise_submission(
    submission: Annotated[ExerciseSubmission, Depends(get_exercise_submission_by_id_service)]
) -> ExerciseSubmission:
    """Get details of an exercise submission."""
    return submission


@router.delete(
    '/{session_id}/submission/{submission_id}/',
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Task cancellation failed",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.TASK_CANCELLATION_FAILED,
                        "message": "Failed to cancel task. Task already in progress."
                    }
                }
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Forbidden action",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not allowed to cancel this submission. You are not the group leader."
                    }
                }
            }
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Submission not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Submission not found."
                    }
                }
            }
        }
    }
)
def cancel_exercise_submission(
    submission: Annotated[ExerciseSubmission, Depends(cancel_queued_exercise_submission_service)]
) -> ExerciseSubmission:
    """Cancel an exercise submission."""
    return submission


