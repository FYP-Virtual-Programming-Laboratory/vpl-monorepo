import re
import subprocess
from xmlrpc.client import ServerProxy
from supervisor.xmlrpc import SystemNamespaceRPCInterface
from supervisor.rpcinterface import SupervisorNamespaceRPCInterface
from sqlmodel import Session, select
from src.core.config import settings
from src.utils import atomic_transaction_block
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
        rpc_server = ServerProxy(uri=settings.SUPERVISORD_SOCKET_URI)
        self.supervisord_system_client: SystemNamespaceRPCInterface = rpc_server.system
        self.supervisord_client: SupervisorNamespaceRPCInterface = rpc_server.supervisor

    def _sync_worker_update(self) -> None:
        """Create new supervisord config for active workers."""

        worker_configs = ""
        workers = self.db_session.exec(
            select(Worker).where(
                Worker.status == WorkerStatus.online,
                Worker.is_default == False,
            )
        ).all()

        worker_names = []
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
            # NOTE: for some reason running `reloadConfig()` in xml rpc does not reload supervisord
            # so we're using supervisordctl group update command.

            result = subprocess.run(
                [
                    'supervisorctl',
                    '-c',
                    '/codelab/supervisord/supervisord.conf',
                    'update',
                    settings.DEFAULT_WORKER_GROUP_NAME,
                ],
                capture_output=True,
                text=True,
                check=False,
            )

            if result.returncode != 0:
                raise RuntimeError(f"supervisorctl update failed: {result.stderr}")

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

            # Restore the config file to it's previous state
            with open(settings.SUPERVISORD_CONFIG_URI, 'w') as f:
                f.write(previous_content)

            raise RuntimeError(f"Failed to update supervisord configuration: {error}")

    def stop_worker(self, worker: Worker) -> None:
        """Stop a worker."""

        try:
            with atomic_transaction_block(db_session=self.db_session):
                # mark worker as offline then sync config
                worker.status = WorkerStatus.offline
                self.db_session.add(worker)
                self.db_session.commit()
                self._sync_worker_update()
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
            raise RuntimeError(f"Failed to stop worker {worker.process_name}: {error}")

    def start_worker(self, worker: Worker) -> None:
        """Start a worker."""

        try:
            with atomic_transaction_block(db_session=self.db_session):
                worker.status = WorkerStatus.online
                self.db_session.add(worker)
                self.db_session.flush()
                self._sync_worker_update()

                # update worker PID and state
                self.sync_worker_state_with_process_state(worker=worker)
        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::start_worker:: '
                f'Failed to start worker :: {worker.process_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )
            raise RuntimeError(f"Failed to start worker {worker.process_name}: {error}")

    def add_worker(self, worker: Worker) -> None:
        """Add a new worker."""

        try:
            with atomic_transaction_block(db_session=self.db_session):
                worker.status = WorkerStatus.online
                self.db_session.add(worker)
                self.db_session.flush()
                self._sync_worker_update()

                # update worker PID and state
                self.sync_worker_state_with_process_state(worker=worker)
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
            raise RuntimeError(f"Failed to add worker {worker.process_name}: {error}")

    def remove_worker(self, worker: Worker) -> None:
        """Remove a worker."""

        try:
            with atomic_transaction_block(db_session=self.db_session):
                # Delete worker from database
                self.db_session.delete(worker)
                self.db_session.flush()
                self._sync_worker_update()
        except Exception as error:
            logger.error(
                'src::manager::WorkerManager::remove_worker:: '
                f'Failed to remove worker :: {worker.process_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )
            raise RuntimeError(f"Failed to remove worker {worker.name}: {error}")

    def sync_worker_state_with_process_state(self, worker: Worker | None = None, commit: bool = True) -> None:
        """Sync db worker states with process states."""

        workers = (
            self.db_session.exec(select(Worker)).all() 
            if worker is None else [worker]
        )

        # force commit if worker was not supplied
        commit = True if worker is None else commit

        calls =  [
            {
                'methodName': 'supervisor.getProcessInfo',
                'params': [worker.process_name]
            }
            for worker in workers
        ]

        results = self.supervisord_system_client.multicall(calls)
        workers_to_update = []

        for index, result in enumerate(results):              
            worker = workers[index]

            if isinstance(result, dict):
                logger.debug(
                    'src::manager::WorkerManager::sync_worker_state_with_process_state:: '
                    f'Failed to fetch worker details {worker.process_name}',
                    extra={
                        'error': result,
                        'worker_id': str(worker.id),
                        'process_name': worker.process_name,
                    }
                )
                continue
            
            try:
                if result is not None:
                    details = TaskIQWorkerDetails(
                        pid=result['pid'],
                        spawnerr=result['spawnerr'],
                        timestamp=result['now'],
                        group_name=result['group'],
                        process_name=result['name'],
                        stop_timestamp=result['stop'],
                        start_timestamp=result['start'],
                        status=result['state'],
                    )

                    worker.pid = details.pid
                    worker.status = TaskIQWorkerState.get_worker_status(process_state=details.status)
                    workers_to_update.append(worker)
            except KeyError:
                logger.error(
                    'src::manager::WorkerManager::sync_worker_state_with_process_state:: '
                    f'Failed to update worker details {worker.process_name}',
                )
                continue

        if commit:
            self.db_session.add_all(workers_to_update)
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
            # Log at info level since it's expected that the worker process may not always exist,
            # and temporary mismatches between process state and DB state are normal.
            logger.info(
                'src::manager::WorkerManager::get_worker_details:: '
                f'Failed to get worker details :: {worker.process_name} :: {error}',
                exc_info=error,
                extra={
                    'worker_id': str(worker.id),
                    'process_name': worker.process_name,
                }
            )

    def sync_worker_logs(self) -> None:
        """Sync worker logs."""

        workers = self.db_session.exec(
            select(Worker).where(Worker.status == WorkerStatus.online)
        ).all()

        calls = [
            {
                'methodName': 'supervisor.tailProcessStdoutLog',
                'params': [worker.process_name, 0, 1000] # pull last 1K bytes
            }
            for worker in workers
        ]

        with atomic_transaction_block(db_session=self.db_session):
            results = self.supervisord_system_client.multicall(calls)
            workers_to_update = []

            for index, result in enumerate(results):
                worker = workers[index]

                if isinstance(result, dict):
                    logger.debug(
                        'src::manager::WorkerManager::sync_worker_logs:: '
                        f'Failed to fetch logs for {worker.process_name}',
                        extra={
                            'error': result,
                            'worker_id': str(worker.id),
                            'process_name': worker.process_name,
                        }
                    )
                    continue

                log_data = result[0] or ''
                worker.update_logs(value=log_data)
                workers_to_update.append(worker)

            self.db_session.add_all(workers_to_update)
            self.db_session.commit()
