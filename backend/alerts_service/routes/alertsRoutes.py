from flask import Blueprint, request, jsonify
from controllers.alertsController import *
from middlewares.auth_middleware import *

alerts_bp = Blueprint("alerts_bp", __name__)

@alerts_bp.route("/", methods=["GET"])
@token_required
def get_alerts_route():
    result, status_code = get_all_alerts()
    return jsonify(result), status_code

@alerts_bp.route("/<int:alert_id>", methods=["GET"])
@token_required
def get_alert_route(alert_id):
    result, status_code = get_alert_by_id(alert_id)
    return jsonify(result), status_code

@alerts_bp.route("/", methods=["POST"])
@admin_required
def create_alert_route():
    data = request.get_json()
    result, status_code = create_alert(data)
    return jsonify(result), status_code

@alerts_bp.route("/<int:alert_id>/resolve", methods=["PATCH"])
@technician_required
def patch_alert_route(alert_id):
    data = request.get_json()
    result, status_code = resolve_alert(alert_id)
    return jsonify(result), status_code

@alerts_bp.route("/<int:alert_id>", methods=["DELETE"])
@superadmin_required
def delete_alert_route(alert_id):
    result, status_code = delete_alert(alert_id)
    return jsonify(result), status_code

@alerts_bp.route("/severities", methods=["GET"])
@token_required
def get_alert_severities_route():
    result, status_code = get_all_alert_severities()
    return jsonify(result), status_code

