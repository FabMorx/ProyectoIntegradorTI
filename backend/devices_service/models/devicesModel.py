from extensions import db
from models.enums import DeviceStatus

class DeviceType(db.Model):
    __tablename__ = 'device_types'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)

class Device(db.Model):
    __tablename__ = 'devices'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(15), nullable=False)
    mac_address = db.Column(db.String(17), nullable=False)
    status = db.Column(db.Enum(DeviceStatus, name="device_status_enum"),default=DeviceStatus.ACTIVE, nullable=False)
    device_type_id = db.Column(db.Integer,db.ForeignKey('device_types.id'), nullable=False)
    location_id = db.Column(db.Integer, nullable=False)
    
    

    