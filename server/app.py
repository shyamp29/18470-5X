# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, session
from pymongo import MongoClient

# Import custom modules for database interactions
import usersDB
import projectsDB
import hardwareDB

import mongomock

client = mongomock.MongoClient()

# Define the MongoDB connection string
MONGODB_SERVER = "your_mongodb_connection_string_here"

# Initialize a new Flask web application
app = Flask(__name__)

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

# Route for the main page (Work in progress)
@app.route('/main')
def mainPage():
    # Extract data from request

    # Connect to MongoDB

    # Fetch user projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for joining a project
@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    projectId = data.get('projectId')
    userId = session.get('userId')

    if not all([projectId, userId]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Attempt to join the project using the usersDB module
    success, message = usersDB.joinProject(client, userId, projectId)

    # Return a JSON response
    if success:
        return jsonify({"success": True, "message": message}), 201
    else:
        return jsonify({"success": False, "message": message}), 400

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

    # Connect to MongoDB

    # Fetch project information using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting all hardware names
@app.route('/get_all_hw_names', methods=['POST'])
def get_all_hw_names():
    # Connect to MongoDB

    # Fetch all hardware names using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting hardware information
@app.route('/get_hw_info', methods=['POST'])
def get_hw_info():
    # Extract data from request

    # Connect to MongoDB

    # Fetch hardware set information using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking out hardware
@app.route('/check_out', methods=['POST'])
def check_out():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check out the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking in hardware
@app.route('/check_in', methods=['POST'])
def check_in():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check in the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for creating a new hardware set
@app.route('/create_hardware_set', methods=['POST'])
def create_hardware_set():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to create the hardware set using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking the inventory of projects
@app.route('/api/inventory', methods=['GET'])
def check_inventory():
    # Connect to MongoDB

    # Fetch all projects from the HardwareCheckout.Projects collection

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Main entry point for the application
if __name__ == '__main__':
    app.run()

