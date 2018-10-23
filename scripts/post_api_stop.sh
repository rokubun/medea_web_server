#!/bin/bash

# Get the absolute path of the MEDEA_WEB_SERVER
# Folders 'api', 'frontend' and 'scripts' shall respect the relative paths used in this script
MEDEA_WEB_SERVER=`dirname $(dirname $(realpath $0))`
# It will work as long as the last component of the path used to find the script is not a symlink 
# (directory links are OK)

# Setup Wifi as an access point
connmanctl tether wifi off

# Setup cellular (this might be a redundant step)
connmanctl disable cellular

# The corresponding cellular service shall have been configured to autoconnect
$MEDEA_WEB_SERVER/scripts/stop_sara.sh