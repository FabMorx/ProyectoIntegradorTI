from models.alertsModel import Alert, AlertSeverity
from extensions import db
import requests
from datetime import datetime
from config import Config
from flask import request as flask_request  # ✅ AGREGADO

def get_all_alerts():
    alerts = Alert.query.order_by(Alert.created_at.asc()).all()
    return [serialize_alert(alert) for alert in alerts], 200

def get_alert_by_id(alert_id):
    alert = Alert.query.get(alert_id)
    if not alert:
        return {"error": "Alert not found"}, 404
    return serialize_alert(alert), 200

def create_alert(data):
    device_id = data.get("device_id")
    metric_id = data.get("metric_id")
    severity_id = data.get("severity_id")
    message = data.get("message")

    if not device_id or not severity_id or not message:
        return {"error": "device_id, severity_id and message are required"}, 400

    device_response = requests.get(f"{Config.DEVICES_SERVICE_URL}/devices/{device_id}")
    if device_response.status_code == 404:
        return {"error": "Device not found"}, 404

    if not AlertSeverity.query.get(severity_id):
        return {"error": "Severity not found"}, 404

    if metric_id:
        metric_response = requests.get(f"{Config.METRICS_SERVICE_URL}/metrics/{metric_id}")
        if metric_response.status_code == 404:
            return {"error": "Metric not found"}, 404

    new_alert = Alert(
        device_id=device_id,
        metric_id=metric_id,
        severity_id=severity_id,
        message=message,
        is_resolved=False
    )

    db.session.add(new_alert)
    db.session.commit()

    return {"message": "Alert created successfully", "alert": serialize_alert(new_alert)}, 201

def resolve_alert(alert_id):  # ✅ YA NO RECIBE data
    alert = Alert.query.get(alert_id)
    if not alert:
        return {"error": "Alert not found"}, 404

    if alert.is_resolved:
        return {"error": "Alert is already resolved"}, 400

    resolved_by = flask_request.user_id  # ✅ VIENE DEL TOKEN VIA MIDDLEWARE

    user_response = requests.get(f"{Config.USERS_SERVICE_URL}/users/{resolved_by}")
    if user_response.status_code == 404:
        return {"error": "User not found"}, 404

    alert.is_resolved = True
    alert.resolved_by = resolved_by
    alert.resolved_at = datetime.utcnow()

    db.session.commit()
    return {"message": "Alert resolved successfully", "alert": serialize_alert(alert)}, 200

def delete_alert(alert_id):
    alert = Alert.query.get(alert_id)
    if not alert:
        return {"error": "Alert not found"}, 404

    db.session.delete(alert)
    db.session.commit()
    return {"message": "Alert deleted successfully"}, 200

def get_all_alert_severities():
    severities = AlertSeverity.query.order_by(AlertSeverity.id.asc()).all()
    return [serialize_alert_severity(severity) for severity in severities], 200

def serialize_alert(alert):
    return {
        "id": alert.id,
        "device_id": alert.device_id,
        "metric_id": alert.metric_id,
        "severity_id": alert.severity_id,
        "severity": {                          
        "name": alert.severity.name.value
        } if alert.severity else None,
        "message": alert.message,
        "is_resolved": alert.is_resolved,
        "created_at": alert.created_at.isoformat(),
        "resolved_at": alert.resolved_at.isoformat() if alert.resolved_at else None,
        "resolved_by": alert.resolved_by
    }

def serialize_alert_severity(severity):
    return {
        "id": severity.id,
        "name": severity.name.value,
        "color_code": severity.color_code
    }