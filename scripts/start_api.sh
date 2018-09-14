#!/bin/bash

# Get the absolute path of the MEDEA_WEB_SERVER
# Folders 'api', 'frontend' and 'scripts' shall respect the relative paths used in this script
MEDEA_WEB_SERVER=`dirname $(dirname $(realpath $0))`
# It will work as long as the last component of the path used to find the script is not a symlink 
# (directory links are OK)

# Start API process function
start_api () {
  cd $MEDEA_WEB_SERVER/api
  node server.js &
  PID_API=$!
  echo "New API PID: $PID_API"
}

# Setup Wifi as an access point
connmanctl tether wifi on MEDEA rocboronat

# Setup cellular (this might be a redundant step)
connmanctl enable cellular

# The corresponding cellular service shall have been configured to autoconnect
$MEDEA_WEB_SERVER/scripts/start_sara.sh
# Test connectivity until success or timeout after 60 seconds
# echo -ne "Monitoring cellular connection..."
# while true; do
#   $MEDEA_WEB_SERVER/scripts/test_connection.sh
#   if [ $? -eq 2 ]; then
#     $MEDEA_WEB_SERVER/scripts/start_sara.sh
#     sleep 5
#   fi
# done

# Monitor API and Frontend processes and restart them forever
start_api
while true; do

  # Restart API process if dead 
  if kill -0 "$PID_API" >/dev/null 2>&1 ; then
      # echo "PID API: $PID_API running"
      :
  else
      echo "PID API: $PID_API terminated"
      start_api
  fi
  
  sleep 3
done
