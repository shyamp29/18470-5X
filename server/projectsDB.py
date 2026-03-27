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
def addUser(client, projectId, userId):
    db = client.myapp_database
    projects_col = db.Projects
    project = projects_col.find_one({"projectId": projectId})
    
    if project:
        if userId not in project['ownerUserid']:
            return False, "User is not the owner of the project", None, None
        if userId in project['members']:
            return False, "User already in project", None, None
        else:
            project['members'].append(userId)
            projects_col.update_one({"projectId": projectId}, {"$set": {"members": project['members'], "updatedAt": datetime.now()}})
            
            return True, "User added successfully", None, None
    else:
        return False, "Project not found", None, None


# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, userId):
    # This acts like "returning" hardware from the project to the HW set
    db = client.myapp_database
    projects_col = db.Projects
    
    project = projects_col.find_one({"projectId": projectId})
    if not project:
        return False, "Project not found", None, None, -1
        
    if hwSetName not in project.get('checkedOut', {}):
        return False, "Hardware not found in project", None, None, -1
        
    current_checked_out = project['checkedOut'][hwSetName]
    if qty > current_checked_out:
        net_qty = current_checked_out
        error = -1
        error_message = f"Requested hardware checkout quantity exceeds project's hardware allocation, so checking out only {net_qty} units"
    else:
        net_qty = qty
        error = 0
        error_message = "Hardware checked out successfully"

    # 1. Update hardware pool ATOMICALLY (return hardware to the pool)
    success, message, checkedOutQty, newAvailability = hardwareDB.returnSpace(client, hwSetName, net_qty, projectId)
    message = error_message + ", " + message if error == -1 else message
    
    if not success:
        return False, message, None, None, error
    
    # 2. Update project ATOMICALLY
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
        
    return True, message, checkedOutQty, newAvailability, error

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, userId):
    # This acts like "borrowing" hardware into the project from the HW set
    db = client.myapp_database
    projects_col = db.Projects
    
    project = projects_col.find_one({"projectId": projectId})
    if not project:
        return False, "Project not found", None, None, -1

    # 1. Update hardware pool ATOMICALLY (take hardware from pool)
    success, message, returnedQty, newAvailability, error = hardwareDB.requestSpace(client, hwSetName, qty, projectId)
    if not success:
        return False, message, None, None, error
        
    # 2. Update project ATOMICALLY
    updated_project = projects_col.find_one_and_update(
        {"projectId": projectId},
        {
            "$inc": {f"checkedOut.{hwSetName}": qty},
            "$set": {"updatedAt": datetime.now()}
        },
        return_document=ReturnDocument.AFTER
    )
    
    return True, message, returnedQty, newAvailability, error
        
    
        
    
    

