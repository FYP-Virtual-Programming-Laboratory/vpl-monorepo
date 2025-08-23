import re
from xmlrpc.client import ServerProxy
from supervisor.rpcinterface import SupervisorNamespaceRPCInterface
from sqlmodel import Session, select, col
from src.core.config import settings
from src.models import Worker
from src.schemas import WorkerStatus
from src.log import logger
from .schemas import TaskIQWorkerDetails, TaskIQWorkerState
from .worker_config import (
    GROUP_CONFIG_TEMPLATE, 
    WORKER_CONFIG_TEMPLATE,
)


class WorkerManager:
    """Manage worker processes using supervisord."""

    def __init__(self, db_session: Session) -> None:
        """Initialize the worker manager."""
        self.db_session = db_session
        self.supervisord_client: SupervisorNamespaceRPCInterface = ServerProxy(
            uri=settings.SUPERVISORD_SOCKET_URI,
        ).supervisor

    def _sync_worker_update(self) -> None:
        """Create new supervisord config for active workers."""

        worker_configs = ""
        workers = self.db_session.exec(
            select(Worker).where(
                col(Worker.status).in_([
                    WorkerStatus.adding,
                    WorkerStatus.online,
                    WorkerStatus.restarting,
                ]),
                Worker.is_default == False,
            )
        ).all()

        # Ensure we re-add default worker
        worker_names = [settings.DEFAULT_WORKER_NAME]
        for worker in workers:
            worker_configs += WORKER_CONFIG_TEMPLATE.format(
                worker_name=worker.name,
                no_of_threads=worker.no_of_threads,
                auto_start=True if worker.status == WorkerStatus.online else False,
            )
            worker_names.append(worker.name)

        group_config = GROUP_CONFIG_TEMPLATE.replace(
            '{programs}',
            ','.join(worker_names),
        )

        new_configuration = worker_configs + group_config
        previous_content = ''

        try:
            with open(settings.SUPERVISORD_CONFIG_URI, 'r') as f:
                previous_content = f.read()

            with open(settings.SUPERVISORD_CONFIG_URI, 'w') as f:
                # Replace everything between the START_BLOCK and END_BLOCK markers with new_configuration
                new_content = re.sub(
                    r"######## START_BLOCK ########.*?######## END_BLOCK ########",
                    f"######## START_BLOCK ########\n{new_configuration}\n######## END_BLOCK ########",
                    previous_content,
                    flags=re.DOTALL,
                )
                f.write(new_content)

            # Call supervisord to reload the configuration
            self.supervisord_client.reloadConfig()

        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::_sync_worker_update:: '
                'Config update failed :: {error}',
                exc_info=error,
                extra={
                    'previous_content': previous_content,
                    'new_content': new_content,
                }
            )

            # Restore config file
            with open(settings.SUPERVISORD_CONFIG_URI, 'w') as f:
                f.write(previous_content)

            raise RuntimeError(f"Failed to update supervisord configuration: {error}")

    def stop_worker(self, worker: Worker) -> None:
        """Stop a worker."""

        try:
            self.supervisord_client.stopProcess(name=worker.process_name)
            worker.status = WorkerStatus.offline
            self.db_session.add(worker)
            self.db_session.commit()
        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::stop_worker:: '
                'Failed to stop worker :: {worker_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )
            raise RuntimeError(f"Failed to stop worker {worker.name}: {error}")

    def start_worker(self, worker: Worker) -> None:
        """Start a worker."""

        try:
            self.supervisord_client.startProcess(name=worker.process_name)
            worker.status = WorkerStatus.online
            self.db_session.add(worker)
            self.db_session.commit()
        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::start_worker:: '
                'Failed to start worker :: {worker_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )
            raise RuntimeError(f"Failed to start worker {worker.name}: {error}")

    def restart_worker(self, worker: Worker) -> None:
        """Restart a worker."""

        try:
            self.supervisord_client.stopProcess(name=worker.process_name)
            self.supervisord_client.startProcess(name=worker.process_name)
            worker.status = WorkerStatus.online
            self.db_session.add(worker)
            self.db_session.commit()
        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::restart_worker:: '
                'Failed to restart worker :: {worker_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )
            raise RuntimeError(f"Failed to restart worker {worker.name}: {error}")

    def add_worker(self, worker: Worker) -> None:
        """Add a new worker."""

        try:
            self._sync_worker_update()
            worker.status = WorkerStatus.offline
            self.db_session.add(worker)
            self.db_session.commit()
        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::add_worker:: '
                'Failed to add worker :: {worker_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )
            raise RuntimeError(f"Failed to add worker {worker.name}: {error}")

    def remove_worker(self, worker: Worker) -> None:
        """Remove a worker."""

        try:
            # Stop the worker first if it's running
            if worker.status == WorkerStatus.online:
                self.stop_worker(worker)

            self._sync_worker_update()
            # Delete worker from database
            self.db_session.delete(worker)
            self.db_session.commit()

        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::remove_worker:: '
                'Failed to remove worker :: {worker_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )
            raise RuntimeError(f"Failed to remove worker {worker.name}: {error}")

    def sync_worker_state_with_process_state(self, worker: Worker | None = None) -> None:
        """Sync db worker states with process states."""

        workers = (
            self.db_session.exec(select(Worker)).all() 
            if worker is None else [worker]
        )

        for worker in workers:
            details = self.get_worker_details(worker)
            if details is not None:
                worker.pid = details.pid
                worker.status = TaskIQWorkerState.get_worker_status(
                    process_state=details.status,
                    previous_status=worker.status,
                )
        self.db_session.add_all(workers)
        self.db_session.commit()

    def get_worker_details(self, worker: Worker) -> TaskIQWorkerDetails | None:
        """Get details of all workers."""

        try:
            data = self.supervisord_client.getProcessInfo(worker.process_name)
            return TaskIQWorkerDetails(
                pid=data['pid'],
                spawnerr=data['spawnerr'],
                timestamp=data['now'],
                group_name=data['group'],
                process_name=data['name'],
                stop_timestamp=data['stop'],
                start_timestamp=data['start'],
                status=data['state'],
            )
        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::get_worker_details:: '
                f'Failed to get worker details :: {worker.process_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )
