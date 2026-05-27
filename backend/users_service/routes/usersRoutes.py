from flask import Blueprint, request, jsonify
from controllers.usersController import *
from middlewares.auth_middleware import token_required, superadmin_required

users_bp = Blueprint("users_bp", __name__)

@users_bp.route("/", methods=["GET"])
@superadmin_required
def get_users_route():
    result, status_code = get_all_users()
    return jsonify(result), status_code

@users_bp.route("/<int:user_id>", methods=["GET"])
@token_required
def get_user_route(user_id):
    result, status_code = get_user_by_id(user_id,request.user_id, request.user_role)
    return jsonify(result), status_code

@users_bp.route("/<int:user_id>", methods=["PUT"])
@token_required
def update_user_route(user_id):
    data = request.get_json()
    result, status_code = update_user(user_id, data, request.user_id, request.user_role )
    return jsonify(result), status_code

@users_bp.route("/<int:user_id>", methods=["DELETE"])
@superadmin_required
def delete_user_route(user_id):
    result, status_code = delete_user(user_id, request.user_id, request.user_role)
    return jsonify(result), status_code

@users_bp.route("/roles", methods=["GET"])
@token_required
def get_roles_route():
    result, status_code = get_all_roles()
    return jsonify(result), status_code

