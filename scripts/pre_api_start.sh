#!/bin/bash

# Get the absolute path of the MEDEA_WEB_SERVER
# Folders 'api', 'frontend' and 'scripts' shall respect the relative paths used in this script
MEDEA_WEB_SERVER=`dirname $(dirname $(realpath $0))`
# It will work as long as the last component of the path used to find the script is not a symlink 
# (directory links are OK)

# Disable WiFi chipset
echo 0 > /sys/devices/platform/sd8x-rfkill/pwr_ctrl
rmmod sd8xxx mlan

# Enable WiFi chipset using SPA+AP mode
modprobe mlan
modprobe sd8xxx drv_mode=5
echo 3 > /sys/module/sd8xxx/parameters/drv_mode
echo 1 > /sys/devices/platform/sd8x-rfkill/pwr_ctrl

# Restart wpa to identify interfaces
systemctl restart wpa_supplicant

# Enable WiFi Hotspot
ifconfig uap0 10.42.0.1 up
nmcli connection up hotspot

# Setup cellular (this might be a redundant step)
systemctl start ModemManager

# The corresponding cellular service shall have been configured to autoconnect
$MEDEA_WEB_SERVER/scripts/start_sara.sh

# Monitor API and Frontend processes and restart them forever
mkdir -p $MEDEA_WEB_SERVER/api/logs