import requests
from ipify import get_ip
from datetime import date

today = date.today()
ip = get_ip()
print (ip)
r = requests.post("http://192.168.1.12:5000/api/v1/messages", json={"name": "medea", "message": "ip: {}".format(ip), "latitude": 41.38879, "longitude": 2.15899})