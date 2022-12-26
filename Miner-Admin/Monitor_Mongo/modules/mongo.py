import json
import time

import pymongo
from pymongo import MongoClient
from pymongo import collection
from bson import json_util
import requests

from model.response import ServiceResponse

class Mongo():
    def __init__(self, server, host, db):
        self.server = server
        self.host = f"mongodb://{host}"
        self.cluster = MongoClient(self.host)
        self.db = self.cluster[db]
        self.col_seeds = self.db["seeds"]
        self.col_public_key = self.db["public_key"]

    def get_all(self, collection, filter = {}, skip = 0, limit = 0, reversed=0):
        
        if reversed == 0:
            reversed_number = 1 
        else:
            reversed_number = -1
        if limit == 0:
            all_seeds = list(collection.find(filter).skip(skip).sort('_id', reversed_number))
        else:
            all_seeds = list(collection.find(filter).skip(skip).sort('_id', reversed_number).limit(limit))
        # print(all_seeds)
        return json.dumps(all_seeds, default=json_util.default)

    def get_data(self):
        payload={}
        headers = {}
        url = self.server + "/blocks"
        try:
            response = requests.request("GET", url, headers=headers, data=payload)
        except Exception as ex:
            print("Error get data:", ex)
            print("Reconnect")
            time.sleep(2)
            return self.get_data()
        return response.json()

    def add_seeds(self):
        # Get all hash 
        data = self.get_data()
        # Get last hash in mongodb
        last_element =  json.loads(self.get_all(self.col_seeds))
        index = 1
        try:
            print("Lasthash:", last_element[-1]['lastHash'])
        except:
            print("Lashhash null")

        if len(last_element) != 0:
            last_hash = last_element[-1]['lastHash']
            print("Last hash")
            for idx, i in reversed(list(enumerate((data)))):
                # print(i['lash'])
                if i['lastHash'] == last_hash:
                    index = idx+1
                    print("lashHash in ", index)
                    break

        list_result = []
        for idx, i in list(enumerate(data[index:])):
            # print(i)
            # print(type(i['data']))
            # print(i['data'][0])
            # for x in i['data']:
            #     print(x)
            # exit()
            result = {
                "hash": i['hash'],
                "lastHash": i['lastHash'],
                "input": {
                    "timestamp": i['data'][0]['input']['timestamp'],
                    "address": i['data'][0]['input']['address'],
                },
                "output": {
                    "cpu": i['data'][0]['outputs'][0]['cpu'],
                    "ram": i['data'][0]['outputs'][0]['ram'],
                    "disk": i['data'][0]['outputs'][0]['disk'],
                    "alert": i['data'][0]['outputs'][0]['alert'],
                    "address": i['data'][0]['outputs'][0]['address']
                }
            }
            list_result.append(result)
            
            # Insert public_key if not found
            self.add_public_key(i['data'][0]['input']['address'])

        if len(list_result) != 0:
            self.col_seeds.insert_many(list_result)
            print(f"add {len(list_result)} to database")

    def add_public_key(self, public_key):
        try:
            find_public_key = list(self.col_public_key.find({"public_key": public_key}).limit(1))

            if len(find_public_key) == 0:
                all_public_key = list(self.col_public_key.find())
                
                json_data = {
                    "public_key": public_key,
                    "name": "Node " + str(len(all_public_key) + 1),
                    "status": 1
                }
                
                self.col_public_key.insert_one(json_data)
                print("Insert new public_key")
        except Exception as ex:
            print("ERROR add public key:", ex)
            
    def delete_public_key(self, public_key):
        serviceResponse = ServiceResponse()
        try:
            query = {"public_key": public_key}
            newvalues = { "$set": { "status": 0 } }
            print("Hi")
            result = self.col_public_key.update_one(query, newvalues)
            # boolean confirmation that the API call went through
            print ("acknowledged:", result.acknowledged)

            # integer of the number of docs modified
            print ("number of docs updated:", result.modified_count)
            print(result.raw_result['updatedExisting'])
            print(result.raw_result)
            
            if result.raw_result['updatedExisting'] == False:
                serviceResponse.success = False
                serviceResponse.message = "Cannot found publickey"
            else:
                serviceResponse.message = "Delete publickey successfull"
            
            print(serviceResponse.result())
            return serviceResponse
        except Exception as ex:
            serviceResponse.success = False
            serviceResponse.message = str(ex)
            print("ERROR delete public key", serviceResponse.message)
            return serviceResponse
        
    def restore_public_key(self, public_key):
        serviceResponse = ServiceResponse()
        try:
            query = {"public_key": public_key}
            newvalues = { "$set": { "status": 1 } }
            print("Hi")
            result = self.col_public_key.update_one(query, newvalues)
            # boolean confirmation that the API call went through
            print ("acknowledged:", result.acknowledged)

            # integer of the number of docs modified
            print ("number of docs updated:", result.modified_count)
            print(result.raw_result['updatedExisting'])
            print(result.raw_result)
            
            if result.raw_result['updatedExisting'] == False:
                serviceResponse.success = False
                serviceResponse.message = "Cannot found publickey"
            else:
                serviceResponse.message = "Restore publickey successfull"
            
            print(serviceResponse.result())
            return serviceResponse
        except Exception as ex:
            serviceResponse.success = False
            serviceResponse.message = str(ex)
            print("ERROR delete public key", serviceResponse.message)
            return serviceResponse