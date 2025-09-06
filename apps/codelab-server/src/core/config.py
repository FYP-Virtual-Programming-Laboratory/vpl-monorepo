import os
import secrets
import warnings
from typing import Annotated, Any, Literal

from pydantic import (
    AnyUrl,
    BeforeValidator,
    Field,
    HttpUrl,
    computed_field,
    model_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Use top level .env file (one level above ./backend/)
        env_file="../.env",
        env_ignore_empty=True,
        extra="ignore",
    )

    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    EXTERNAL_API_KEY: str = secrets.token_urlsafe(32)
    VPL_API_KEY: str = secrets.token_urlsafe(32)
    VPL_FRONTEND_BASE_URL: str = "http://localhost:3000"

    SUBMISSION_DIR: str
    TESTING_DIR: str
    FILESYSTEM_DIR: str
    
    CODE_COLLAB_SERVICE_BASE_URL: str
    CODE_COLLAB_SERVICE_API_KEY: str
    CODE_COLLAB_SERVICE_TIMEOUT: float = 5

    LOAD_FIXTURES: bool = Field(
        default=False,
        description="Permit loading seed fixtures at startup (do not enable in production)."
    )
    SUPER_ADMIN_EMAIL: str
    SUPER_ADMIN_PASSWORD: str
    SUPER_ADMIN_FIRST_NAME: str = 'John'
    SUPER_ADMIN_LAST_NAME: str = 'Doe'

    # 60 minutes * 24 hours * 8 days = 8 days
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS]

    PROJECT_NAME: str
    SENTRY_DSN: HttpUrl | None = None
    SQLITE_DATABASE_PATH: str
    TEST_DATABASE_PATH: str

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        path = (
            os.path.realpath(self.SQLITE_DATABASE_PATH)
            if self.ENVIRONMENT in ["local", "production"]
            else os.path.realpath(self.TEST_DATABASE_PATH)
        )
        return f"sqlite://{path}"

    # worker settings
    WORKER_BROKER_URL: str = "redis://localhost:6379"
    WORKER_RESULT_BACKEND: str = "redis://localhost:6379"
    DEFAULT_WORKER_ID: str
    DEFAULT_WORKER_NAME: str
    DEFAULT_WORKER_GROUP_NAME: str
    SERVER_PROCESS_NAME: str
    SUPERVISORD_CONFIG_PATH: str
    SUPERVISORD_USERNAME: str
    SUPERVISORD_PASSWORD: str
    SUPERVISORD_HTTP_PORT: str


    @computed_field  # type: ignore[prop-decorator]
    @property
    def SUPERVISORD_CONFIG_URI(self) -> str:
        return os.path.realpath(self.SUPERVISORD_CONFIG_PATH)

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SUPERVISORD_SOCKET_URI(self) -> str:
        return f'http://{self.SUPERVISORD_USERNAME}:{self.SUPERVISORD_PASSWORD}@localhost:{self.SUPERVISORD_HTTP_PORT}/RPC2'

    def _check_default_secret(self, var_name: str, value: str | None) -> None:
        if value == "changethis":
            message = (
                f'The value of {var_name} is "changethis", '
                "for security, please change it, at least for deployments."
            )
            if self.ENVIRONMENT in ["local", "staging"]:
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("SECRET_KEY", self.SECRET_KEY)
        self._check_default_secret("EXTERNAL_API_KEY", self.EXTERNAL_API_KEY)
        self._check_default_secret("VPL_API_KEY", self.VPL_API_KEY)
        self._check_default_secret("SUPER_ADMIN_PASSWORD", self.SUPER_ADMIN_PASSWORD)
        self._check_default_secret("SUPERVISORD_PASSWORD", self.SUPERVISORD_PASSWORD)
        return self
        
    @model_validator(mode="after")
    def _validate_fixtures_config(self) -> Self:
        if self.ENVIRONMENT == "production" and self.LOAD_FIXTURES:
            raise ValueError(
                "LOAD_FIXTURES must be disabled in production for security reasons"
            )
        return self


settings = Settings()  # type: ignore
