#!/bin/bash

# Get the absolute path of the MEDEA_WEB_SERVER
# Folders 'api', 'frontend' and 'scripts' shall respect the relative paths used in this script
MEDEA_WEB_SERVER=`dirname $(dirname $(realpath $0))`
# It will work as long as the last component of the path used to find the script is not a symlink 
# (directory links are OK)

export DEBUG="Medea,Sockets,UploadFile,RtkReceiver,rtkStatus"

# Disable Wifi tethering
connmanctl tether wifi off

# Disable MEDEA service
systemctl stop medea.service

# Update and deploy (commented since the uplink might not be available)
$MEDEA_WEB_SERVER/../test_connection.sh
if [ $? -eq 0 ]; then
  cd $MEDEA_WEB_SERVER
  git pull
  cd $MEDEA_WEB_SERVER/api
  npm install
fi

$MEDEA_WEB_SERVER/scripts/start_api.sh
