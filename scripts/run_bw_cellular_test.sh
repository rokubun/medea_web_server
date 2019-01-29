#!/bin/bash

#connmanctl tether wifi on RPI_SARA DAErocks
set +x
ifconfig wlan0 down
./start_sara.sh
# nmcli c add type gsm ifname "ttyACM0" con-name "cellular" apn "orangeworld"
sleep 25
modem_idx=`mmcli -L | grep -Po "([0-9]*)(?= \[)"`
mmcli -m $modem_idx
mmcli -i $modem_idx --pin=9193
nmcli r wwan on
sleep 15
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python -
nmcli r wwan off
sleep 5
./stop_sara.sh
ifconfig wlan0 up
