from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from sqlmodel import Session, select
from src.core.db import engine
from src.core.config import settings
from src.worker import broker, sync_worker_state_with_process_task
from src.models import Worker


async def _sync_default_worker_state() -> None:
    """Ensure we sync the default worker state with supervisord at startup."""
    with Session(engine) as db_session:
        default_worker = db_session.exec(
            select(Worker).where(Worker.name == settings.DEFAULT_WORKER_NAME)
        ).first()

        await sync_worker_state_with_process_task.kiq(
            worker_id=default_worker.id if default_worker else None
        )


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan events for the FastAPI application."""

    if not broker.is_worker_process:
        await broker.startup()

    await _sync_default_worker_state()

    yield

    if not broker.is_worker_process:
        await broker.shutdown()
