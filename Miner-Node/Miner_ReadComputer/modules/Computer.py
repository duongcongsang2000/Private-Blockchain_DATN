import json
import time

# Importing the library
import psutil
import time

def get_computer_info():

    TIME= time.asctime( time.localtime(time.time()) )
    print("Total Time :",TIME)

    # RAM
    RAM = psutil.virtual_memory()[2] 
    # / 1024/1024/1024 ( tinh sang Thong so ram )
    print("Total RAM :", RAM)

    # CPU
    # Calling psutil.cpu_precent() for 4 seconds
    CPU = psutil.cpu_percent(4)
    print('The CPU usage is: ', CPU)

    # DISK
    hdd = psutil.disk_usage('/')
    hhd_total = hdd.percent
    # hhd_total = hdd.total / (2**30)
    print('Total DISK: ',hhd_total)
    # print("Used: {} GiB".format(hdd.used / (2**30)))
    # print("Free: {} GiB".format(hdd.free / (2**30)))

    return TIME,RAM, CPU, hhd_total

# TIME, CPU, RAM, DISK = get_computer_info()