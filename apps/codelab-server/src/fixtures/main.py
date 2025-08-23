from sqlmodel import Session, select
from src.core.config import settings
from src.models import Admin, LanguageImage, Worker
from src.schemas import ImageStatus, WorkerStatus
from src.core.security import get_password_hash
from src.sandbox.tasks import build_language_image_task
from uuid import UUID


async def __create_super_admin(db_session: Session) -> None:
    """Create super admin."""

    # check if super admin account already exisits in DB
    admin = db_session.exec(
        select(Admin).where(Admin.email == settings.SUPER_ADMIN_EMAIL)
    ).first()

    if not admin:
        admin = Admin(
            email=settings.SUPER_ADMIN_EMAIL,
            password=get_password_hash(password=settings.SUPER_ADMIN_PASSWORD),
            first_name=settings.SUPER_ADMIN_FIRST_NAME,
            last_name=settings.SUPER_ADMIN_LAST_NAME,
            is_super_admin=True,
        )
        db_session.add(admin)
        db_session.commit()


async def __create_language_image(db_session: Session) -> None:
    """Create some base language images."""

    default_image_id = UUID('c19b4fb5-4547-4f07-a89d-3e8d74fa145b')

    # check if language image already exists in DB
    language_image = db_session.exec(
        select(LanguageImage).where(LanguageImage.id == default_image_id)
    ).first()

    if not language_image:
        # Create base language image
        language_image = LanguageImage(
            id=default_image_id,
            name="Python",
            version="3.12",
            base_image="python:3.12-alpine",
            description="Base Python3.12 image with no extra packages.",
            test_build=False,
            status=ImageStatus.created,
            file_extension=".py",
            compile_file_extension=None,
            build_test_file_content=None,
            build_test_std_in=None,
            requires_compilation=False,
            compilation_command=None,
            default_execution_command="python <filename>",
            entrypoint_script=None,
        )

        db_session.add(language_image)
        db_session.commit()
        await build_language_image_task.kiq(image_id=language_image.id)


async def __create_default_worker(db_session: Session) -> None:
    """Create default worker if it does not exist."""
    default_worker = db_session.exec(
        select(Worker).where(
            Worker.name == settings.DEFAULT_WORKER_NAME,
            Worker.is_default == True,
        )
    ).first()

    if not default_worker:
        default_worker = Worker(
            is_default=True,
            no_of_threads=1,
            status=WorkerStatus.online,
            name=settings.DEFAULT_WORKER_NAME,
        )
        db_session.add(default_worker)
        db_session.commit()


async def create_fixtures(db_session: Session) -> None:
    """Create DB fixtures."""

    await __create_super_admin(db_session=db_session)
    await __create_language_image(db_session=db_session)
    await __create_default_worker(db_session=db_session)
