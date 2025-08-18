import csv
import secrets
from datetime import timedelta
from typing import Annotated
from uuid import UUID
from fastapi import Depends, Body, File, Path, UploadFile, status
from src.core.dependecies import require_db_session, require_admin
from sqlmodel import Session, col, select, delete
from src.core.exceptions import APIException
from src.core.schemas import APIErrorCodes
from pydantic import EmailStr, ValidationError
from src.core.config import settings
from src.models import (
    Admin,
    SessionEnrollment,
    SessionInvitation, 
    Student,
    Exercise, 
    ExerciseEvaluationFlag, 
    LanguageImage, 
    Session as WorkflowSession, 
    SessionReasourceConfig, 
    TestCase,
)
from src.schemas import (
    ImageStatus, 
    SessionEnrollmentMethod, 
    SessionInitializationStage, 
    SessionStatus,
)
from src.session.schemas import (
    SessionCollaborationSchema,
    SessionContentConfigurationSchema, 
    SessionCreationDetailSchema, 
    SessionCreationSchema,
    SessionEnrollmentSchema, 
    SessionInitializationSchema,
    SessionResourceConfigurationSchema,
)
from src.utils import atomic_transaction_block


# ------------------------------------------------------------
# session initialization stages progress thus:
#  1. session creation
#  2. content configuration
#  3. resource configuration
#  4. collaboration configuration
#  5. enrollment configuration
# ------------------------------------------------------------


def get_session_by_id_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    session_id: Annotated[UUID, Path()],
) -> WorkflowSession:
    """Get a session by its id."""
    session = db_session.get(WorkflowSession, session_id)

    if not session:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message="Session not found",
            error_code=APIErrorCodes.NOT_FOUND,
        )
    return session


def get_session_in_creation_state_service(
    admin: Annotated[Admin, Depends(require_admin)],
    session: Annotated[WorkflowSession, Depends(get_session_by_id_service)],
) -> WorkflowSession:
    """Get the current state of the session creation process."""

    # check that session is in creating status
    if session.status != SessionStatus.creating:
        raise APIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Session is not in creation state.",
            error_code=APIErrorCodes.BAD_REQUEST,
        )

    if session.admin_id != admin.id:
        raise APIException(
            status_code=status.HTTP_403_FORBIDDEN,
            message="You are not authorized to access this resource.",
            error_code=APIErrorCodes.FORBIDDEN,
        )

    return session


def check_session_in_creation_state_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_admin)],
) -> WorkflowSession:
    """Check if admin has any session in creation state."""

    session = db_session.exec(
        select(WorkflowSession).where(
            WorkflowSession.status == SessionStatus.creating, 
            WorkflowSession.admin == admin,
        ).order_by(WorkflowSession.created_at)
    ).first()

    if not session:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message="No session in creation state.",
            error_code=APIErrorCodes.SESSION_NOT_FOUND,
        )

    return SessionCreationSchema(
        stage=session.initialization_stage,
        session_details=SessionCreationDetailSchema.model_validate(session)
    )


def initialize_session_state_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_admin)],
    session_data: Annotated[SessionInitializationSchema, Body()],
) -> SessionCreationSchema:
    """Initialize the creation of a new session."""

    # check that language image exists and is available
    language_image = db_session.get(
        LanguageImage, 
        session_data.language_image_id,
    )

    if not language_image:
        raise APIException(
            status_code=status.HTTP_404_NOT_FOUND,
            message="Language image not found",
            error_code=APIErrorCodes.NOT_FOUND,
        )

    if language_image.status != ImageStatus.available:
        raise APIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Language image is not available. Please rebuild the image first and try again.",
            error_code=APIErrorCodes.BAD_REQUEST,
        )

    with atomic_transaction_block(db_session=db_session):
        session = WorkflowSession(
            admin_id=admin.id,
            title=session_data.title,
            description=session_data.description,
            language_image_id=session_data.language_image_id,
            start_time=session_data.session_start_time,
            end_time=(
                session_data.session_end_time 
                if session_data.session_end_time else
                session_data.session_start_time + timedelta(hours=session_data.session_duration)
            ),
            initialization_stage=SessionInitializationStage.content_configuration,
        )

        # first discard any sessions in creation state by this admin
        db_session.exec(delete(WorkflowSession).where(
            WorkflowSession.status == SessionStatus.creating, 
            WorkflowSession.admin == admin,
        ))

        # then initialize the new session
        db_session.add(session)
        db_session.commit()

    return SessionCreationSchema(
        stage=session.initialization_stage,
        session_details=SessionCreationDetailSchema.model_validate(session)
    )


def configure_session_content_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_admin)],
    session: Annotated[WorkflowSession, Depends(get_session_in_creation_state_service)],
    session_data: Annotated[SessionContentConfigurationSchema, Body()],
) -> SessionCreationSchema:
    """Configure the content of the session."""
    
    with atomic_transaction_block(db_session=db_session):
        # before adding new content delete existing content
        # This is to avoid having dublicate content and it allows the user the
        # optiion of going back and editing the content.
        db_session.exec(
            delete(ExerciseEvaluationFlag).where(
                col(ExerciseEvaluationFlag.id).in_(
                    select(ExerciseEvaluationFlag.id)
                    .join(Exercise, onclause=Exercise.id == ExerciseEvaluationFlag.exercise_id)
                    .where(Exercise.session_id == session.id)
                )
            )
        )

        db_session.exec(
            delete(TestCase).where(
                col(TestCase.id).in_(
                    select(TestCase.id)
                    .join(Exercise, onclause=Exercise.id == TestCase.exercise_id)
                    .where(Exercise.session_id == session.id)
                )
            )
        )

        db_session.exec(delete(Exercise).where(Exercise.session_id == session.id))

        # create exercises, evaluation flags and test cases
        exercises_to_create = []
        evaluation_flags_to_create = []
        test_cases_to_create = []

        for exercise_data in session_data.exercises:
            exercise = Exercise(
                session_id=session.id,
                question=exercise_data.question,
                instructions=exercise_data.instructions,
                score_percentage=exercise_data.score_percentage,
            )
            exercises_to_create.append(exercise)

            for test_case_data in exercise_data.test_cases:
                test_case = TestCase(
                    exercise_id=exercise.id,
                    title=test_case_data.title,
                    visible=test_case_data.visible,
                    test_input=test_case_data.test_input,
                    expected_output=test_case_data.expected_output,
                    score_percentage=test_case_data.score_percentage,
                )
                test_cases_to_create.append(test_case)

            for evaluation_flag_data in exercise_data.evaluation_flags:
                evaluation_flag = ExerciseEvaluationFlag(
                    exercise_id=exercise.id,
                    flag=evaluation_flag_data.flag,
                    visible=evaluation_flag_data.visible,
                    score_percentage=evaluation_flag_data.score_percentage,
                )
                evaluation_flags_to_create.append(evaluation_flag)

        # commit the changes
        db_session.add_all(exercises_to_create)
        db_session.add_all(test_cases_to_create)
        db_session.add_all(evaluation_flags_to_create)

        # update session initialization stage
        session.initialization_stage = SessionInitializationStage.resource_configuration
        db_session.add(session)
        db_session.commit()

    return SessionCreationSchema(
        stage=session.initialization_stage,
        session_details=SessionCreationDetailSchema.model_validate(session)
    )


def configure_session_resource_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_admin)],
    session: Annotated[WorkflowSession, Depends(get_session_in_creation_state_service)],
    session_data: Annotated[SessionResourceConfigurationSchema, Body()],
) -> SessionCreationSchema:
    """Configure the resource of the session."""

    with atomic_transaction_block(db_session=db_session):
        # delete previous reasource configuration
        db_session.exec(
            delete(SessionReasourceConfig).where(
                SessionReasourceConfig.session_id == session.id
            )
        )

        # create new reasource configuration
        reasource_configuration = SessionReasourceConfig(
            session_id=session.id,
            **session_data.model_dump(),
        )

        # update session initialization stage
        session.initialization_stage = SessionInitializationStage.collaboration_configuration
        db_session.add(reasource_configuration)
        db_session.add(session)
        db_session.commit()

    return SessionCreationSchema(
        stage=session.initialization_stage,
        session_details=SessionCreationDetailSchema.model_validate(session)
    )


def configure_session_collaboration_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_admin)],
    session: Annotated[WorkflowSession, Depends(get_session_in_creation_state_service)],
    session_data: Annotated[SessionCollaborationSchema, Body()],
) -> SessionCreationSchema:
    """Configure the collaboration of the session."""

    session.sqlmodel_update(obj=session_data.model_dump())

    # update session initialization stage
    session.initialization_stage = SessionInitializationStage.enrollment
    db_session.add(session)
    db_session.commit()

    return SessionCreationSchema(
        stage=session.initialization_stage,
        session_details=SessionCreationDetailSchema.model_validate(session)
    )


def _extract_session_invites_from_csv(csv_file: UploadFile) -> list[str]:
    """Extract the enrollment data from the CSV file."""

    csv_file.file.seek(0)
    csv_reader = csv.DictReader(csv_file.file)

    if 'matric_no' not in csv_reader.fieldnames:
        raise ValueError("CSV file must contain a header named `matric_no`.")

    enrollment_data: list[str] = []
    for index, row in enumerate(csv_reader):
        matric_no = row.get('matric_no', None)

        if matric_no is None:
            raise ValueError(f"Matric no missing in row {index}")

        enrollment_data.append(matric_no)

    return enrollment_data


def configure_session_enrollment_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_admin)],
    session: Annotated[WorkflowSession, Depends(get_session_in_creation_state_service)],
    session_data: Annotated[SessionEnrollmentSchema, Body()],
    csv_file: Annotated[
        UploadFile | None, 
        File(description="The CSV file containing the enrollment data.",),
    ],
) -> SessionCreationSchema:
    """Configure the enrollment of the session."""

    with atomic_transaction_block(db_session=db_session):
        if session_data.enrollment_method in [
            SessionEnrollmentMethod.bulk_upload,
            SessionEnrollmentMethod.manual_invite,
        ]:
            # first delete any existing invites from the system
            db_session.exec(
                delete(SessionInvitation).where(SessionInvitation.session_id == session.id)
            )

            invitation_list: list[str] = []
            if session_data.enrollment_method == SessionEnrollmentMethod.manual_invite:
                invitation_list = session_data.invitation_list
            else:
                if csv_file is None:
                    raise APIException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        message="CSV file is required when enrollment method is bulk upload.",
                        error_code=APIErrorCodes.INVALID_ENROLLMENT_DATA,
                    )

                try:
                    # extract the enrollment data from the csv file
                    invitation_list = _extract_session_invites_from_csv(csv_file)
                except ValueError as error:
                    raise APIException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        message="Invalid csv file. Ensure csv matches the required format.",
                        error_code=APIErrorCodes.INVALID_ENROLLMENT_DATA,
                        detail={"reason": str(error)},
                    ) from error
            
            session_invites = [
                SessionInvitation(matric_no=matric_no, session=session)
                for matric_no in set(invitation_list)
            ]

            # Add validation check for empty invitation list
            if not session_invites:
                raise APIException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="Invitation list cannot be empty.",
                    error_code=APIErrorCodes.INVALID_ENROLLMENT_DATA,
                )

            db_session.add_all(session_invites)

        # update session initialization stage and enrollment id
        session.invitation_id = secrets.token_urlsafe(10)
        session.initialization_stage = SessionInitializationStage.confirmation
        db_session.add(session)
        db_session.commit()

        return SessionCreationSchema(
            stage=session.initialization_stage,
            session_details=SessionCreationDetailSchema.model_validate(session)
        )


def confirm_session_creation_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_admin)],
    session: Annotated[WorkflowSession, Depends(get_session_in_creation_state_service)],
) -> WorkflowSession:
    """Confirm the creation of the session."""
    
    # check that session is in confirmation stage
    if session.initialization_stage != SessionInitializationStage.confirmation:
        raise APIException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Session is not in confirmation stage.",
            error_code=APIErrorCodes.BAD_REQUEST,
        )

    # mark session as created
    session.status = SessionStatus.created
    db_session.add(session)
    db_session.commit()

    # TODO: Trigger session created lifecycle event, here to notify other VPL services
    return session


def discard_session_service(
    db_session: Annotated[Session, Depends(require_db_session)],
    admin: Annotated[Admin, Depends(require_admin)],
    session: Annotated[WorkflowSession, Depends(get_session_in_creation_state_service)],
) -> None:
    """Discard a session in creation state service."""
    db_session.delete(session)
    db_session.commit()
    return session
