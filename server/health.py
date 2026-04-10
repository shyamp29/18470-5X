import os
from flask import Blueprint, jsonify, redirect

health_bp = Blueprint("health", __name__)


@health_bp.route("/", methods=["GET"])
def index():
    return redirect("/health")


@health_bp.route("/health", methods=["GET"])
def health_check(client=None):
    from flask import current_app
    client = current_app.config["MONGO_CLIENT"]
    report = {}

    # 1. MongoDB connectivity
    try:
        client.admin.command("ping")
        report["mongo"] = "connected"
    except Exception as e:
        report["mongo"] = f"error: {e}"

    # 2. Database name in use
    db_name = os.getenv("DB_NAME")
    report["db_name"] = db_name or "NOT SET"

    # 3. Collection counts
    if report["mongo"] == "connected" and db_name:
        try:
            db = client[db_name]
            report["collections"] = {
                "Users":    db.Users.count_documents({}),
                "Projects": db.Projects.count_documents({}),
                "Hardware": db.Hardware.count_documents({}),
            }
        except Exception as e:
            report["collections"] = f"error: {e}"
    else:
        report["collections"] = "skipped"

    # 4. Environment variables present (values hidden)
    report["env"] = {
        "MONGODB_URI":  "set" if os.getenv("MONGODB_URI")  else "MISSING",
        "DB_NAME":      "set" if os.getenv("DB_NAME")      else "MISSING",
        "FRONTEND_URL": "set" if os.getenv("FRONTEND_URL") else "MISSING",
    }

    report["status"] = "ok"
    return jsonify(report), 200
