import jwt
from functools import wraps
from flask import request, jsonify

SECRET_KEY = "super_secret_key"

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if "Authorization" in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split(" ")
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]
                
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = payload['user_id']
            request.user_role = payload['role_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "invalid token"}), 401
        
        return f(*args, **kwargs)
    return decorated

def superadmin_required(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.user_role != 1:
            return jsonify({"message": "Superadmin access required"}), 403
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.user_role not in [1, 2]:  # superadmin y admin_ti
            return jsonify({"error": "Access denied, admin required"}), 403
        return f(*args, **kwargs)
    return decorated

def technician_required(f):
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.user_role not in [1, 2, 3]:  # superadmin, admin_ti y tecnico_ti
            return jsonify({"error": "Access denied"}), 403
        return f(*args, **kwargs)
    return decorated
