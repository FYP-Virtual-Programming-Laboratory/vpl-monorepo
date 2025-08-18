from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from src.worker import broker


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan events for the FastAPI application."""

    if not broker.is_worker_process:
        await broker.startup()

    yield

    if not broker.is_worker_process:
        await broker.shutdown()
