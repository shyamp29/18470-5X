# Import necessary libraries and modules
import projectsDB

'''
Structure of User entry:
User = {
    'userName': userName,
    'userId': userId,
    'password': password,
    'projects': [project1_ID, project2_ID, ...],
    'isAdmin': False
}
'''

from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Function to add a new user
def register(client, userName, userId, emailId, password):
    # Add a new user to the database
    db = client.myapp_database
    users_col = db.users
    if users_col.find_one({"userId": userId}):
        return False, "userId already exists"
    elif users_col.find_one({"emailId": emailId}):
        return False, "emailId already exists"
    else:
        # Hash the password with a salt before storing it
        hashed_password = generate_password_hash(password)
        
        new_user = {
            'userName': userName,
            'userId': userId,
            'emailId': emailId,
            'passwordHash': hashed_password,
            'createdAt': datetime.now(),
            'projects': [],
            'isAdmin': False
        }
        users_col.insert_one(new_user)
        return True, f"{userName} registered successfully, Please login"

# Helper function to query a user by userName and userId
def __queryUser(client, userName, userId):
    # Query and return a user from the database
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userId": userId})
    if not user:
        return False, "User not found", None
    elif user['userId'] == userId and user['userName'] == userName:
        return True,"User credentials match", user
    else:
        return False, "userId and userName do not match", None

# Function to log in a user
def login(client, userId, password):
    # Authenticate a user and return login status
    db = client.myapp_database
    users_col = db.users
    
    # 1. Find the user by ID
    user = users_col.find_one({"userId": userId})
    
    if not user:
        return False, "userId does not exist\nPlease check and try again", None, None
        
    # 2. Check if the provided passwordHash matches the stored hash
    if check_password_hash(user['passwordHash'], password):
        return True, f"{user['userName']} logged in successfully", user["userId"], user["userName"]
    else:
        return False, "Incorrect password\nPlease check and try again", None, None

# Function to reset password
def resetPassword(client, userId, oldPassword, newPassword):
    db = client.myapp_database
    users_col = db.users

    user = users_col.find_one({"userId": userId})
    if not user:
        return False, "User not found"

    if check_password_hash(user['passwordHash'], oldPassword):    
        # Hash the new passwordHash
        new_hashed_password = generate_password_hash(newPassword)
        users_col.update_one(
        {"userId": userId}, # 1. Find the user with this ID
        {"$set": {"passwordHash": new_hashed_password}})
        return True, "password reset successful"
    else:
        return False, "Incorrect password\nPlease check and try again"


# Function to add a user to a project
def joinProject(client, userId, projectId):
    # Add a project to the user's project list
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userId": userId})
    if user:
        if projectId not in user['projects']:
            user['projects'].append(projectId)
            # Update the user document with the new projects list
            users_col.update_one({"userId": userId}, {"$set": {"projects": user['projects']}})
        return True, "Project joined successfully"
    return False, "User not found"

# Function to get the list of projects for a user
def getUserProjectsList(client, userId):
    # Get and return the list of projects a user is part of
    db = client.myapp_database
    users_col = db.users
    projects_col = db.Projects
    
    user = users_col.find_one({"userId": userId})
    if not user:
        return False, "User not found", None
    
    projectsList = []
    for projectId in user['projects']:
        project = projects_col.find_one({"projectId": projectId})
        if project:
            project['_id'] = str(project['_id'])
            projectsList.append(project)
    
    return True, "Projects retrieved successfully", projectsList

# Function to check if a user is an admin
def isAdminUser(client, userId):
    # Check if the user has admin privileges
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userId": userId})
    if not user:
        return False, "User not found", False
    else:
        is_admin = user.get('isAdmin', False)
        return True, "User found", is_admin

# Function to set a user as admin
def setAdminUser(client, userId, isAdminFlag):
    # Set admin privileges for a user
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userId": userId})
    if not user:
        return False, "User not found"
    else:
        users_col.update_one({"userId": userId}, {"$set": {"isAdmin": isAdminFlag}})
        status = "promoted to admin" if isAdminFlag else "removed from admin"
        return True, f"User {status} successfully"

