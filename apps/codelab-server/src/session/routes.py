from typing import Annotated
from fastapi import APIRouter, Depends, File, Path, UploadFile, status
from uuid import UUID

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
    summary="Check if admin has any sessions in creation."
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
)
def discard_session(
    _: Annotated[None, Depends(discard_session_service)]
) -> None:
    """Discard session in creation state."""
    return None
