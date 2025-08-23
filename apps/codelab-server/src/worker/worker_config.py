"""Worker configuration templates and constants."""

GROUP_CONFIG_TEMPLATE = (
"""
[group:workers]
programs={programs}
"""
)

WORKER_CONFIG_TEMPLATE = (
"""

[program:{worker_name}]
command=exec taskiq worker -fsd src.worker:broker -w "{no_of_threads}" --tasks-pattern "./src/**/tasks.py"
process_name=%(program_name)s
numprocs=1
directory=/codelab
priority=999
autostart={auto_start}
autorestart=unexpected
startsecs=10
startretries=3
exitcodes=0
stopsignal=TERM
stopwaitsecs=10
stopasgroup=true
killasgroup=true
user=root
redirect_stderr=true
stdout_logfile=AUTO
stdout_logfile_maxbytes=10MB
stdout_logfile_backups=10
stdout_capture_maxbytes=10MB
stdout_events_enabled=false
stderr_logfile=AUTO
stderr_logfile_maxbytes=10MB
stderr_logfile_backups=10
stderr_capture_maxbytes=10MB
stderr_events_enabled=false
serverurl=AUTO

"""
)
