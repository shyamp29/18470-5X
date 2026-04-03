# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, session
from flask_cors import CORS
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
    raise ValueError(
        "No MONGODB_URI found in environment variables. Did you set it in your .env file?"
    )

client = MongoClient(MONGODB_SERVER)

# Initialize a new Flask web application
app = Flask(__name__)
app.secret_key = "encription_key"
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_HTTPONLY"] = True

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


def lowercase_project(project):
    if not project:
        return project
    return {
        "_id": project.get("_id"),
        "projectid": project.get("projectid"),
        "name": project.get("name"),
        "description": project.get("description"),
        "owneruserid": project.get("owneruserid"),
        "checkedout": project.get("checkedout", {}),
        "members": project.get("members", []),
        "createdat": project.get("createdat"),
        "updatedat": project.get("updatedat"),
    }


def lowercase_hardware_set(hardware_set):
    if not hardware_set:
        return hardware_set
    return {
        "_id": hardware_set.get("_id"),
        "setname": hardware_set.get("setname"),
        "capacity": hardware_set.get("capacity"),
        "availability": hardware_set.get("availability"),
        "checkedoutby": hardware_set.get("checkedoutby", {}),
    }


# Route for adding a new user
@app.route("/api/users/register", methods=["POST"])
def add_user():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    username = data.get("username")
    userid = data.get("userid")
    password = data.get("password")

    if not all([username, userid, password]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to add the user using the usersDB module
    success, message = usersDB.register(client, username, userid, password)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 409


# Route for user login
@app.route("/api/users/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    userid = data.get("userid")
    password = data.get("password")

    if not all([userid, password]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to log in the user
    success, message, userid, username = usersDB.login(client, userid, password)

    if success:
        session["userid"] = userid
        session["username"] = username
        return (
            jsonify({"message": message, "userid": userid, "username": username}),
            200,
        )
    else:
        return jsonify({"message": message}), 409


@app.route("/api/users/logout", methods=["POST"])
def logout():
    # Clear the entire session, effectively logging out the user
    session.clear()

    return jsonify({"message": "Logged out successfully"}), 200


@app.route("/api/users/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    userid = session.get("userid")
    oldPassword = data.get("oldPassword")
    newPassword = data.get("newPassword")

    if not all([userid, oldPassword, newPassword]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to log in the user
    success, message = usersDB.resetPassword(client, userid, oldPassword, newPassword)

    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 409

@app.route("/api/users/verify", methods=["POST"])
def verify_user():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    userid = data.get("userid")
    username = data.get("username")

    if not all([userid, username]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to verify the user
    success, message = usersDB.verifyUser(client, userid, username)

    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 409

@app.route("/api/users/change-password", methods=["POST"])
def change_password():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    userid = session.get("userid")
    password = data.get("password")

    if not all([userid, password]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to change the password
    success, message = usersDB.changePassword(client, userid, password)

    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 409

# Route for getting the list of user projects
@app.route("/api/projects/", methods=["GET"])
def get_user_projects_list():

    userid = session.get("userid")
    # Fetch the user's projects using the usersDB module
    success, message, projectsList = usersDB.getUserProjectsList(client, userid)

    # Return a JSON response
    if success:
        return (
            jsonify(
                {
                    "message": message,
                    "projectslist": [lowercase_project(p) for p in projectsList],
                }
            ),
            200,
        )
    else:
        return jsonify({"message": message}), 404


# Route for creating a new project
@app.route("/api/projects/create", methods=["POST"])
def create_project():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    name = data.get("name")
    projectid = data.get("projectid")
    description = data.get("description")
    userid = session.get("userid")

    if not all([name, projectid, description, userid]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to add the project using the projectsDB module
    success, message, projectid, name = projectsDB.createProject(
        client, name, projectid, description, userid
    )

    # Return a JSON response
    if success:
        return jsonify({"message": message, "projectid": projectid, "name": name}), 200
    else:
        return jsonify({"message": message}), 409


# Route for getting all projects
@app.route("/api/projects/all", methods=["GET"])
def get_all_projects():
    userid = session.get("userid")
    if not userid:
        return jsonify({"message": "Unauthorized"}), 401
    success, message, projects = projectsDB.getAllProjects(client)
    if success:
        return jsonify({"message": message, "projectslist": [lowercase_project(p) for p in projects]}), 200
    else:
        return jsonify({"message": message}), 404


# Route for getting project information
@app.route("/api/projects/<projectid>", methods=["GET"])
def get_project_info(projectid):
    userid = session.get("userid")
    session["projectid"] = projectid

    if not all([projectid, userid]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to get the project information using the projectsDB module
    success, message, project = projectsDB.queryProject(client, projectid)
    if success:
        lp = lowercase_project(project)
        lp["ownerusername"] = usersDB.getUsernameById(client, lp["owneruserid"])
        lp["members"] = [str(memberid) + ": " + str(usersDB.getUsernameById(client, str(memberid).strip())) for memberid in lp["members"]]
        return jsonify({"message": message, "project": lp}), 200
    else:
        return jsonify({"message": message}), 404


@app.route("/api/projects/add_user_to_project", methods=["POST"])
def add_user_to_project():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    projectid = data.get("projectid")
    newUserId = data.get("userid")
    requesterId = session.get("userid")

    if not all([projectid, newUserId, requesterId]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to add the user to the project using the projectsDB module
    success, message, _, _ = projectsDB.addUser(client, projectid, requesterId, newUserId)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 404


@app.route("/api/projects/close_project", methods=["POST"])
def close_project():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    projectid = data.get('projectid')
    userid = session.get('userid')

    if not all([projectid, userid]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to close the project using the projectsDB module
    success, message = projectsDB.closeProject(client, userid, projectid)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 404

@app.route("/api/projects/leave_project", methods=["POST"])
def leave_project():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    projectid = data.get('projectid')
    userid = session.get('userid')

    if not all([projectid, userid]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to leave the project using the projectsDB module
    success, message = projectsDB.leaveProject(client, userid, projectid)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"message": message}), 404


# Route for checking out hardware
@app.route("/api/projects/checkout", methods=["POST"])
def check_out():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    projectid = session.get("projectid")
    hwSetName = data.get("setname")
    qty = data.get("qty")
    userid = session.get("userid")

    if not all([projectid, hwSetName, qty, userid]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to check out the hardware using the projectsDB module
    success, message, checkedoutQty, newAvailability, error = projectsDB.checkOutHW(
        client, projectid, hwSetName, qty, userid
    )

    # Return a JSON response
    if success and error == -1:
        return (
            jsonify(
                {
                    "message": message,
                    "checkedout": checkedoutQty,
                    "availability": newAvailability,
                    "error": error,
                }
            ),
            206,
        )
    elif success:
        return (
            jsonify(
                {
                    "message": message,
                    "checkedout": checkedoutQty,
                    "availability": newAvailability,
                    "error": error,
                }
            ),
            200,
        )
    else:
        return jsonify({"message": message, "error": error}), 404


# Route for checking in hardware
@app.route("/api/projects/checkin", methods=["POST"])
def check_in():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    projectid = session.get("projectid")
    hwSetName = data.get("setname")
    qty = data.get("qty")
    userid = session.get("userid")

    if not all([projectid, hwSetName, qty, userid]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to check in the hardware using the projectsDB module
    success, message, returnedQty, newAvailability, error = projectsDB.checkInHW(
        client, projectid, hwSetName, qty, userid
    )

    # Return a JSON response
    if success and error == -1:
        return (
            jsonify(
                {
                    "message": message,
                    "checkedin": returnedQty,
                    "availability": newAvailability,
                    "error": error,
                }
            ),
            206,
        )
    elif success:
        return (
            jsonify(
                {
                    "message": message,
                    "checkedin": returnedQty,
                    "availability": newAvailability,
                    "error": error,
                }
            ),
            200,
        )
    else:
        return jsonify({"message": message, "error": error}), 404


# Route for creating a new hardware set
@app.route("/api/hardware/create", methods=["POST"])
def create_hardware_set():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    setname = data.get("setname")
    capacity = data.get("capacity")
    userid = session.get("userid")

    if not all([setname, capacity, userid]):
        return jsonify({"message": "Missing required fields"}), 400
    
    # Check if user is an admin
    success_check, message_check, is_admin = usersDB.isAdminUser(client, userid)
    if not success_check or not is_admin:
        return jsonify({"success": False, "message": "Admin privileges required to create hardware"}), 403
    
    # Attempt to create the hardware set using the hardwareDB module
    success, message = hardwareDB.createHardwareSet(client, setname, capacity)

    # Return a JSON response
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"message": message}), 400


# Route for updating hardware capacity (scaling)
@app.route('/update_hardware_capacity', methods=['POST'])
def update_hardware_capacity():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Invalid JSON data"}), 400

    hwName = data.get('hwName')
    newCapacity = data.get('newCapacity')
    userid = session.get('user_id')

    if not all([hwName, newCapacity, userid]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400
    
    # Check if user is an admin
    success_check, message_check, is_admin = usersDB.isAdminUser(client, userid)
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
@app.route("/api/hardware/<setname>", methods=["GET"])
def get_hw_info(setname):
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    if not all([setname]):
        return jsonify({"message": "Missing required fields"}), 401

    # Attempt to get hardware information using the hardwareDB module
    success, message, hardwareSet = hardwareDB.queryHardwareSet(client, setname)

    # Return a JSON response
    if success:
        return (
            jsonify(
                {"message": message, "hardwareset": lowercase_hardware_set(hardwareSet)}
            ),
            200,
        )
    else:
        return jsonify({"message": message}), 404


@app.route("/api/hardware", methods=["GET"])
def get_all_hw_info():
    # Attempt to get all hardware set names using the hardwareDB module
    success, message, hardwareSets = hardwareDB.getAllHwInfo(client)

    # Return a JSON response
    if success:
        return (
            jsonify(
                {
                    "message": message,
                    "hardwaresets": [lowercase_hardware_set(h) for h in hardwareSets],
                }
            ),
            200,
        )
    else:
        return jsonify({"message": message}), 404


@app.route("/api/hardware/add_capacity", methods=["POST"])
def add_capacity():
    # Extract data from request
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON data"}), 400

    setname = data.get("setname")
    addCapacity = data.get("addCapacity")
    userid = session.get("userid")

    if not all([setname, addCapacity, userid]):
        return jsonify({"message": "Missing required fields"}), 400

    # Attempt to add capacity to the hardware set using the hardwareDB module
    success, message = hardwareDB.updateCapacity(client, setname, addCapacity)

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
if __name__ == "__main__":
    app.run(debug=True)
