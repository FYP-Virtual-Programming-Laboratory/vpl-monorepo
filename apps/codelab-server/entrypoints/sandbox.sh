#!/bin/sh
set -o errexit
set -o nounset

# run openrc
openrc
touch /run/openrc/softlevel
service docker start

exec supervisord -c ./supervisord/supervisord.conf
tail -f ./supervisord/*.log
