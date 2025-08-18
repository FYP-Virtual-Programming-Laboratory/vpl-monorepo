from datetime import datetime, timedelta
from typing import Annotated
from uuid import UUID

from docker.errors import DockerException
from docker.models.containers import Container
from sqlmodel import Session, col, select

from src.core.config import settings
from src.core.db import engine
from src.core.docker import get_shared_docker_client
from src.external.exceptions import PullRepositoryException
from src.log import logger
from src.models import ExerciseSubmission, LanguageImage, Task
from src.sandbox.constants import IMAGE_BUILD_TASK_CONCURRENCY_KEY
from src.sandbox.manager import ExecutionFailedError, ResourceManager
from src.sandbox.ochestator.image import ImageBuilder
from src.sandbox.schemas import ExecutionLogSchema
from src.sandbox.types import CONTAINER_LABEL
from src.schemas import ImageStatus, TaskStatus
from src.external.utils import pull_excercise_repository
from src.worker import broker, require_db_session
from taskiq import TaskiqDepends


@broker.task(
    task_name='build_language_image_task',
    prevent_concurrency=True,
    concurrency_key=IMAGE_BUILD_TASK_CONCURRENCY_KEY
)
async def build_language_image_task(
    db_session: Annotated[Session, TaskiqDepends(require_db_session)],
    image_id: UUID,
) -> None:
    """Build a language image."""

    language_image = db_session.exec(
        select(LanguageImage).where(LanguageImage.id == image_id)
    ).first()

    if not language_image:
        return

    # create and run a new Docker image builder
    builder = ImageBuilder(db_session, language_image)
    builder.run()


@broker.task(
    task_name='cleanup_handing_builds_tasks',
    schedule=[{"cron": "*/2 * * * *"}],  # Run every 2 minutes
    prevent_concurrency=True,
    concurrency_key=IMAGE_BUILD_TASK_CONCURRENCY_KEY,
)
async def cleanup_handing_builds_tasks(
    db_session: Annotated[Session, TaskiqDepends(require_db_session)]
) -> None:
    """Mark all hanging language builds as failed."""

    # get all hanging builds and mark them as failed
    for language_image in db_session.exec(
        select(LanguageImage).where(
            col(LanguageImage.status).in_(
                [
                    ImageStatus.building,
                    ImageStatus.testing,
                    ImageStatus.created,
                ]
            ),
            LanguageImage.created_at < datetime.now() - timedelta(minutes=10)
        )
    ).all():
        corresponding_failed_status = {
            ImageStatus.building: ImageStatus.build_failed,
            ImageStatus.testing: ImageStatus.testing_failed,
            ImageStatus.created: ImageStatus.failed,
        }

        if language_image.status == ImageStatus.testing:
            language_image.failure_message = (
                "Testing failed catastrophically: Container crashed during testing..."
            )
        else:
            language_image.failure_message = "Build failed for unhandled reasons. Please reach out to the developers."

        language_image.status = corresponding_failed_status.get(
            language_image.status, ImageStatus.failed
        )

        db_session.add(language_image)
        db_session.commit()


@broker.task(
    task_name='execute_scheduled_build_actions_task',
    schedule=[{"cron": "*/2 * * * *"}],  # Run every 2 minutes
)
async def execute_scheduled_build_actions_task(
    db_session: Annotated[Session, TaskiqDepends(require_db_session)]
) -> None:
    """Execute scheduled build actions."""

    # get all scheduled builds and execute them
    images = db_session.exec(
        select(LanguageImage)
        .filter(
            col(LanguageImage.status).in_(
                [
                    ImageStatus.scheduled_for_rebuild,
                    ImageStatus.scheduled_for_deletion,
                    ImageStatus.scheduled_for_prune,
                ]
            )
        )
        .order_by(col(LanguageImage.updated_at))
    ).all()

    if not images:
        return

    for language_image in images:
        if language_image.status == ImageStatus.scheduled_for_rebuild:
            build_language_image_task.kiq(image_id=language_image.id)
            continue

        if language_image.status == ImageStatus.scheduled_for_deletion:
            builder = ImageBuilder(db_session, language_image)
            successful = builder.remove()
            if successful:
                db_session.delete(language_image)
                db_session.commit()
                continue

        if language_image.status == ImageStatus.scheduled_for_prune:
            builder = ImageBuilder(db_session, language_image)
            successful = builder.remove()
            if successful:
                language_image.status = ImageStatus.unavailable
                db_session.add(language_image)
                db_session.commit()
                continue


def _update_execution_log(
    db_session: Session, 
    request: Task | ExerciseSubmission,
    message: str,
) -> None:
    """Update task execution log."""
    execution_logs = list(request.execution_logs)
    execution_logs.append(
        ExecutionLogSchema(
            timestamp=str(datetime.now()), message=message
        ).model_dump()        
    )
    request.execution_logs = execution_logs
    db_session.add(request)
    db_session.commit()
    db_session.refresh(request)


@broker.task(task_name="program_execution_queue")
async def program_execution_queue(
    db_session: Annotated[Session, TaskiqDepends(require_db_session)],
    task_id: UUID | None = None,
    submission_id: UUID | None = None,
) -> None:
    """Execute queued program execution request."""

    assert task_id is not None or submission_id is not None, "task_id or submission_id must be provided"

    request: Task | ExerciseSubmission | None = None
    
    if task_id:
        request = db_session.exec(
            select(Task).where(Task.id == task_id, Task.status == TaskStatus.queued)
        ).first()
    
    elif submission_id:
        request = db_session.exec(
            select(ExerciseSubmission).where(
                ExerciseSubmission.id == submission_id, 
                ExerciseSubmission.status == TaskStatus.queued,
            )
        ).first() 

    if not request:
        logger.error(
            "src::sandbox:tasks::program_execution_queue:: "
            "Program execution request not found or is no longer in queue.",
            extra={
                'task_id': str(task_id),
                'submission_id': str(submission_id),
            }
        )
        return

    # set task status to executing
    request.status = TaskStatus.executing
    _update_execution_log(
        db_session=db_session,
        request=request,
        message='Execution started.',
    )

    try:
        # pull code repository from codecollab repository
        # set execution log to pulling code repository
        _update_execution_log(
            db_session=db_session,
            request=request,
            message='Pulling code repository.',
        )
        code_repository = pull_excercise_repository(
            request.exercise_id, 
            request.exercise.session_id,
        )
        _update_execution_log(
            db_session=db_session,
            request=request,
            message='Repository pulled successfully.',
        )
    except PullRepositoryException as error:
        logger.exception(
            "src::sandbox:tasks::program_execution_queue:: "
            "Repository pull failed.",
            extra={
                'task_id': str(task_id),
                'submission_id': str(submission_id),
                "session_id": str(request.exercise.session_id),
                "error_message": error.message,
            }
        )

        request.status = TaskStatus.dropped
        _update_execution_log(
            request=request,
            db_session=db_session,
            message='Service error. Aborting, failed to pull code repository.',
        )
        return

    _update_execution_log(
        request=request,
        db_session=db_session,
        message='Executing program.',
    )

    try:
        manager = ResourceManager()
        execution_result = manager.execute(
            request=request,
            code_repository=code_repository, 
        )

        request.results = [
            result.model_dump()
            for result in execution_result
        ]
        request.status = TaskStatus.executed
        _update_execution_log(
            db_session=db_session,
            request=request,
            message='Execution completed.',
        )
    except ExecutionFailedError as error:
        request.status = TaskStatus.dropped
        _update_execution_log(
            request=request,
            db_session=db_session,
            message=f'Service error: Aborting, failed to execute program. {error}',
        )
