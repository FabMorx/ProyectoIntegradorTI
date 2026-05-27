from flask import Blueprint, jsonify, request
from controllers.devicesController import *
from middlewares.auth_middleware import *

devices_bp = Blueprint("devices_bp", __name__)

@devices_bp.route("/", methods=["GET"])
@token_required
def get_devices_route():
    result, status_code = get_all_devices()
    return jsonify(result), status_code

@devices_bp.route("/<int:device_id>", methods=["GET"])
@token_required
def get_device_route(device_id):
    result, status_code = get_device_by_id(device_id)
    return jsonify(result), status_code

@devices_bp.route("/search", methods=["GET"])
@token_required
def search_device_route():
    name = request.args.get("name")
    result, status_code = get_device_by_name(name)
    return jsonify(result), status_code

@devices_bp.route("/", methods=["POST"])
@admin_required
def create_device_route():
    data = request.get_json()
    result, status_code = create_device(data)
    return jsonify(result), status_code

@devices_bp.route("/<int:device_id>", methods=["PUT"])
@admin_required
def update_device_route(device_id):
    data = request.get_json()
    result, status_code = update_device(device_id, data)
    return jsonify(result), status_code

@devices_bp.route("/<int:device_id>", methods=["PATCH"])
@technician_required
def patch_device_route(device_id):
    data = request.get_json()
    result, status_code = patch_device(device_id, data)
    return jsonify(result), status_code

@devices_bp.route("/<int:device_id>", methods=["DELETE"])
@superadmin_required
def delete_device_route(device_id):
    result, status_code = delete_device(device_id)
    return jsonify(result), status_code

@devices_bp.route("/types", methods=["GET"])
@token_required
def get_device_types_route():
    name = request.args.get("name")
    if name:
        result, status_code = get_device_type_by_name(name)
    else:
        result, status_code = get_all_device_types()
    return jsonify(result), status_code

@devices_bp.route("/types", methods=["POST"])
@admin_required
def create_device_type_route():
    data = request.get_json()
    result, status_code = create_device_type(data)
    return jsonify(result), status_code
