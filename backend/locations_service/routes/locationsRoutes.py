from flask import Blueprint, request, jsonify
from controllers.locationsController import *
from middlewares.auth_middleware import *

locations_bp = Blueprint("locations_bp", __name__)

@locations_bp.route("/", methods=["GET"])
@token_required
def get_locations_route():
    name = request.args.get("name")
    if name:
        result, status_code = get_location_by_name(name)
    else:
        result, status_code = get_all_locations()
    return jsonify(result), status_code

@locations_bp.route("/<int:location_id>", methods=["GET"])
@token_required
def get_location_route(location_id):
    result, status_code = get_location_by_id(location_id)
    return jsonify(result), status_code

@locations_bp.route("/", methods=["POST"])
@admin_required
def create_location_route():
    data = request.get_json()
    result, status_code = create_location(data)
    return jsonify(result), status_code

@locations_bp.route("/<int:location_id>", methods=["PUT","PATCH"])
@admin_required
def update_location_route(location_id):
    data = request.get_json()
    result, status_code = update_location(location_id, data)
    return jsonify(result), status_code

@locations_bp.route("/<int:location_id>", methods=["DELETE"])
@superadmin_required
def delete_location_route(location_id):
    result, status_code = delete_location(location_id)
    return jsonify(result), status_code
