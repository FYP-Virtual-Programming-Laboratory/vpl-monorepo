from sqlmodel import Session, select
from src.core.config import settings
from src.models import Admin
from src.core.security import get_password_hash


def __create_super_admin(db_session: Session) -> None:
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


def create_fixtures(db_session: Session) -> None:
    """Creata DB fixtures."""

    __create_super_admin(db_session=db_session)
