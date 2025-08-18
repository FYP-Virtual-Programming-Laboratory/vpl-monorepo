import logging

from sqlmodel import Session

from src.core.db import engine, init_db
from src.fixtures.main import create_fixtures

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    with Session(engine) as session:
        init_db(session)
        create_fixtures(db_session=session)


def main() -> None:
    logger.info("Creating initial data.")
    init()
    logger.info("Initial data created.")


if __name__ == "__main__":
    main()
