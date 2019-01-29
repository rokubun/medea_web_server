#!/bin/bash
# OFONO_SCRIPTS="/usr/share/ofono/scripts"

# python3 $OFONO_SCRIPTS/deactivate-all
# python3 $OFONO_SCRIPTS/remove-contexts
# python3 $OFONO_SCRIPTS/offline-modem

# Turn SARA off
source ~/xgpio_functions.sh
xgpio_low 7
