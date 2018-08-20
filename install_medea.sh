#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Install Linux packages
apt-key add /var/lib/apt/keyrings/artik-platform-keyring.gpg
apt-get update
apt-get upgrade
apt-get install git gitk ofono ofono-scripts nano

# Install NodeJS 10.x
apt-get install python-software-properties
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get install -y nodejs

# Install node packets
npm install http-server -g
cd api
npm install


