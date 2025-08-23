"""Task worker setup and broker configuration."""

import taskiq_fastapi
from taskiq_redis import RedisAsyncResultBackend, RedisStreamBroker
from taskiq.schedule_sources import LabelScheduleSource
from taskiq import TaskiqScheduler
from src.core.config import settings
from .middleware import ConcurrencyMiddleware

# Setup result backend and broker
result_backend = RedisAsyncResultBackend(redis_url=settings.WORKER_BROKER_URL)
broker = RedisStreamBroker(
    url=settings.WORKER_BROKER_URL
).with_result_backend(result_backend)
broker.add_middlewares(ConcurrencyMiddleware())

# Setup scheduler
scheduler = TaskiqScheduler(
    broker=broker,
    sources=[LabelScheduleSource(broker)],
)

# Initialize FastAPI integration
taskiq_fastapi.init(broker, "src.main:app")
