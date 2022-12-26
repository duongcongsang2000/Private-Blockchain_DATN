import json
import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from modules import Computer


app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def index():
    return "<h1 style='text-align:center'>Welcome To API</h1>"

@app.route("/info/get", methods=['GET'])
def info_get():
    try:
        TIME,RAM, CPU, SSD= Computer.get_computer_info()
        data = {
            "TIME": TIME,
            "RAM": RAM,
            "CPU": CPU,
            "SSD": SSD,
            "ALERT": get_log()
        }
        
        return jsonify(data)
    except Exception as ex:
        print(ex)

def get_log():
    try:
        with open(log_path, 'r', encoding="utf8") as f:
            data = f.readlines()
            if len(data) > 5:
                alert_data = data[-4].strip('\n')
                if not os.path.exists("log.txt"):
                    with open("log.txt", 'w') as f:
                        pass
                with open("log.txt", 'r') as f:
                    log_data = f.read().strip('\n')

                if alert_data == log_data:
                    return "Unknown"
                else:
                    with open("log.txt", 'w') as f:
                        f.write(alert_data)
                    return " ".join(alert_data.split(" ")[1:]).strip('\n')
            else:
                return "Unknown"
    except Exception as ex:
        print("Get log error:", ex) 
        return "Unknown"

if __name__ == "__main__":
    with open("config.json") as f:
        data = json.load(f)
        port = data['port']
        log_path = data['log_path']
    
    app.run(debug=True, port=port)
    # app.run(host='0.0.0.0', port=port)
