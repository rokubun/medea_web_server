#!/bin/bash

# Get the absolute path of the MEDEA_WEB_SERVER
# Folders 'api', 'frontend' and 'scripts' shall respect the relative paths used in this script
MEDEA_WEB_SERVER=`dirname $(dirname $(realpath $0))`
# It will work as long as the last component of the path used to find the script is not a symlink 
# (directory links are OK)

export DEBUG="Medea,Sockets,UploadFile,RtkReceiver,rtkStatus"

# Start API process function
start_api () {
  cd $MEDEA_WEB_SERVER/api
  node server.js &
  PID_API=$!
  echo "New API PID: $PID_API"
}

# Start Frontend process function
start_frontend () {
  cd $MEDEA_WEB_SERVER/frontend
  http-server . -p 5000 &
  PID_FRONT=$!
  echo "New Front PID: $PID_FRONT"
}


# Update deploy (commented since the uplink might not be available)
$MEDEA_WEB_SERVER/scripts/test_connection.sh
if [ $? -eq 0 ]; then
  cd $MEDEA_WEB_SERVER
  git pull
  cd $MEDEA_WEB_SERVER/api
  npm install
fi

# Monitor API and Frontend processes and restart them forever
start_api
start_frontend
while true; do

  # Restart API process if dead 
  if kill -0 "$PID_API" >/dev/null 2>&1 ; then
      # echo "PID API: $PID_API running"
      :
  else
      echo "PID API: $PID_API terminated"
      start_api
  fi
  
  # Restart Frontend process if dead 
  if kill -0 "$PID_FRONT" >/dev/null 2>&1 ; then
      # echo "PID Front: $PID_FRONT running"
      :
  else
      echo "PID Front: $PID_FRONT terminated"
      start_frontend
  fi
  sleep 3
done
