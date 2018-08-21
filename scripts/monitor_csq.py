#!/usr/bin/python3
# This script monitors the cellular signal quality (CSQ) once per second, using the following figures:
# RSSI - received signal strength indication
# BER - bit error rate (in percent)
#
# Prerequisites:
# curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
# python3 get-pip.py
# pip install pyserial
#
# Reference: ETSI GSM 05.08

import sys
import time
import serial
import signal

def signal_handler(sig, frame):
    print('You pressed Ctrl+C!')
    phone.close()
    sys.exit(0)

phone = serial.Serial('/dev/ttyACM2', 115200, timeout=5)
signal.signal(signal.SIGINT, signal_handler)
while 1:
  time.sleep(1)
  phone.write(b'AT+CSQ\r')
  for x in range(4):
  
    if x==1: # Process the CSQ response sent by modem
      response = phone.readline().decode('ascii').rstrip()
      
      rssi = int(response[6:8])
      rssi_str = 'error'
      if rssi==99:
        rssi_str = 'nan'
      elif rssi==0:
        rssi_str = '< -113 dBm'
      else:
        rssi_str = str(-53 - 2*(30 - rssi)) + ' dBm'
      
      ber = int(response[9:11])
      ber_str = 'error'
      if ber==99:
        ber_str = 'nan'
      elif rssi==0:
        ber_str = '< 0.2%'
      elif rssi==7:
        ber_str = '> 12.8%'
      else:
        ber_str = str(14 * (1 + ber) / 100) + '%'
        
      print(response + ' -> RSSI: ' + rssi_str + ', BER: ' + ber_str)
      
    else:    # Ignore echoes
      phone.readline()