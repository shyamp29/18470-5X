# Import necessary libraries and modules
from pymongo import MongoClient

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,
    'capacity': initCapacity,
    'availability': initCapacity
}
'''

# Function to create a new hardware set
def createHardwareSet(client, hwSetName, initCapacity):
    # Create a new hardware set in the database
    db = client.myapp_database
    hardware_col = db.hardware
    if hardware_col.find_one({"hwName": hwSetName}):
        return False, "Hardware set name already exists"
    else:
        new_hardware_set = {
            'hwName': hwSetName,
            'capacity': initCapacity,
            'availability': initCapacity
        }
        hardware_col.insert_one(new_hardware_set)
        return True, "Hardware set created successfully"

# Function to query a hardware set by its name
def queryHardwareSet(client, hwSetName):
    # Query and return a hardware set from the database
    db = client.myapp_database
    hardware_col = db.hardware
    hardware_set = hardware_col.find_one({"hwName": hwSetName})
    if not hardware_set:
        return False, "Hardware set not found"
    else:
        return True, hardware_set

# Function to update the capacity of a hardware set
def updateCapacity(client, hwSetName, newCapacity):
    db = client.myapp_database
    hardware_col = db.hardware
    hardware_set = hardware_col.find_one({"hwName": hwSetName})
    if not hardware_set:
        return False, "Hardware set not found"
    else:
        if newCapacity <= hardware_set['capacity']:
            return False, "New capacity is less than or equal to current capacity"
        else:
            diff = newCapacity - hardware_set['capacity']
            hardware_set['availability'] += diff
            hardware_col.update_one({"hwName": hwSetName}, {"$set": {"capacity": newCapacity, "availability": hardware_set['availability']}})
            return True, "Hardware set capacity updated successfully"

# # Function to update the availability of a hardware set
# def updateAvailability(client, hwSetName, newAvailability):
#     # Update the availability of an existing hardware set
#     db = client.myapp_database
#     hardware_col = db.hardware
#     hardware_set = hardware_col.find_one({"hwName": hwSetName})
#     if not hardware_set:
#         return False, "Hardware set not found"
#     else:
#         hardware_col.update_one({"hwName": hwSetName}, {"$set": {"availability": newAvailability}})
#         return True, "Hardware set availability updated successfully"

# Function to request space from a hardware set
def requestSpace(client, hwSetName, qty):
    # Request a certain qty of hardware and update availability
    db = client.myapp_database
    hardware_col = db.hardware
    hardware_set = hardware_col.find_one({"hwName": hwSetName})
    if not hardware_set:
        return False, "Hardware set not found"
    else:
        if hardware_set['availability'] >= qty:
            hardware_col.update_one({"hwName": hwSetName}, {"$set": {"availability": hardware_set['availability'] - qty}})
            return True, "Hardware space requested successfully"
        else:
            return False, "Requested hardware space not available, only " + str(hardware_set['availability']) + " is available"

# Function to return space to a hardware set
def returnSpace(client, hwSetName, qty):
    db = client.myapp_database
    hardware_col = db.hardware
    hardware_set = hardware_col.find_one({"hwName": hwSetName})
    if not hardware_set:
        return False, "Hardware set not found"
    else:
        hardware_col.update_one({"hwName": hwSetName}, {"$set": {"availability": hardware_set['availability'] + qty}})
        return True, "Hardware space returned successfully"

# Function to get all hardware set names
def getAllHwNames(client):
    # Get and return a list of all hardware set names
    db = client.myapp_database
    hardware_col = db.hardware
    hardware_sets = hardware_col.find()
    hw_names = []
    for hw_set in hardware_sets:
        hw_names.append(hw_set['hwName'])
    return True, hw_names



