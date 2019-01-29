#!/bin/bash
# OFONO_SCRIPTS="/usr/share/ofono/scripts"

# Turn SARA on
source ~/xgpio_functions.sh
xgpio_high 7
sleep 10

# Ofonod is already running in background on startup
# python3 $OFONO_SCRIPTS/enter-pin "pin" "3782"

# Restart Ofonod to allow finding the modem unlocked and transfer context to ConnMan
# sudo service ofono restart
# python3 $OFONO_SCRIPTS/online-modem
# python3 $OFONO_SCRIPTS/create-internet-context "orangeworld"
# sleep 10
# python3 $OFONO_SCRIPTS/activate-context
# python3 $OFONO_SCRIPTS/process-context-settings
