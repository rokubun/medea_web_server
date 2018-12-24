#!/bin/bash
OFONO_SCRIPTS="/usr/share/ofono/scripts"

# Turn SARA on
source ~/xgpio_functions.sh
xgpio_high 7
sleep 10

# Ofonod is already running in background on startup
#python3 $OFONO_SCRIPTS/unlock-pin "pin" "3782"
python3 $OFONO_SCRIPTS/enter-pin "pin" "3782"

# Restart Ofonod to allow finding the modem unlocked and transfer context to ConnMan
sudo service ofono restart
python3 $OFONO_SCRIPTS/online-modem
python3 $OFONO_SCRIPTS/create-internet-context "orangeworld"
sleep 10
python3 $OFONO_SCRIPTS/activate-context
python3 $OFONO_SCRIPTS/process-context-settings

#ping -I ppp0 -c 3 google.com
#dhcpcd ppp0
#ifconfig wlan0 down
#connmanctl tether wifi on ARCADIA R0k0b0n0
#sysctl net.ipv4.ip_forward=1
#iptables -t nat -A POSTROUTING -o ppp0 -j MASQUERADE
#iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
#iptables -A FORWARD -i tether -o ppp0 -j ACCEPT

# Configure DHCP for the SARA modem
#sleep 5
#dhclient ppp0
