#!/bin/bash

#./start_sara.sh

connmanctl tether wifi on MEDEA R0k0b0n0
#ifconfig wlan0 down

# Launch RTKRCV process in foreground
#RTKRCV_PATH="rtklib/app/rtkrcv"
#./$RTKRCV_PATH/gcc/rtkrcv -s -o $RTKRCV_PATH/conf/rok-rtk.conf &
#RTKLIB_PID=$!
#echo "RTKLIB PID: $RTKLIB_PID"

#node server.js &
#NODEJS_PID=$!
#echo "NODEJS PID: $NODEJS_PID"
