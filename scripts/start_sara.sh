#!/bin/bash

# Turn SARA on
source ~/xgpio_functions.sh
xgpio_high 7
sleep 30

# Takes the saved pin
pin=$(nmcli --terse -s --fields gsm con show cellular | grep -P "(?<=pin:)[1-90-9]*" | awk -F: '{print $2}')

if [ $pin != "--" ]; then
  modem_idx=$(bash /root/medea_web_server/scripts/check_modemidx.sh)
  mmcli -i "$modem_idx" --pin="$pin"
fi