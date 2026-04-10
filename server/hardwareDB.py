# Import necessary libraries and modules
from pymongo import MongoClient, ReturnDocument

'''
Structure of Hardware Set entry:
HardwareSet = {
    'setname': hwSetName,
    'capacity': initCapacity,
    'availability': initCapacity
    'checkedoutby': {projectid: qty, ...}
}
'''

# Function to create a new hardware set
def createHardwareSet(client, hwSetName, capacity):
    # Create a new hardware set in the database
    db = client.myapp_database
    hardware_col = db.hardware
    if hardware_col.find_one({"setname": hwSetName}):
        return False, "Hardware set name already exists"
    else:
        new_hardware_set = {
            'setname': hwSetName,
            'capacity': capacity,
            'availability': capacity,
            'checkedoutby': {}
        }
        hardware_col.insert_one(new_hardware_set)
        return True, "Hardware set created successfully"

# Function to query a hardware set by its name
def queryHardwareSet(client, hwSetName):
    # Query and return a hardware set from the database
    db = client.myapp_database
    hardware_col = db.hardware
    hardware_set = hardware_col.find_one({"setname": hwSetName})
    if not hardware_set:
        return False, "Hardware set not found", None
    else:
        hardware_set['_id'] = str(hardware_set['_id']) # Make JSON serializable
        return True, "Hardware set found", hardware_set

# Function to update the capacity of a hardware set
def addCapacity(client, hwSetName, addCapacity):
    db = client.myapp_database
    hardware_col = db.hardware
    hardware_set = hardware_col.find_one({"setname": hwSetName})
    if not hardware_set:
        return False, "Hardware set not found"
    else:
        if addCapacity <= 0:
            return False, "Capacity must be positive"
        else:
            hardware_set['availability'] += addCapacity
            hardware_col.update_one({"setname": hwSetName}, {"$inc": {"capacity": addCapacity, "availability": addCapacity}})
            return True, "Hardware set capacity updated successfully"   


# Function to request space from a hardware set
def requestSpace(client, hwSetName, qty, projectid):
    # Request a certain qty of hardware and update availability (reduces availability)
    db = client.myapp_database
    hardware_col = db.hardware

    # Atomically verify availability and update
    updated_hardware = hardware_col.find_one_and_update(
        {
            "setname": hwSetName,
            "availability": {"$gte": qty}  # only update if enough space
        },
        {
            "$inc": {
                "availability": -qty,
                f"checkedoutby.{projectid}": qty
            }
        },
        return_document=ReturnDocument.AFTER
    )

    if not updated_hardware:
        # Check if it was NOT found because of availability or doesn't exist
        hw_exists = hardware_col.find_one({"setname": hwSetName})
        if not hw_exists:
            return False, "Hardware set not found", None, None, -1
        else:
            return False, f"Requested hardware space not available, only {hw_exists['availability']} is available", None, None, -1
            
    return True, "Hardware space requested successfully", qty, updated_hardware['availability'], 0

# Function to return space to a hardware set
def returnSpace(client, hwSetName, qty, projectid):
    # Return hardware back to the set (increases availability)
    db = client.myapp_database
    hardware_col = db.hardware

    # Atomically verify they have enough checked out, and update
    query = {
        "setname": hwSetName,
        f"checkedoutby.{projectid}": {"$gte": qty}
    }

    updated_hardware = hardware_col.find_one_and_update(
        query,
        {
            "$inc": {
                "availability": qty,
                f"checkedoutby.{projectid}": -qty
            }
        },
        return_document=ReturnDocument.AFTER
    )

    if not updated_hardware:
        hw_exists = hardware_col.find_one({"setname": hwSetName})
        if not hw_exists:
            return False, "Hardware set not found", None, None, -1
        else:
            return False, "Hardware space return calculation error (returning more than checked out)", None, None, -1

    # Optional cleanup if checkedoutby is 0
    if updated_hardware['checkedoutby'].get(projectid, 0) <= 0:
        hardware_col.update_one({"setname": hwSetName}, {"$unset": {f"checkedoutby.{projectid}": ""}})

    return True, "Hardware space returned successfully", qty, updated_hardware['availability'] 

# Function to get all hardware set names
def getAllHwInfo(client):
    # Get and return a list of all hardware set names
    db = client.myapp_database
    hardware_col = db.hardware
    hardware_sets = list(hardware_col.find())
    hardware_sets_info = []
    if len(hardware_sets) == 0:
        return False, "No hardware sets found", None
    for hw_set in hardware_sets:
        hw_set['_id'] = str(hw_set['_id']) # Make JSON serializable
        hardware_sets_info.append(hw_set)
    return True, f"{len(hardware_sets_info)} hardware sets found", hardware_sets_info



