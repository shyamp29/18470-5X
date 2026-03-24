# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, session
from pymongo import MongoClient

# Import custom modules for database interactions
import usersDB
import projectsDB
import hardwareDB

# import mongomock

# client = mongomock.MongoClient()

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

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    userId = data.get('userId')
    password = data.get('password')

    if not all([userId, password]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to log in the user
    success, message = usersDB.login(client, userId, password)

    if success:
        session['user_id'] = userId
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 401

@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    userId = session.get('userId')
    oldPassword = data.get('oldPassword')
    newPassword = data.get('newPassword')

    if not all([userId, oldPassword, newPassword]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to log in the user
    success, message = usersDB.resetPassword(client, userId, oldPassword, newPassword)

    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 401

@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    userId = data.get('userId')
    username = data.get('username')
    newPassword = data.get('newPassword')

    if not all([userId, username, newPassword]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to log in the user
    success, message = usersDB.forgotPassword(client, userId, username, newPassword)

    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 401

# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    username = data.get('username')
    userId = data.get('userId')
    password = data.get('password')

    if not all([username, userId, password]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to add the user using the usersDB module
    success, message = usersDB.addUser(client, username, userId, password)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400

# Route for getting the list of user projects
@app.route('/get_user_projects_list', methods=['POST'])
def get_user_projects_list():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    userId = session.get('userId')
    # Fetch the user's projects using the usersDB module
    success, message = usersDB.getUserProjectsList(client, userId)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 400

# Route for getting all hardware names
@app.route('/get_user_hw_names', methods=['POST'])
def get_user_hw_names():
    # Connect to MongoDB
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400
    
    userId = session.get('userId')
    if not all([userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    # Attempt to get all hardware names using the hardwareDB module
    success, message = usersDB.getUserHWList(client, userId)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400



# Route for the main page (Work in progress)
@app.route('/main')
def mainPage():
    # Extract data from request

    # Connect to MongoDB

    # Fetch user projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# # Route for joining a project
# @app.route('/join_project', methods=['POST'])
# def join_project():
#     data = request.get_json()
#     if not data:
#         return jsonify({"success": False, "message": "Invalid JSON data"}), 400

#     projectId = data.get('projectId')
#     userId = session.get('userId')

#     if not all([projectId, userId]):
#         return jsonify({"success": False, "message": "Missing required fields"}), 400

#     # Attempt to join the project using the usersDB module
#     success1, message1 = usersDB.joinProject(client, userId, projectId)

#     # Add user to the project using the projectsDB module
#     success2, message2 = projectsDB.addUserToProject(client, userId, projectId)

#     if success1 and success2:
#         return jsonify({"success": True, "message": message1}), 201
#     else:
#         return jsonify({"success": False, "message": message1}), 400




# Route for creating a new project
@app.route('/create_project', methods=['POST'])
def create_project():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    projectName = data.get('projectName')
    projectId = data.get('projectId')
    description = data.get('description')
    userId = session.get('userId') 

    if not all([projectName, projectId, description, userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to add the project using the projectsDB module
    success, message = projectsDB.createProject(client, projectName, projectId, description, userId)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400

# Route for getting project information
@app.route('/get_project_info', methods=['POST'])
def get_project_info():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    projectId = data.get('projectId')
    userId = session.get('userId')
    session['projectId'] = projectId

    if not all([projectId, userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to get the project information using the projectsDB module
    success, message = projectsDB.queryProject(client, projectId)
    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 400

@app.route('/add_user_to_project', methods=['POST'])
def add_user_to_project():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    projectId = data.get('projectId')
    userId = data.get('userId')
    
    if not all([projectId, userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to add the user to the project using the projectsDB module
    success, message = projectsDB.addUser(client, projectId, userId)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400


# Route for checking out hardware
@app.route('/check_out', methods=['POST'])
def check_out():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    projectId = session.get('projectId')
    hwSetName = data.get('hwSetName')
    qty = data.get('qty')
    userId = session.get('userId')

    if not all([projectId, hwSetName, qty, userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to check out the hardware using the projectsDB module
    success, message = projectsDB.checkOutHW(client, projectId, hwSetName, qty, userId)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400

# Route for checking in hardware
@app.route('/check_in', methods=['POST'])
def check_in():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    projectId = session.get('projectId')
    hwSetName = data.get('hwSetName')
    qty = data.get('qty')
    userId = session.get('userId')

    if not all([projectId, hwSetName, qty, userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    # Attempt to check in the hardware using the projectsDB module
    success, message = projectsDB.checkInHW(client, projectId, hwSetName, qty, userId)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400

# Route for creating a new hardware set
@app.route('/create_hardware_set', methods=['POST'])
def create_hardware_set():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    hwName = data.get('hwName')
    qty = data.get('qty')
    userId = session.get('userId')

    if not all([hwName, qty, userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    # Check if user is an admin
    success_check, message_check, is_admin = usersDB.isAdminUser(client, userId)
    if not success_check or not is_admin:
        return jsonify({"success": False, "message": "Admin privileges required to create hardware"}), 403
    
    # Attempt to create the hardware set using the hardwareDB module
    success, message = hardwareDB.createHardwareSet(client, hwName, qty)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400


# Route for updating hardware capacity (scaling)
@app.route('/update_hardware_capacity', methods=['POST'])
def update_hardware_capacity():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    hwName = data.get('hwName')
    newCapacity = data.get('newCapacity')
    userId = session.get('user_id')

    if not all([hwName, newCapacity, userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    # Check if user is an admin
    success_check, message_check, is_admin = usersDB.isAdminUser(client, userId)
    if not success_check or not is_admin:
        return jsonify({"success": False, "message": "Admin privileges required to update hardware"}), 403
    
    # Attempt to update the hardware capacity using the hardwareDB module
    success, message = hardwareDB.updateCapacity(client, hwName, newCapacity)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 400


# Route for getting hardware information
@app.route('/get_hw_info', methods=['POST'])
def get_hw_info():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400
    
    hwName = data.get('hwName')
    if not all([hwName]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    # Attempt to get hardware information using the hardwareDB module
    success, message = hardwareDB.queryHardwareSet(client, hwName)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400

@app.route('/get_all_hw_names', methods=['POST'])
def get_all_hw_names():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    # Attempt to get all hardware set names using the hardwareDB module
    success, message = hardwareDB.getAllHwNames(client)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400

# Route for checking the inventory of projects
@app.route('/api/inventory', methods=['GET'])
def check_inventory():
    # Connect to MongoDB

    # Fetch all projects from the HardwareCheckout.Projects collection

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# def serve(path):
#     if path != "" and os.path.exists(app.static_folder + '/' + path):
#         return send_from_directory(app.static_folder, path)
#     else:
#         return send_from_directory(app.static_folder, 'index.html')

# Main entry point for the application
if __name__ == '__main__':
    app.run()

