#!/bin/sh
set -o errexit
set -o nounset

# run openrc
openrc
touch /run/openrc/softlevel
service docker start

# change directory so file discovery only picks **tasks.py
# files in the source folder.
taskiq scheduler -fsd src.worker:scheduler \
    --skip-first-run --log-level "INFO" \
    --tasks-pattern "./src/**/tasks.py"
