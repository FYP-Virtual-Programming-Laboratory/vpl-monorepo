from typing import Annotated, Literal

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session

from src.core.dependecies import require_db_session
from src.sandbox.router import router as sandbox_routes
from src.accounts.routes import router as accounts_router
from src.session.routes import router as session_routes

router = APIRouter()
router.include_router(sandbox_routes, prefix="/sandbox", tags=["sandbox"])
router.include_router(accounts_router, prefix="/accounts", tags=["accounts"])
router.include_router(session_routes, prefix="/sessions", tags=["sessions"])


class HealthCheckResponse(BaseModel):
    status: Literal["ok", "error"]
    database_status: Literal["ok", "error"]


@router.get("/health-check/", tags=["health_check"])
def health_check(
    db_session: Annotated[Session, Depends(require_db_session)],
) -> HealthCheckResponse:
    return HealthCheckResponse(
        status="ok",
        database_status=db_session.is_active and "ok" or "error",
    )

