#!/bin/bash

#connmanctl tether wifi on RPI_SARA DAErocks
set +x
ifconfig wlan0 down
./start_sara.sh
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python -
./stop_sara.sh
ifconfig wlan0 up