# Import necessary libraries and modules
import os
from pymongo import MongoClient, ReturnDocument
from datetime import datetime

import hardwareDB
import usersDB

'''
Structure of Project entry:
Project = {
    'projectid': projectid,
    'name': name,
    'description': description,
    'owneruserid': userid,
    'checkedout': {HW1: 0, HW2: 10, ...},
    'members': [user1, user2, ...],
    'createdat': createdat,
    'updatedat': updatedat
}
'''

# Function to create a new project
def createProject(client, name, projectid, description, userid):
    # Create a new project in the database
    db = client[os.getenv("DB_NAME")]
    projects_col = db.Projects
    if projects_col.find_one({"projectid": projectid}):
        return False, "ProjectID already exists", None, None
    else:
        new_project = {
            'name': name,
            'projectid': projectid,
            'description': description,
            'owneruserid': userid,
            'checkedout': {},
            'members': [userid], # Automatically add the creator to the project's members array
            'createdat': datetime.now(),
            'updatedat': datetime.now()
        }
        projects_col.insert_one(new_project)

        # Establish two-way reference: Add this projectid to the User's database entry
        usersDB.joinProject(client, userid, projectid)

        return True, "Project added successfully", projectid, name

# Function to get all projects
def getAllProjects(client):
    db = client[os.getenv("DB_NAME")]
    projects_col = db.Projects
    projects = list(projects_col.find())
    for p in projects:
        p['_id'] = str(p['_id'])
    return True, "Projects fetched successfully", projects

# Function to query a project by its ID
def queryProject(client, projectid):
    # Query and return a project from the database
    db = client[os.getenv("DB_NAME")]
    projects_col = db.Projects
    project = projects_col.find_one({"projectid": projectid})
    if project:
        project['_id'] = str(project['_id']) # Make JSON serializable
        return True, "Project found", project
    else:
        return False, "ProjectID not found", None

# Function to add a user to a project
def addUser(client, projectid, requesterId, newUserId):
    db = client[os.getenv("DB_NAME")]
    projects_col = db.Projects
    project = projects_col.find_one({"projectid": projectid})

    if project:
        if requesterId != project['owneruserid']:
            return False, "Only the project owner can add users", None, None
        if newUserId in project['members']:
            return False, "User already in project", None, None
        else:
            project['members'].append(newUserId)
            projects_col.update_one({"projectid": projectid}, {"$set": {"members": project['members'], "updatedat": datetime.now()}})
            usersDB.joinProject(client, newUserId, projectid)
            return True, "User added successfully", None, None
    else:
        return False, "Project not found", None, None


# Function to let a project member leave the project
def leaveProject(client, userid, projectid):
    # Add a project to the user's project list
    db = client[os.getenv("DB_NAME")]
    projects_col = db.Projects
    users_col = db.Users

    project = projects_col.find_one({"projectid": projectid})
    if project:
        if userid not in project['members']:
            return False, "User is not a member of the project"
        if userid == project['owneruserid']:
            return False, "Owner cannot leave the project"
        else:
            project['members'].remove(userid)
            projects_col.update_one({"projectid": projectid}, {"$set": {"members": project['members'], "updatedat": datetime.now()}})
            users_col.update_one({"userid": userid}, {"$pull": {"projects": projectid}})
            return True, "User left the project successfully"
    else:
        return False, "Project not found"

# Function to close a project
def closeProject(client, userid, projectid):
    # Close a project in the database
    db = client[os.getenv("DB_NAME")]
    projects_col = db.Projects
    users_col = db.Users
    project = projects_col.find_one({"projectid": projectid})
    if project:
        if userid != project['owneruserid']:
            return False, "User is not the owner of the project"
        else:
            if project['checkedout']:
                for hwSetName, qty in project['checkedout'].items():
                    hardwareDB.returnSpace(client, hwSetName, qty, projectid)
            # Remove project from all members' lists
            users_col.update_many({"userid": {"$in": project.get('members', [])}}, {"$pull": {"projects": projectid}})
            projects_col.delete_one({"projectid": projectid})
            return True, "Project closed successfully"
    else:
        return False, "Project not found"

# Function to check out hardware for a project (take from pool → increase project allocation)
def checkOutHW(client, projectid, hwSetName, qty, userid):
    db = client[os.getenv("DB_NAME")]
    projects_col = db.Projects

    project = projects_col.find_one({"projectid": projectid})
    if not project:
        return False, "Project not found", None, None, -1

    # 1. Atomically take hardware from the pool (reduces availability)
    success, message, checkedoutQty, newAvailability, error = hardwareDB.requestSpace(client, hwSetName, qty, projectid)
    if not success:
        return False, message, None, None, error

    # 2. Update project allocation ATOMICALLY
    projects_col.find_one_and_update(
        {"projectid": projectid},
        {
            "$inc": {f"checkedout.{hwSetName}": qty},
            "$set": {"updatedat": datetime.now()}
        },
        return_document=ReturnDocument.AFTER
    )

    return True, message, checkedoutQty, newAvailability, error

# Function to check in hardware for a project (return to pool → decrease project allocation)
def checkInHW(client, projectid, hwSetName, qty, userid):
    db = client[os.getenv("DB_NAME")]
    projects_col = db.Projects

    project = projects_col.find_one({"projectid": projectid})
    if not project:
        return False, "Project not found", None, None, -1

    if hwSetName not in project.get('checkedout', {}):
        return False, "Hardware not allocated to this project", None, None, -1

    current_allocated = project['checkedout'][hwSetName]
    if qty > current_allocated:
        net_qty = current_allocated
        error = -1
        error_message = f"Quantity exceeds project allocation, checking in only {net_qty} units"
    else:
        net_qty = qty
        error = 0
        error_message = "Hardware checked in successfully"

    # 1. Atomically return hardware to the pool (increases availability)
    success, message, returnedQty, newAvailability = hardwareDB.returnSpace(client, hwSetName, net_qty, projectid)
    message = error_message + ", " + message if error == -1 else message

    if not success:
        return False, message, None, None, error

    # 2. Update project allocation ATOMICALLY
    updated_project = projects_col.find_one_and_update(
        {"projectid": projectid},
        {
            "$inc": {f"checkedout.{hwSetName}": -net_qty},
            "$set": {"updatedat": datetime.now()}
        },
        return_document=ReturnDocument.AFTER
    )

    # Cleanup zero allocations
    if updated_project and updated_project['checkedout'].get(hwSetName, 0) <= 0:
        projects_col.update_one({"projectid": projectid}, {"$unset": {f"checkedout.{hwSetName}": ""}})

    return True, message, returnedQty, newAvailability, error
        
    
        
    
    

