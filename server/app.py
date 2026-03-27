# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, session
from pymongo import MongoClient

# Import custom modules for database interactions
import usersDB
import projectsDB
import hardwareDB

import os
from dotenv import load_dotenv

load_dotenv()

# Define the MongoDB connection string
MONGODB_SERVER = os.getenv("MONGODB_URI")

if not MONGODB_SERVER:
    raise ValueError("No MONGODB_URI found in environment variables. Did you set it in your .env file?")

client = MongoClient(MONGODB_SERVER)

# Initialize a new Flask web application
app = Flask(__name__)
app.secret_key = "encription_key"


# Route for adding a new user
@app.route('/api/users/register', methods=['POST'])
def add_user():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    username = data.get('username')
    userId = data.get('userId')
    password = data.get('password')

    if not all([username, userId, password]):
        return jsonify({ "message": "Missing required fields"}), 401

    # Attempt to add the user using the usersDB module
    success, message = usersDB.register(client, username, userId, password)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 409


# Route for user login
@app.route('/api/users/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    userId = data.get('userId')
    password = data.get('password')

    if not all([userId, password]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to log in the user
    success, message, userId, username = usersDB.login(client, userId, password)

    if success:
        session['userId'] = userId
        session['username'] = username
        return jsonify({"message": message, "userId": userId, "username": username}), 200
    else:
        return jsonify({"message": message}), 409


@app.route('/api/users/logout', methods=['POST'])
def logout():
    # Clear the entire session, effectively logging out the user
    session.clear() 
    
    return jsonify({"message": "Logged out successfully"}), 200


@app.route('/api/users/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    userId = session.get('userId')
    oldPassword = data.get('oldPassword')
    newPassword = data.get('newPassword')

    if not all([userId, oldPassword, newPassword]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to log in the user
    success, message = usersDB.resetPassword(client, userId, oldPassword, newPassword)

    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 409


# Route for getting the list of user projects
@app.route('/api/projects/', methods=['GET'])
def get_user_projects_list():

    userId = session.get('userId')
    # Fetch the user's projects using the usersDB module
    success, message, projectsList = usersDB.getUserProjectsList(client, userId)

    # Return a JSON response
    if success:
        return jsonify({"message": message, "projectsList": projectsList}), 200
    else:
        return jsonify({"message": message}), 404

# Route for creating a new project
@app.route('/api/projects/create', methods=['POST'])
def create_project():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    name = data.get('name')
    projectId = data.get('projectId')
    description = data.get('description')
    userId = session.get('userId') 

    if not all([name, projectId, description, userId]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to add the project using the projectsDB module
    success, message, projectId, name = projectsDB.createProject(client, name, projectId, description, userId)

    # Return a JSON response
    if success:
        return jsonify({"message": message, "projectId": projectId, "name": name}), 200
    else:
        return jsonify({"message": message}), 409

# Route for getting project information
@app.route('/api/projects/<projectId>', methods=['GET'])
def get_project_info(projectId):
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    userId = session.get('userId')
    session['projectId'] = projectId

    if not all([projectId, userId]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to get the project information using the projectsDB module
    success, message, project = projectsDB.queryProject(client, projectId)
    if success:
        return jsonify({"message": message, "project": project}), 200
    else:
        return jsonify({"message": message}), 404

@app.route('/api/projects/add_user_to_project', methods=['POST'])
def add_user_to_project():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    projectId = data.get('projectId')
    userId = data.get('userId')
    
    if not all([projectId, userId]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to add the user to the project using the projectsDB module
    success, message, _, _ = projectsDB.addUser(client, projectId, userId)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 404


# Route for checking out hardware
@app.route('/api/projects/checkout', methods=['POST'])
def check_out():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    projectId = session.get('projectId')
    hwSetName = data.get('setName')
    qty = data.get('qty')
    userId = session.get('userId')

    if not all([projectId, hwSetName, qty, userId]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to check out the hardware using the projectsDB module
    success, message, checkedOutQty, newAvailability, error = projectsDB.checkOutHW(client, projectId, hwSetName, qty, userId)

    # Return a JSON response
    if success and error == -1:
        return jsonify({"message": message, "CheckedOut": checkedOutQty, "Availability": newAvailability, "error": error}), 206
    elif success:
        return jsonify({"message": message, "CheckedOut": checkedOutQty, "Availability": newAvailability, "error": error}), 200
    else:
        return jsonify({"message": message, "error": error}), 404

# Route for checking in hardware
@app.route('/api/projects/checkin', methods=['POST'])
def check_in():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    projectId = session.get('projectId')
    hwSetName = data.get('setName')
    qty = data.get('qty')
    userId = session.get('userId')

    if not all([projectId, hwSetName, qty, userId]):
        return jsonify({"message": "Missing required fields"}), 401
    
    # Attempt to check in the hardware using the projectsDB module
    success, message, returnedQty, newAvailability, error = projectsDB.checkInHW(client, projectId, hwSetName, qty, userId)

    # Return a JSON response
    if success:
        return jsonify({"message": message, "CheckedIn": returnedQty, "Availability": newAvailability, "error": error}), 200
    else:
        return jsonify({"message": message, "error": error}), 404

# Route for creating a new hardware set
@app.route('/api/hardware/create', methods=['POST'])
def create_hardware_set():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    setName = data.get('setName')
    capacity = data.get('capacity')
    userId = session.get('userId')

    if not all([setName, capacity, userId]):
        return jsonify({"message": "Missing required fields"}), 400
    
    # Attempt to create the hardware set using the hardwareDB module
    success, message = hardwareDB.createHardwareSet(client, setName, capacity)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"message": message}), 400


# Route for getting hardware information
@app.route('/api/hardware/<setName>', methods=['GET'])
def get_hw_info(setName):
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400
    
    if not all([setName]):
        return jsonify({"message": "Missing required fields"}), 401
    
    # Attempt to get hardware information using the hardwareDB module
    success, message, hardwareSet = hardwareDB.queryHardwareSet(client, setName)

    # Return a JSON response
    if success:
        return jsonify({"message": message, "hardwareSet": hardwareSet}), 200
    else:
        return jsonify({"message": message}), 404

@app.route('/api/hardware', methods=['GET'])
def get_all_hw_info():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    # Attempt to get all hardware set names using the hardwareDB module
    success, message, hardwareSets = hardwareDB.getAllHwInfo(client)

    # Return a JSON response
    if success:
        return jsonify({"message": message, "hardwareSets": hardwareSets}), 200
    else:
        return jsonify({"message": message}), 404

@app.route('/api/hardware/add_capacity', methods=['POST'])
def add_capacity():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    setName = data.get('setName')
    addCapacity = data.get('addCapacity')
    userId = session.get('userId')

    if not all([setName, addCapacity, userId]):
        return jsonify({"message": "Missing required fields"}), 400
    
    # Attempt to add capacity to the hardware set using the hardwareDB module
    success, message = hardwareDB.updateCapacity(client, setName, addCapacity)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 400


# def serve(path):
#     if path != "" and os.path.exists(app.static_folder + '/' + path):
#         return send_from_directory(app.static_folder, path)
#     else:
#         return send_from_directory(app.static_folder, 'index.html')

# Main entry point for the application
if __name__ == '__main__':
    app.run()

