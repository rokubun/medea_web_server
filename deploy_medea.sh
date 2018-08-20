#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

$PATHNAME = "medea"
$MEDEA_PATH = ~/$PATHNAME

# Clone MEDEA web server into home
cd ~
git clone https://github.com/rokubun/medea_web_server.git $PATHNAME

# Install NodeJS 10.x
apt-get install python-software-properties
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get install -y nodejs

# Install node packets
cd $MEDEA_PATH/frontend
npm install http-server

cd $MEDEA_PATH/api
npm install


