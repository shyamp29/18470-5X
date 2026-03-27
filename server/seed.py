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
from dotenv import load_dotenv
from pymongo import MongoClient
from werkzeug.security import generate_password_hash

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
#  { username, userId, password (hashed), projects: [projectId, ...] }
# ══════════════════════════════════════════════════════════════════════════════
users = [
    {
        "userId":   "admin",
        "username": "Admin User",
        "password": generate_password_hash("admin123"),
        "projects": ["PROJ-101", "PROJ-102"],
    },
    {
        "userId":   "tester1",
        "username": "Jane Doe",
        "password": generate_password_hash("pass456"),
        "projects": ["PROJ-102", "PROJ-103"],
    },
    {
        "userId":   "deve1",
        "username": "Mark Smith",
        "password": generate_password_hash("pass789"),
        "projects": ["PROJ-103", "PROJ-104"],
    },
]
db.users.insert_many(users)
print(f"Inserted {len(users)} users.")

# ══════════════════════════════════════════════════════════════════════════════
#  PROJECTS   (schema from projectsDB.py)
#  { projectName, projectId, description, hwSets: {hwName: qty}, users: [...] }
# ══════════════════════════════════════════════════════════════════════════════
projects = [
    {
        "projectId":   "PROJ-101",
        "projectName": "System Alpha",
        "description": "Main server allocation and load testing.",
        "hwSets":      {"HWSet1": 20, "HWSet2": 10},
        "users":       ["admin", "tester1"],
    },
    {
        "projectId":   "PROJ-102",
        "projectName": "Beta Testing",
        "description": "Secondary node deployment and QA staging.",
        "hwSets":      {"HWSet1": 15, "HWSet2": 30},
        "users":       ["tester1", "admin"],
    },
    {
        "projectId":   "PROJ-103",
        "projectName": "Cloud Migration",
        "description": "Migrating on-prem workloads to cloud infrastructure.",
        "hwSets":      {"HWSet1": 5, "HWSet2": 20},
        "users":       ["deve1", "tester1"],
    },
    {
        "projectId":   "PROJ-104",
        "projectName": "Data Pipeline V2",
        "description": "Rebuilding the ETL pipeline with improved throughput.",
        "hwSets":      {"HWSet1": 0, "HWSet2": 10},
        "users":       ["deve1"],
    },
]
db.Projects.insert_many(projects)
print(f"Inserted {len(projects)} projects.")

# ══════════════════════════════════════════════════════════════════════════════
#  HARDWARE   (schema from hardwareDB.py)
#  { hwName, capacity, availability }
#
#  Invariant: availability = capacity - SUM(all project hwSets for this set)
#  HWSet1: 100 - (20+15+5+0) = 60  ✓
#  HWSet2: 200 - (10+30+20+10) = 130  ✓
# ══════════════════════════════════════════════════════════════════════════════
hardware = [
    {"hwName": "HWSet1", "capacity": 100, "availability": 60},
    {"hwName": "HWSet2", "capacity": 200, "availability": 130},
]
db.hardware.insert_many(hardware)
print(f"Inserted {len(hardware)} hardware sets.")

print("\nSeed complete. Test credentials:")
print("  admin   / admin123")
print("  tester1 / pass456")
print("  deve1   / pass789")

client.close()
