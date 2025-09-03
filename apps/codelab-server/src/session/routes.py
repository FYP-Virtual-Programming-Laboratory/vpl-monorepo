from typing import Annotated
from fastapi import APIRouter, Depends, File, Path, UploadFile, status
from uuid import UUID

from src.core.schemas import ErrorResponseSchema, APIErrorCodes

from src.session.services.session_creation import (
    check_session_in_creation_state_service,
    get_session_by_id_service,
    get_session_in_creation_state_service,
    initialize_session_state_service,
    configure_session_content_service,
    configure_session_resource_service,
    configure_session_collaboration_service,
    configure_session_enrollment_service,
    confirm_session_creation_service,
    discard_session_service,
)
from src.session.schemas import (
    SessionCollaborationSchema,
    SessionContentConfigurationSchema,
    SessionCreationSchema,
    SessionEnrollmentSchema,
    SessionInitializationSchema,
    SessionResourceConfigurationSchema,
)
from src.models import Session as WorkflowSession


router = APIRouter()

@router.get(
    "/check",
    response_model=SessionCreationSchema | None,
    status_code=status.HTTP_200_OK,
    summary="Check if admin has any sessions in creation.",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "No session in creation state",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.SESSION_NOT_FOUND,
                        "message": "No session in creation state."
                    }
                }
            }
        }
    }
)
def check_session_in_creation(
    session_data: Annotated[SessionCreationSchema, Depends(check_session_in_creation_state_service)]
) -> SessionCreationSchema:
    """Check if admin has session in creation."""
    return session_data


@router.post(
    "/initialize",
    response_model=SessionCreationSchema,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Language image not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Language image not found."
                    }
                }
            }
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Language image is not available",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.BAD_REQUEST,
                        "message": "Language image is not available. Please rebuild the image first and try again."
                    }
                }
            }
        }
    }
)
def initialize_session(
    session_data: Annotated[
        SessionCreationSchema, 
        Depends(initialize_session_state_service)
    ]
):
    """Initialize a new session."""
    return session_data


@router.post(
    "/{session_id}/configure/content",
    response_model=SessionCreationSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Session not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Session not found."
                    }
                }
            }
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Session is not in creation state",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.BAD_REQUEST,
                        "message": "Session is not in creation state."
                    }
                }
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not authorized to access this session",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not authorized to access this resource."
                    }
                }
            }
        }
    }
)
def configure_content(
    session_data: Annotated[
        SessionCreationSchema, 
        Depends(configure_session_content_service)
    ]
):
    """Configure the content of a session."""
    return session_data


@router.post(
    "/{session_id}/configure/resources",
    response_model=SessionCreationSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Session not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Session not found."
                    }
                }
            }
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Session is not in creation state",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.BAD_REQUEST,
                        "message": "Session is not in creation state."
                    }
                }
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not authorized to access this session",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not authorized to access this resource."
                    }
                }
            }
        }
    }
)
def configure_resources(
    session_data: Annotated[
        SessionCreationSchema, 
        Depends(configure_session_resource_service)
    ]
):
    """Configure the resources of a session."""
    return session_data


@router.post(
    "/{session_id}/configure/collaboration",
    response_model=SessionCreationSchema,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Session not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Session not found."
                    }
                }
            }
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Session is not in creation state",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.BAD_REQUEST,
                        "message": "Session is not in creation state."
                    }
                }
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not authorized to access this session",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not authorized to access this resource."
                    }
                }
            }
        }
    }
)
def configure_collaboration(
    session_data: Annotated[
        SessionCreationSchema, 
        Depends(configure_session_collaboration_service)
    ]
):
    """Configure the collaboration settings of a session."""
    return session_data


@router.post(
    "/{session_id}/configure/enrollment",
    response_model=SessionCreationSchema,
    status_code=status.HTTP_200_OK,
    summary="Configure the enrollment settings of a session.",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Session not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Session not found."
                    }
                }
            }
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Session is not in creation state or invalid enrollment data",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "examples": {
                        'creation_state': {
                            "summary": "Session is not in creation state.",
                            "value": {
                                "error_code": APIErrorCodes.BAD_REQUEST,
                                "message": "Session is not in creation state."
                            }
                        },
                        'csv_required': {
                            'summary': 'CSV file required for bulk upload.',
                            'value': {
                                "error_code": APIErrorCodes.INVALID_ENROLLMENT_DATA,
                                "message": "CSV file is required when enrollment method is bulk upload."
                            }
                        },
                        'invalid_csv_format': {
                            'summary': 'Invalid CSV file format.',
                            'value': {
                                "error_code": APIErrorCodes.INVALID_ENROLLMENT_DATA,
                                "message": "Invalid csv file. Ensure csv matches the required format."
                            }
                        },
                        'empty_enrollment_data': {
                            'summary': 'Empty invitation list.',
                            'value': {
                                "error_code": APIErrorCodes.INVALID_ENROLLMENT_DATA,
                                "message": "Invitation list cannot be empty."
                            }
                        }
                    }
                }
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not authorized to access this session",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not authorized to access this resource."
                    }
                }
            }
        }
    }
)
def configure_enrollment(
    session_data: Annotated[
        SessionCreationSchema, 
        Depends(configure_session_enrollment_service)
    ]
):
    """Configure the enrollment settings of a session."""
    return session_data


@router.post(
    "/{session_id}/configure/confirm",
    response_model=WorkflowSession,
    status_code=status.HTTP_200_OK,
    summary="Confirm the creation of a session.",
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Session not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Session not found."
                    }
                }
            }
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Session not in correct state for confirmation",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "examples": {
                        'creation_state': {
                            'summary': 'Session is not in creation state.',
                            'value': {
                                "error_code": APIErrorCodes.BAD_REQUEST,
                                "message": "Session is not in creation state."
                            }
                        },
                        'confirmation_stage': {
                            'summary': 'Session is not in confirmation stage.',
                            'value': {
                                "error_code": APIErrorCodes.BAD_REQUEST,
                                "message": "Session is not in confirmation stage."
                            }
                        }
                    }
                }
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not authorized to access this session",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not authorized to access this resource."
                    }
                }
            }
        }
    }
)
def confirm_session(
    session: Annotated[
        WorkflowSession, 
        Depends(confirm_session_creation_service)
    ]
):
    """Confirm the creation of a session."""
    return session

@router.delete(
    "/{session_id}/configure/discard",
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Session not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Session not found."
                    }
                }
            }
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Session is not in creation state",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.BAD_REQUEST,
                        "message": "Session is not in creation state."
                    }
                }
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Not authorized to access this session",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not authorized to access this resource."
                    }
                }
            }
        }
    }
)
def discard_session(
    _: Annotated[None, Depends(discard_session_service)]
) -> None:
    """Discard session in creation state."""
    return None
