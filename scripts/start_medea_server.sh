#!/bin/bash
MEDEA_WEB_SERVER="/home/medea/medea_web_server"

# Update deploy 
cd $MEDEA_WEB_SERVER
git pull
# cd /home/medea/

# Setup Wifi as an access point
# ./start_ap.sh

# Setup cellular
#./start_sara.sh

# Start RTKLIB (backend)
RTKLIB_PATH=$MEDEA_WEB_SERVER/rtklib

# Launch RTKRCV process in foreground
$RTKLIB_PATH/rtkrcv -s -o $RTKLIB_PATH/rok-rtk.conf &

# Start api
cd $MEDEA_WEB_SERVER/api
#npm install      # Delete this line in the production version (should be manually executed upfront)
npm start &

# Start frontend
cd $MEDEA_WEB_SERVER/frontend
#npm install      # Delete this line in the production version
http-server . -p 5000 &
#serve -s /build &