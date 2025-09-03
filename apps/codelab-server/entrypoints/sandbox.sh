#!/bin/sh
set -o errexit
set -o nounset

# run openrc
openrc
touch /run/openrc/softlevel
service docker start

# clean previous logs (idempotent)
mkdir -p ./supervisord/logs
rm -r ./supervisord/logs/* 2>/dev/null || true

supervisord -c ./supervisord/supervisord.conf &
chmod +rwx ./supervisord/logs/*.log 2>/dev/null || true
sleep 4
tail -F ./supervisord/logs/*.log
