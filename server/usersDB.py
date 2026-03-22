# Import necessary libraries and modules
# from pymongo import MongoClient
import projectsDB

'''
Structure of User entry:
User = {
    'username': username,
    'userId': userId,
    'password': password,
    'projects': [project1_ID, project2_ID, ...]
}
'''

from werkzeug.security import generate_password_hash, check_password_hash

# Function to add a new user
def addUser(client, username, userId, password):
    # Add a new user to the database
    db = client.myapp_database
    users_col = db.users
    if users_col.find_one({"userId": userId}):
        return False, "UserID already exists"
    else:
        # Hash the password with a salt before storing it
        hashed_password = generate_password_hash(password)
        
        new_user = {
            'username': username,
            'userId': userId,
            'password': hashed_password,
            'projects': []
        }
        users_col.insert_one(new_user)
        return True, "User added successfully, Please login"

# Helper function to query a user by username and userId
def __queryUser(client, username, userId):
    # Query and return a user from the database
    db = client.myapp_database
    users_col = db.users
    user = users_col.find_one({"userId": userId})
    if not user:
        return False, "User not found", None
    elif user['userId'] == userId and user['username'] == username:
        return True,"User credentials match", user
    else:
        return False, "UserId and username do not match", None

# Function to log in a user
def login(client, userId, password):
    # Authenticate a user and return login status
    db = client.myapp_database
    users_col = db.users
    
    # 1. Find the user by ID
    user = users_col.find_one({"userId": userId})
    
    if not user:
        return False, "User ID does not exist\nPlease check and try again"
        
    # 2. Check if the provided password matches the stored hash
    if check_password_hash(user['password'], password):
        return True, "Login successful"
    else:
        return False, "Incorrect password\nPlease check and try again"

# Function to reset password
def resetPassword(client, userId, username, password):
    db = client.myapp_database
    users_col = db.users

    success, message, user = __queryUser(client, username, userId)    
    if not success:
        return False, message 
    elif user:
        # Hash the new password
        new_hashed_password = generate_password_hash(password)
        users_col.update_one(
        {"userId": userId}, # 1. Find the user with this ID
        {"$set": {"password": new_hashed_password}})
        return True, "Password reset successful"


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
    user = users_col.find_one({"userId": userId})
    if user:
        return True, user['projects']
    return False, "User not found"  

