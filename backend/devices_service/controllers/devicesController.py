from models.devicesModel import Device, DeviceType
from extensions import db
import requests
from config import Config
from flask import request

def get_all_devices():
    devices = Device.query.order_by(Device.id.asc()).all()
    return [serialize_device(device) for device in devices], 200

def get_device_by_id(device_id):
    device = Device.query.get(device_id)
    if not device:
        return {"error": "Device not found"}, 404
    return serialize_device(device), 200

def get_device_by_name(name):
    devices = Device.query.filter(Device.name.ilike(f"%{name}%")).all()
    return [serialize_device(device) for device in devices], 200

def create_device(data):
    name = data.get("name")
    ip_address = data.get("ip_address")
    mac_address = data.get("mac_address")
    status = data.get("status")
    device_type_id = data.get("device_type_id")
    location_id = data.get("location_id")

    if not name or not ip_address or not mac_address or not status or not device_type_id or not location_id:
        return {"error": "All fields are required"}, 400

    if not DeviceType.query.get(device_type_id):
        return {"error": "Device type not found"}, 404

    try:
        headers = {'Authorization': request.headers.get('Authorization')}
        location_response = requests.get(
            f"{Config.LOCATIONS_SERVICE_URL}/locations/{location_id}",
            headers=headers,
            timeout=5
        )
        if location_response.status_code != 200:
            return {"error": "Location not found"}, 404
    except requests.exceptions.RequestException:
        return {"error": "Locations service unavailable"}, 503

    new_device = Device(
        name=name,
        ip_address=ip_address,
        mac_address=mac_address,
        status=status,
        device_type_id=device_type_id,
        location_id=location_id
    )
    db.session.add(new_device)
    db.session.commit()
    return {"message": "Device created successfully", "device": serialize_device(new_device)}, 201

def update_device(device_id, data):
    device = Device.query.get(device_id)
    if not device:
        return {"error": "Device not found"}, 404

    name = data.get("name")
    ip_address = data.get("ip_address")
    mac_address = data.get("mac_address")
    status = data.get("status")
    device_type_id = data.get("device_type_id")
    location_id = data.get("location_id")

    if not name or not ip_address or not mac_address or not status or not device_type_id or not location_id:
        return {"error": "All fields are required"}, 400

    if not DeviceType.query.get(device_type_id):
        return {"error": "Device type not found"}, 404

    try:
        headers = {'Authorization': request.headers.get('Authorization')}
        location_response = requests.get(
            f"{Config.LOCATIONS_SERVICE_URL}/locations/{location_id}",
            headers=headers,
            timeout=5
        )
        if location_response.status_code != 200:
            return {"error": "Location not found"}, 404
    except requests.exceptions.RequestException:
        return {"error": "Locations service unavailable"}, 503

    device.name = name
    device.ip_address = ip_address
    device.mac_address = mac_address
    device.status = status
    device.device_type_id = device_type_id
    device.location_id = location_id

    db.session.commit()
    return {"message": "Device updated successfully", "device": serialize_device(device)}, 200

def patch_device(device_id, data):
    device = Device.query.get(device_id)
    if not device:
        return {"error": "Device not found"}, 404

    if not data:
        return {"error": "Request body is required"}, 400

    if "name" in data:
        device.name = data["name"]
    if "ip_address" in data:
        device.ip_address = data["ip_address"]
    if "mac_address" in data:
        device.mac_address = data["mac_address"]
    if "status" in data:
        device.status = data["status"]
    if "device_type_id" in data:
        if not DeviceType.query.get(data["device_type_id"]):
            return {"error": "Device type not found"}, 404
        device.device_type_id = data["device_type_id"]
    if "location_id" in data:
        try:
            headers = {'Authorization': request.headers.get('Authorization')}
            location_response = requests.get(
                f"{Config.LOCATIONS_SERVICE_URL}/locations/{data['location_id']}",
                headers=headers,
                timeout=5
            )
            if location_response.status_code != 200:
                return {"error": "Location not found"}, 404
        except requests.exceptions.RequestException:
            return {"error": "Locations service unavailable"}, 503
        device.location_id = data["location_id"]

    db.session.commit()
    return {"message": "Device updated successfully", "device": serialize_device(device)}, 200

def delete_device(device_id):
    device = Device.query.get(device_id)
    if not device:
        return {"error": "Device not found"}, 404

    db.session.delete(device)
    db.session.commit()
    return {"message": "Device deleted successfully"}, 200

def get_all_device_types():
    device_types = DeviceType.query.order_by(DeviceType.id.asc()).all()
    return [serialize_device_type(device_type) for device_type in device_types], 200

def get_device_type_by_name(name):
    device_types = DeviceType.query.filter(DeviceType.name.ilike(f"%{name}%")).all()
    return [serialize_device_type(device_type) for device_type in device_types], 200

def create_device_type(data):
    name = data.get("name")
    description = data.get("description")

    if not name:
        return {"error": "Name is required"}, 400

    if DeviceType.query.filter_by(name=name).first():
        return {"error": "Device type already exists"}, 400

    new_device_type = DeviceType(
        name=name,
        description=description
    )

    db.session.add(new_device_type)
    db.session.commit()

    return {
        "message": "Device type created successfully", 
        "device_type": serialize_device_type(new_device_type)
        }, 200
    
def serialize_device(device):
    return {
        "id": device.id,
        "name": device.name,
        "ip_address": device.ip_address,
        "mac_address": device.mac_address,
        "status": device.status.value,
        "device_type_id": device.device_type_id,
        "location_id": device.location_id
    }

def serialize_device_type(device_type):
    return {
        "id": device_type.id,
        "name": device_type.name,
        "description": device_type.description
    }