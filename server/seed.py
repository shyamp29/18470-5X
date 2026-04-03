"""
seed.py
-------
Populates myapp_database with test data that mirrors the mock in serverSimulation.js.
Passwords are hashed with werkzeug (same library Flask uses in usersDB.py).

Run once after MongoDB is running:
    python seed.py

Safe to re-run — drops and recreates the three collections each time.
"""

import os
import certifi
from dotenv import load_dotenv
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from datetime import datetime

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGODB_URI)
db = client.myapp_database

# ── Drop existing collections so re-runs start clean ─────────────────────────
db.users.drop()
db.Projects.drop()
db.hardware.drop()
print("Dropped existing collections.")

# ══════════════════════════════════════════════════════════════════════════════
#  USERS   (schema from usersDB.py)
#  { userName, userid, passwordHash, createdAt, projects: [projectId, ...] }
# ══════════════════════════════════════════════════════════════════════════════
users = [
    {
        "userid":   "admin",
        "username": "Admin User",
        "passwordHash": generate_password_hash("admin123"),
        "projects": ["PROJ-101", "PROJ-102"],
    },
    {
        "userid":   "tester1",
        "username": "Jane Doe",
        "passwordHash": generate_password_hash("pass456"),
        "projects": ["PROJ-102", "PROJ-103"],
    },
    {
        "userid":   "dev1",
        "username": "Tester Sleepy",
        "passwordHash": generate_password_hash("pass789"),
        "projects": ["PROJ-103", "PROJ-104"],
    },
]
db.users.insert_many(users)
print(f"Inserted {len(users)} users.")

# ══════════════════════════════════════════════════════════════════════════════
#  PROJECTS   (schema from projectsDB.py)
#  { projectId, name, description, ownerUserid, checkedOut: {hwName: qty}, members: [...], createdAt, updatedAt }
# ══════════════════════════════════════════════════════════════════════════════
projects = [
    {
        "projectId": "PROJ-101",
        "name": "System Alpha",
        "description": "Main server allocation and load testing.",
        "ownerUserid": "admin",
        "checkedOut": {"HWSet1": 20, "HWSet2": 10},
        "members": ["admin", "tester1"],
        "createdAt": datetime.now(),
        "updatedAt": datetime.now(),
    },
    {
        "projectId": "PROJ-102",
        "name": "Beta Testing",
        "description": "Secondary node deployment and QA staging.",
        "ownerUserid": "tester1",
        "checkedOut": {"HWSet1": 15, "HWSet2": 30},
        "members": ["tester1", "admin"],
        "createdAt": datetime.now(),
        "updatedAt": datetime.now(),
    },
    {
        "projectId": "PROJ-103",
        "name": "Cloud Migration",
        "description": "Migrating on-prem workloads to cloud infrastructure.",
        "ownerUserid": "deve1",
        "checkedOut": {"HWSet1": 5, "HWSet2": 20},
        "members": ["deve1", "tester1"],
        "createdAt": datetime.now(),
        "updatedAt": datetime.now(),
    },
    {
        "projectId": "PROJ-104",
        "name": "Data Pipeline V2",
        "description": "Rebuilding the ETL pipeline with improved throughput.",
        "ownerUserid": "deve1",
        "checkedOut": {"HWSet1": 0, "HWSet2": 10},
        "members": ["deve1"],
        "createdAt": datetime.now(),
        "updatedAt": datetime.now(),
    },
]
db.Projects.insert_many(projects)
print(f"Inserted {len(projects)} projects.")

# ══════════════════════════════════════════════════════════════════════════════
#  HARDWARE   (schema from hardwareDB.py)
#  { setName, capacity, availability, checkedOutBy: {projectId: qty, ...} }
#
#  Invariant: availability = capacity - SUM(all project checkedOut values for this set)
#  HWSet1: 100 - (20+15+5+0) = 60  ✓
#  HWSet2: 200 - (10+30+20+10) = 130  ✓
# ══════════════════════════════════════════════════════════════════════════════
hardware = [
    {
        "setName": "HWSet1",
        "capacity": 100,
        "availability": 60,
        "checkedOutBy": {
            "PROJ-101": 20,
            "PROJ-102": 15,
            "PROJ-103": 5,
        },
    },
    {
        "setName": "HWSet2",
        "capacity": 200,
        "availability": 130,
        "checkedOutBy": {
            "PROJ-101": 10,
            "PROJ-102": 30,
            "PROJ-103": 20,
            "PROJ-104": 10,
        },
    },
]
db.hardware.insert_many(hardware)
print(f"Inserted {len(hardware)} hardware sets.")

print("\nSeed complete. Test credentials:")
print("  admin   / admin123")
print("  tester1 / pass456")
print("  deve1   / pass789")

client.close()
