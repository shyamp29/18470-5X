# Import necessary libraries and modules
import projectsDB

'''
Structure of User entry:
user = {
    'username': username,
    'userid': userid,
    'passwordhash': passwordhash,
    'createdat': createdat,
    'projects': [project1_ID, project2_ID, ...]
}
'''

from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Function to add a new user
def register(client, username, userid, password):
    # Add a new user to the database
    db = client.myapp_database
    users_col = db.users
    if users_col.find_one({"userid": userid}):
        return False, "userid already exists"
    else:
        # Hash the password with a salt before storing it
        hashed_password = generate_password_hash(password)
        
        new_user = {
            'username': username,
            'userid': userid,
            'passwordhash': hashed_password,
            'createdat': datetime.now(),
            'projects': [],
            'isAdmin': False
        }
        users_col.insert_one(new_user)
        return True, f"{username} registered successfully, Please login"

# Helper function to query a user by username and userid
def __queryUser(client, username, userid):
    # Query and return a user from the database
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userid": userid})
    if not user:
        return False, "User not found", None
    elif user['userid'] == userid and user['username'] == username:
        return True,"User credentials match", user
    else:
        return False, "userid and username do not match", None

# Function to log in a user
def login(client, userid, password):
    # Authenticate a user and return login status
    db = client.myapp_database
    users_col = db.users
    
    # 1. Find the user by ID
    user = users_col.find_one({"userid": userid})
    
    if not user:
        return False, "userid does not exist\nPlease check and try again", None, None
        
    # 2. Check if the provided passwordhash matches the stored hash
    if check_password_hash(user['passwordhash'], password):
        return True, f"{user['username']} logged in successfully", user["userid"], user["username"]
    else:
        return False, "Incorrect password\nPlease check and try again", None, None

# Function to reset password
def resetPassword(client, userid, oldPassword, newPassword):
    db = client.myapp_database
    users_col = db.users

    user = users_col.find_one({"userid": userid})
    if not user:
        return False, "User not found"

    if check_password_hash(user['passwordhash'], oldPassword):    
        # Hash the new passwordhash
        new_hashed_password = generate_password_hash(newPassword)
        users_col.update_one(
        {"userid": userid}, # 1. Find the user with this ID
        {"$set": {"passwordhash": new_hashed_password}})
        return True, "password reset successful"
    else:
        return False, "Incorrect password\nPlease check and try again"

def verifyUser(client, userid, username):
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userid": userid})
    if not user:
        return False, "User not found"
    elif user['userid'] == userid and user['username'] == username:
        return True, "User credentials match"
    else:
        return False, "userid and username do not match"

def changePassword(client, userid, password):
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userid": userid})
    if not user:
        return False, "User not found"
    else:
        users_col.update_one({"userid": userid}, {"$set": {"passwordhash": generate_password_hash(password)}})
        return True, "Password changed successfully"

# Function to add a user to a project
def joinProject(client, userid, projectid):
    # Add a project to the user's project list
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userid": userid})
    if user:
        if projectid not in user['projects']:
            user['projects'].append(projectid)
            # Update the user document with the new projects list
            users_col.update_one({"userid": userid}, {"$set": {"projects": user['projects']}})
        return True, "Project joined successfully"
    return False, "User not found"

# Function to get username by userid
def getUsernameById(client, userid):
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userid": userid}, {"username": 1})
    if user:
        return user.get("username")
    return None

# Function to get the list of projects for a user
def getUserProjectsList(client, userid):
    # Get and return the list of projects a user is part of
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userid": userid})
    if not user:
        return False, "User not found", None
    projectsList = []
    if user['projects']:
        for projectid in user['projects']:
            success, msg, project_data = projectsDB.queryProject(client, projectid)
            if success and project_data:
                projectsList.append(project_data)
    else:
        is_admin = user.get('isAdmin', False)
        return True, "User found", is_admin
    return True, "Projects fetched successfully", projectsList

# Function to check if a user is an admin
def isAdminUser(client, userid):
    # Check if the user has admin privileges
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userid": userid})
    if not user:
        return False, "User not found", False
    else:
        is_admin = user.get('isAdmin', False)
        return True, "User found", is_admin

# Function to set a user as admin
def setAdminUser(client, userid, isAdminFlag):
    # Set admin privileges for a user
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userid": userid})
    if not user:
        return False, "User not found"
    else:
        users_col.update_one({"userid": userid}, {"$set": {"isAdmin": isAdminFlag}})
        status = "promoted to admin" if isAdminFlag else "removed from admin"
        return True, f"User {status} successfully"

