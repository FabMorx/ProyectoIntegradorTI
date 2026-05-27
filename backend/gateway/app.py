from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import jwt
from functools import wraps
from config import Config

app = Flask(__name__)
app.json.sort_keys = False

CORS(app, supports_credentials=True)


# =========================
# TOKEN
# =========================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        if request.method == "OPTIONS":
            return '', 200

        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({"error": "Token required"}), 401

        try:
            token = auth_header.split(" ")[1]
            jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated


# =========================
# SAFE FORWARD REQUEST (MEJORADO)
# =========================
def forward_request(url):
    headers = {}

    if 'Authorization' in request.headers:
        headers['Authorization'] = request.headers['Authorization']

    try:
        if request.method == 'GET':
            return requests.get(url, headers=headers, params=request.args, timeout=10)

        elif request.method == 'POST':
            return requests.post(url, headers=headers, json=request.json, timeout=10)

        elif request.method == 'PUT':
            return requests.put(url, headers=headers, json=request.json, timeout=10)

        elif request.method == 'PATCH':
            return requests.patch(url, headers=headers, json=request.json, timeout=10)

        elif request.method == 'DELETE':
            return requests.delete(url, headers=headers, timeout=10)

    except requests.exceptions.RequestException as e:
        return None


# =========================
# SAFE RESPONSE PARSER (CLAVE)
# =========================
def safe_response(response):
    if response is None:
        return jsonify({"error": "Service unavailable"}), 503

    try:
        return jsonify(response.json()), response.status_code

    except Exception:
        return jsonify({
            "error": "Invalid response from service",
            "raw": response.text
        }), response.status_code


# =========================
# AUTH
# =========================
@app.route('/auth/register', methods=['POST'])
def register():
    response = forward_request(f"{Config.AUTH_SERVICE_URL}/auth/register")
    return safe_response(response)


@app.route('/auth/login', methods=['POST'])
def login():
    response = forward_request(f"{Config.AUTH_SERVICE_URL}/auth/login")
    return safe_response(response)


# =========================
# USERS
# =========================
@app.route('/users/', methods=['GET', 'OPTIONS'])
@token_required
def get_users():
    response = forward_request(f"{Config.USERS_SERVICE_URL}/users/")
    return safe_response(response)


@app.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
@token_required
def user_detail(user_id):
    response = forward_request(f"{Config.USERS_SERVICE_URL}/users/{user_id}")
    return safe_response(response)


@app.route('/users/roles', methods=['GET', 'OPTIONS'])
@token_required
def get_roles():
    response = forward_request(f"{Config.USERS_SERVICE_URL}/users/roles")
    return safe_response(response)


# =========================
# LOCATIONS
# =========================
@app.route('/locations/', methods=['GET', 'POST', 'OPTIONS'])
@token_required
def locations():
    response = forward_request(f"{Config.LOCATIONS_SERVICE_URL}/locations/")
    return safe_response(response)


@app.route('/locations/<int:location_id>', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'])
@token_required
def location_detail(location_id):
    response = forward_request(f"{Config.LOCATIONS_SERVICE_URL}/locations/{location_id}")
    return safe_response(response)


# =========================
# DEVICES
# =========================
@app.route('/devices/', methods=['GET', 'POST', 'OPTIONS'])
@token_required
def devices():
    response = forward_request(f"{Config.DEVICES_SERVICE_URL}/devices/")
    return safe_response(response)


@app.route('/devices/<int:device_id>', methods=['GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'])
@token_required
def device_detail(device_id):
    response = forward_request(f"{Config.DEVICES_SERVICE_URL}/devices/{device_id}")
    return safe_response(response)


@app.route('/devices/types', methods=['GET', 'POST', 'OPTIONS'])
@token_required
def device_types():
    response = forward_request(f"{Config.DEVICES_SERVICE_URL}/devices/types")
    return safe_response(response)


@app.route('/devices/search', methods=['GET', 'OPTIONS'])
@token_required
def search_devices():
    response = forward_request(f"{Config.DEVICES_SERVICE_URL}/devices/search")
    return safe_response(response)


# =========================
# METRICS
# =========================
@app.route('/metrics/', methods=['GET', 'POST', 'OPTIONS'])
@token_required
def metrics():
    response = forward_request(f"{Config.METRICS_SERVICE_URL}/metrics/")
    return safe_response(response)


@app.route('/metrics/<int:metric_id>', methods=['GET', 'DELETE', 'OPTIONS'])
@token_required
def metric_detail(metric_id):
    response = forward_request(f"{Config.METRICS_SERVICE_URL}/metrics/{metric_id}")
    return safe_response(response)


@app.route('/metrics/device/<int:device_id>', methods=['GET', 'OPTIONS'])
@token_required
def metrics_by_device(device_id):
    response = forward_request(f"{Config.METRICS_SERVICE_URL}/metrics/device/{device_id}")
    return safe_response(response)


@app.route('/metrics/types', methods=['GET', 'POST', 'OPTIONS'])
@token_required
def metric_types():
    response = forward_request(f"{Config.METRICS_SERVICE_URL}/metrics/types")
    return safe_response(response)


@app.route('/metrics/types/<int:type_id>', methods=['PUT', 'DELETE', 'OPTIONS'])
@token_required
def metric_type_detail(type_id):
    response = forward_request(f"{Config.METRICS_SERVICE_URL}/metrics/types/{type_id}")
    return safe_response(response)


# =========================
# ALERTS
# =========================
@app.route('/alerts/', methods=['GET', 'POST', 'OPTIONS'])
@token_required
def alerts():
    response = forward_request(f"{Config.ALERTS_SERVICE_URL}/alerts/")
    return safe_response(response)


@app.route('/alerts/<int:alert_id>', methods=['GET', 'DELETE', 'OPTIONS'])
@token_required
def alert_detail(alert_id):
    response = forward_request(f"{Config.ALERTS_SERVICE_URL}/alerts/{alert_id}")
    return safe_response(response)


@app.route('/alerts/<int:alert_id>/resolve', methods=['PATCH', 'OPTIONS'])
@token_required
def resolve_alert(alert_id):
    response = forward_request(f"{Config.ALERTS_SERVICE_URL}/alerts/{alert_id}/resolve")
    return safe_response(response)


@app.route('/alerts/severities', methods=['GET', 'OPTIONS'])
@token_required
def alert_severities():
    response = forward_request(f"{Config.ALERTS_SERVICE_URL}/alerts/severities")
    return safe_response(response)


if __name__ == '__main__':
    app.run(port=5000, debug=True)