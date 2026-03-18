# Import necessary libraries and modules
from pymongo import MongoClient

import hardwareDB
import usersDB

'''
Structure of Project entry:
Project = {
    'projectName': projectName,
    'projectId': projectId,
    'description': description,
    'hwSets': {HW1: 0, HW2: 10, ...},
    'users': [user1, user2, ...]
}
'''

# Function to create a new project
def createProject(client, projectName, projectId, description, userId):
    # Create a new project in the database
    db = client.myapp_database
    projects_col = db.Projects
    if projects_col.find_one({"projectId": projectId}):
        return False, "ProjectID already exists"
    else:
        new_project = {
            'projectName': projectName,
            'projectId': projectId,
            'description': description,
            'hwSets': {},
            'users': [userId] # Automatically add the creator to the project's users array
        }
        projects_col.insert_one(new_project)

        # Establish two-way reference: Add this projectId to the User's database entry
        usersDB.joinProject(client, userId, projectId)

        return True, "Project added successfully"

# Function to query a project by its ID
def queryProject(client, projectId):
    # Query and return a project from the database
    db = client.myapp_database
    projects_col = db.Projects
    project = projects_col.find_one({"projectId": projectId})
    if project:
        return True, project
    else:
        return False, "ProjectID not found"

# Function to add a user to a project
def addUser(client, projectId, userId):
    db = client.myapp_database
    projects_col = db.Projects
    project = projects_col.find_one({"projectId": projectId})
    if project:
        if userId in project['users']:
            return False, "User already in project"
        else:
            project['users'].append(userId)
            projects_col.update_one({"projectId": projectId}, {"$set": {"users": project['users']}})
            
            return True, "User added successfully"
    else:
        return False, "Project not found"

# Function to update hardware usage in a project
def updateUsage(client, projectId, hwSetName):
    # Update the usage of a hardware set in the specified project
    
    pass

# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, userId):
    # Check out hardware for the specified project and update availability
    db = client.myapp_database
    projects_col = db.Projects
    hardware_col = db.hardware
    users_col = db.users
    project = projects_col.find_one({"projectId": projectId})
    hardware = hardware_col.find_one({"hwName": hwSetName})
    if hwSetName not in project['hwSets']:
        return False, "Hardware not found in project"
    if qty > project['hwSets'][hwSetName]:
        return False, "Requested hardware checkout quantity exceeds project's hardware allocation"

    success, message = hardwareDB.returnSpace(client, hwSetName, qty)
    if not success:
        return False, message
    else:
        project['hwSets'][hwSetName] -= qty
        if project['hwSets'][hwSetName] == 0:
            del project['hwSets'][hwSetName]
            for user in project['users']:
                user = users_col.find_one({"userId": user})
                if hwSetName in user['hwList']:
                    user['hwList'].remove(hwSetName)
                    users_col.update_one({"userId": user}, {"$set": {"hwList": user['hwList']}})
        projects_col.update_one({"projectId": projectId}, {"$set": {"hwSets": project['hwSets']}})
        return True, "Hardware checked out successfully"

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, userId):
    # Check in hardware for the specified project and update availability
    db = client.myapp_database
    projects_col = db.Projects
    hardware_col = db.hardware
    users_col = db.users
    project = projects_col.find_one({"projectId": projectId})
    hardware = hardware_col.find_one({"hwName": hwSetName})
    if hwSetName not in project['hwSets']:
        project['hwSets'][hwSetName] = 0

    success, message = hardwareDB.requestSpace(client, hwSetName, qty)
    if not success:
        return False, message
    else:
        project['hwSets'][hwSetName] += qty
        projects_col.update_one({"projectId": projectId}, {"$set": {"hwSets": project['hwSets']}})
        for user in project['users']:
            user = users_col.find_one({"userId": user})
            if hwSetName not in user['hwList']:
                user['hwList'].append(hwSetName)
                users_col.update_one({"userId": user}, {"$set": {"hwList": user['hwList']}})
        
        return True, "Hardware checked in successfully"
        
    
        
    
    

