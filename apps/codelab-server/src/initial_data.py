import logging

from sqlmodel import Session

from src.core.db import engine, init_db
from src.fixtures.main import create_fixtures
import asyncio
from src.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def init() -> None:
    with Session(engine) as session:
        init_db(session)

        if settings.LOAD_FIXTURES:
            await create_fixtures(db_session=session)


async def main() -> None:
    logger.info("Creating initial data.")
    await init()
    logger.info("Initial data created.")


if __name__ == "__main__":
    asyncio.run(main())
