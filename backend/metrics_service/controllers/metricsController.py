from models.metricsModel import Metric, MetricType
from extensions import db
import requests
from config import Config

def get_all_metrics():
    metrics = Metric.query.order_by(Metric.id.asc()).all()
    return [serialize_metric(metric) for metric in metrics], 200

def get_metric_by_id(metric_id):
    metric = Metric.query.get(metric_id)
    if not metric:
        return {"error": "Metric not found"}, 404
    return serialize_metric(metric), 200

def get_metrics_by_device_id(device_id):
    device_response = requests.get(f"{Config.DEVICES_SERVICE_URL}/devices/{device_id}")
    if device_response.status_code == 404:
        return {"error": "Device not found"}, 404
    
    metrics = Metric.query.filter_by(device_id=device_id).order_by(Metric.recorded_at.asc()).all()
    if not metrics:
        return {"error": "No metrics found for this device"}, 404
    return [serialize_metric(metric) for metric in metrics], 200

def create_metric(data):
    if not data.get('device_id') or not data.get('metric_type_id') or data.get('value') is None:
        return {"error": "device_id, metric_type_id and value are required"}, 400

    device_response = requests.get(f"{Config.DEVICES_SERVICE_URL}/devices/{data['device_id']}")
    if device_response.status_code == 404:
        return {"error": "Device not found"}, 404
    
    metric_type = MetricType.query.get(data['metric_type_id'])
    if not metric_type:
        return {"error": "Metric type not found"}, 404

    new_metric = Metric(
        device_id=data['device_id'],
        metric_type_id=data['metric_type_id'],
        value=data['value']
    )
    db.session.add(new_metric)
    db.session.commit()
    return serialize_metric(new_metric), 201

def delete_metric(metric_id):
    metric = Metric.query.get(metric_id)
    if not metric:
        return {"error": "Metric not found"}, 404
    db.session.delete(metric)
    db.session.commit()
    return {"message": "Metric deleted successfully"}, 200

def get_all_metric_types():
    metric_types = MetricType.query.order_by(MetricType.id.asc()).all()
    return [serialize_metric_type(mt) for mt in metric_types], 200

def get_metric_type_by_name(name):
    metric_types = MetricType.query.filter(MetricType.name.ilike(f"%{name}%")).all()
    return [serialize_metric_type(mt) for mt in metric_types], 200

def create_metric_type(data):
    name = data.get("name")
    unit = data.get("unit")
    description = data.get("description")
    warning_threshold = data.get("warning_threshold")
    critical_threshold = data.get("critical_threshold")

    if not name or not unit:
        return {"error": "Name and unit are required"}, 400
    
    if MetricType.query.filter_by(name=name).first():
        return {"error": "Metric type already exists"}, 400

    new_metric_type = MetricType(
        name=name,
        unit=unit,
        description=description,
        warning_threshold=warning_threshold,
        critical_threshold=critical_threshold
    )
    
    db.session.add(new_metric_type)
    db.session.commit()
    return serialize_metric_type(new_metric_type), 201

def update_metric_type(type_id, data):
    metric_type = MetricType.query.get(type_id)
    if not metric_type:
        return {"error": "Metric type not found"}, 404
    
    if "name" in data:
        metric_type.name = data["name"]
    if "unit" in data:
        metric_type.unit = data["unit"]
    if "description" in data:
        metric_type.description = data["description"]
    if "warning_threshold" in data:
        metric_type.warning_threshold = data["warning_threshold"]
    if "critical_threshold" in data:
        metric_type.critical_threshold = data["critical_threshold"]
    
    db.session.commit()
    return serialize_metric_type(metric_type), 200

def delete_metric_type(type_id):
    metric_type = MetricType.query.get(type_id)
    if not metric_type:
        return {"error": "Metric type not found"}, 404
    
    if Metric.query.filter_by(metric_type_id=type_id).first():
        return {"error": "Cannot delete metric type with associated metrics"}, 400
    
    db.session.delete(metric_type)
    db.session.commit()
    return {"message": "Metric type deleted successfully"}, 200

def serialize_metric(metric):
    return {
        "id": metric.id,
        "device_id": metric.device_id,
        "metric_type_id": metric.metric_type_id,
        "value": metric.value,
        "recorded_at": metric.recorded_at.isoformat(),
        "type": serialize_metric_type(metric.metric_type)
    }
    
def serialize_metric_type(metric_type):
    return {
        "id": metric_type.id,
        "name": metric_type.name,
        "unit": metric_type.unit,
        "description": metric_type.description,
        "warning_threshold": metric_type.warning_threshold,
        "critical_threshold": metric_type.critical_threshold
    }