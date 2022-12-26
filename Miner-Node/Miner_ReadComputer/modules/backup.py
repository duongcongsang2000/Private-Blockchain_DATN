import json
import time

# Importing the library
import psutil
import requests
import time

def get_computer_info():

    TIME= time.asctime( time.localtime(time.time()) )
    print("Total Time :",TIME)

    # RAM
    RAM = psutil.virtual_memory()[0] / 1024/1024/1024
    print("Total RAM :", RAM)

    # CPU
    # Calling psutil.cpu_precent() for 4 seconds
    CPU = psutil.cpu_percent(4)
    print('The CPU usage is: ', CPU)

    # DISK
    hdd = psutil.disk_usage('/')
    hhd_total = hdd.total / (2**30)
    print('Total DISK: {hhd_total} GiB')
    # print("Used: {} GiB".format(hdd.used / (2**30)))
    # print("Free: {} GiB".format(hdd.free / (2**30)))

    return TIME,RAM, CPU, hhd_total


def add_info(url, TIME, CPU, RAM, DISK):
    payload = {
        "TIME":TIME,
        'CPU': CPU,
        'RAM': RAM,
        'SSD': DISK
    }
    files = [

    ]
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
    }

    response = requests.request(
        "POST", url, headers=headers, data=payload, files=files)

    print(response.text)

    if response.status_code == 200:
        data = response.json()
        print(data['newData'])

    else:
        print("Loi server: ", response.status_code)
if __name__ == '__main__':
    with open('config.json', 'r') as f:
        data = json.load(f)
        host = data['host']
        sleep = data['sleep']
    while True:
        TIME, CPU, RAM, DISK = get_computer_info()
        add_info(host, TIME, CPU, RAM, DISK)
        time.sleep(sleep*15)
