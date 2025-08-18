#!/bin/sh
set -o errexit
set -o nounset

# run openrc
openrc
touch /run/openrc/softlevel
service docker start

# change directory so file discovery only picks **tasks.py
# files in the source folder.
exec taskiq worker -fsd src.worker:broker \
    -w "1" --max-fails "1" --log-level "INFO" \
    --tasks-pattern "./src/**/tasks.py"
