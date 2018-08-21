#!/bin/bash
OFONO_SCRIPTS="/usr/share/ofono/scripts"

python3 $OFONO_SCRIPTS/deactivate-all
python3 $OFONO_SCRIPTS/remove-contexts
python3 $OFONO_SCRIPTS/offline-modem

# Kill ofonod
# ps axf | grep <process name> | grep -v grep | awk '{print "kill -9 " $1}' | sh

