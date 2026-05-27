from models.locationsModel import Location
from extensions import db
from flask import request

def get_all_locations():
    locations = Location.query.order_by(Location.id.asc()).all()
    return [serialize_location(location) for location in locations], 200

def get_location_by_id(location_id):
    location = Location.query.get(location_id)
    if not location:
        return {"error": "Location not found"}, 404
    return serialize_location(location), 200

def get_location_by_name(name):
    locations = Location.query.filter(Location.name.ilike(f"%{name}%")).all()
    return [serialize_location(location) for location in locations], 200 


def create_location(data):
    name = data.get("name")
    building = data.get("building")
    floor = data.get("floor")
    description = data.get("description")

    if not name or not building or not floor:
        return {"error": "Name, building and floor are required"}, 400
    
    if Location.query.filter_by(name=name).first():
        return {"error": "Location already saved"}, 400

    new_location = Location(
        name=name,
        building=building,
        floor=floor,
        description=description
    )

    db.session.add(new_location)
    db.session.commit()

    return {
        "message": "Location created successfully",
        "location": serialize_location(new_location)
    }, 200

def update_location(location_id, data):

    location = db.session.get(Location, location_id)

    if not location:
        return {"error": "Location not found"}, 404

    if not data:
        return {"error": "Request body is required"}, 400

    # PATCH -> actualización parcial
    if request.method == "PATCH":

        if "name" in data:
            location.name = data["name"]

        if "building" in data:
            location.building = data["building"]

        if "floor" in data:
            location.floor = data["floor"]

        if "description" in data:
            location.description = data["description"]

    # PUT -> actualización completa
    elif request.method == "PUT":

        name = data.get("name")
        building = data.get("building")
        floor = data.get("floor")
        description = data.get("description")

        if not name or not building or not floor:
            return {
                "error": "Name, building and floor are required"
            }, 400

        location.name = name
        location.building = building
        location.floor = floor
        location.description = description

    db.session.commit()

    return {
        "message": "Location updated successfully",
        "location": serialize_location(location)
    }, 200

def delete_location(location_id):
    location = Location.query.get(location_id)
    if not location:
        return {"error": "Location not found"}, 404

    db.session.delete(location)
    db.session.commit()
    return {"message": "Location deleted successfully"}, 200

def serialize_location(location):
    return {
        "id": location.id,
        "name": location.name,
        "building": location.building,
        "floor": location.floor,
        "description": location.description
    }