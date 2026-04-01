# Import necessary libraries and modules
from pymongo import MongoClient, ReturnDocument
from datetime import datetime

import hardwareDB
import usersDB

'''
Structure of Project entry:
Project = {
    'projectId': projectId,
    'name': name,
    'description': description,
    'ownerUserid': userId,
    'checkedOut': {HW1: 0, HW2: 10, ...},
    'members': [user1, user2, ...],
    'createdAt': createdAt,
    'updatedAt': updatedAt
}
'''

# Function to create a new project
def createProject(client, name, projectId, description, userId):
    # Create a new project in the database
    db = client.myapp_database
    projects_col = db.Projects
    if projects_col.find_one({"projectId": projectId}):
        return False, "ProjectID already exists", None, None
    else:
        new_project = {
            'name': name,
            'projectId': projectId,
            'description': description,
            'ownerUserid': userId,
            'checkedOut': {},
            'members': [userId], # Automatically add the creator to the project's members array
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        projects_col.insert_one(new_project)

        # Establish two-way reference: Add this projectId to the User's database entry
        usersDB.joinProject(client, userId, projectId)

        return True, "Project added successfully", projectId, name

# Function to get all projects
def getAllProjects(client):
    db = client.myapp_database
    projects_col = db.Projects
    projects = list(projects_col.find())
    for p in projects:
        p['_id'] = str(p['_id'])
    return True, "Projects fetched successfully", projects

# Function to query a project by its ID
def queryProject(client, projectId):
    # Query and return a project from the database
    db = client.myapp_database
    projects_col = db.Projects
    project = projects_col.find_one({"projectId": projectId})
    if project:
        project['_id'] = str(project['_id']) # Make JSON serializable
        return True, "Project found", project
    else:
        return False, "ProjectID not found", None

# Function to add a user to a project
def addUser(client, projectId, requesterId, newUserId):
    db = client.myapp_database
    projects_col = db.Projects
    project = projects_col.find_one({"projectId": projectId})

    if project:
        if requesterId != project['ownerUserid']:
            return False, "Only the project owner can add users", None, None
        if newUserId in project['members']:
            return False, "User already in project", None, None
        else:
            project['members'].append(newUserId)
            projects_col.update_one({"projectId": projectId}, {"$set": {"members": project['members'], "updatedAt": datetime.now()}})
            usersDB.joinProject(client, newUserId, projectId)
            return True, "User added successfully", None, None
    else:
        return False, "Project not found", None, None


# Function to check out hardware for a project (take from pool → increase project allocation)
def checkOutHW(client, projectId, hwSetName, qty, userId):
    db = client.myapp_database
    projects_col = db.Projects

    project = projects_col.find_one({"projectId": projectId})
    if not project:
        return False, "Project not found", None, None, -1

    # 1. Atomically take hardware from the pool (reduces availability)
    success, message, checkedOutQty, newAvailability, error = hardwareDB.requestSpace(client, hwSetName, qty, projectId)
    if not success:
        return False, message, None, None, error

    # 2. Update project allocation ATOMICALLY
    projects_col.find_one_and_update(
        {"projectId": projectId},
        {
            "$inc": {f"checkedOut.{hwSetName}": qty},
            "$set": {"updatedAt": datetime.now()}
        },
        return_document=ReturnDocument.AFTER
    )

    return True, message, checkedOutQty, newAvailability, error

# Function to check in hardware for a project (return to pool → decrease project allocation)
def checkInHW(client, projectId, hwSetName, qty, userId):
    db = client.myapp_database
    projects_col = db.Projects

    project = projects_col.find_one({"projectId": projectId})
    if not project:
        return False, "Project not found", None, None, -1

    if hwSetName not in project.get('checkedOut', {}):
        return False, "Hardware not allocated to this project", None, None, -1

    current_allocated = project['checkedOut'][hwSetName]
    if qty > current_allocated:
        net_qty = current_allocated
        error = -1
        error_message = f"Quantity exceeds project allocation, checking in only {net_qty} units"
    else:
        net_qty = qty
        error = 0
        error_message = "Hardware checked in successfully"

    # 1. Atomically return hardware to the pool (increases availability)
    success, message, returnedQty, newAvailability = hardwareDB.returnSpace(client, hwSetName, net_qty, projectId)
    message = error_message + ", " + message if error == -1 else message

    if not success:
        return False, message, None, None, error

    # 2. Update project allocation ATOMICALLY
    updated_project = projects_col.find_one_and_update(
        {"projectId": projectId},
        {
            "$inc": {f"checkedOut.{hwSetName}": -net_qty},
            "$set": {"updatedAt": datetime.now()}
        },
        return_document=ReturnDocument.AFTER
    )

    # Cleanup zero allocations
    if updated_project and updated_project['checkedOut'].get(hwSetName, 0) <= 0:
        projects_col.update_one({"projectId": projectId}, {"$unset": {f"checkedOut.{hwSetName}": ""}})

    return True, message, returnedQty, newAvailability, error
        
    
        
    
    

