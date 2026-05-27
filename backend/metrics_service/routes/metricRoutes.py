from flask import Blueprint, request, jsonify
from controllers.metricsController import *
from middlewares.auth_middleware import *

metrics_bp = Blueprint("metrics_bp", __name__)

@metrics_bp.route("/", methods=["GET"])
@token_required
def get_metrics_route():
    result, status_code = get_all_metrics()
    return jsonify(result), status_code

@metrics_bp.route("/<int:metric_id>", methods=["GET"])
@token_required
def get_metric_route(metric_id):
    result, status_code = get_metric_by_id(metric_id)
    return jsonify(result), status_code

@metrics_bp.route("/device/<int:device_id>", methods=["GET"])
@token_required
def get_metrics_by_device_route(device_id):
    result, status_code = get_metrics_by_device_id(device_id)
    return jsonify(result), status_code

@metrics_bp.route("/", methods=["POST"])
@admin_required
def create_metric_route():
    data = request.get_json()
    result, status_code = create_metric(data)
    return jsonify(result), status_code

@metrics_bp.route("/<int:metric_id>", methods=["DELETE"])
@superadmin_required
def delete_metric_route(metric_id):
    result, status_code = delete_metric(metric_id)
    return jsonify(result), status_code

@metrics_bp.route("/types", methods=["GET"])
@token_required
def get_metric_types_route():
    name = request.args.get("name")
    if name:
        result, status_code = get_metric_type_by_name(name)
    else:
        result, status_code = get_all_metric_types()
    return jsonify(result), status_code

@metrics_bp.route("/types", methods=["POST"])
@admin_required
def create_metric_type_route():
    data = request.get_json()
    result, status_code = create_metric_type(data)
    return jsonify(result), status_code

@metrics_bp.route("/types/<int:type_id>", methods=["PUT"])
@admin_required
def update_metric_type_route(type_id):
    data = request.get_json()
    result, status_code = update_metric_type(type_id, data)
    return jsonify(result), status_code

@metrics_bp.route("/types/<int:type_id>", methods=["DELETE"])
@superadmin_required
def delete_metric_type_route(type_id):
    result, status_code = delete_metric_type(type_id)
    return jsonify(result), status_code



