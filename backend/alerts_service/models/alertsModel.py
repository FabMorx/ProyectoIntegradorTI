from extensions import db
from models.enums import SeverityLevel


class AlertSeverity(db.Model):
    __tablename__ = 'alert_severities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Enum(SeverityLevel,name="severity_level_enum"),nullable=False,unique=True)
    color_code = db.Column(db.String(7))

class Alert(db.Model):
    __tablename__ = 'alerts'

    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer,nullable=False,index=True)
    metric_id = db.Column(db.Integer,nullable=True,index=True)
    resolved_by = db.Column(db.Integer,nullable=True)
    severity_id = db.Column(db.Integer,db.ForeignKey('alert_severities.id'),nullable=False)
    message = db.Column(db.String(255),nullable=False)
    is_resolved = db.Column(db.Boolean,default=False,nullable=False)
    created_at = db.Column(db.DateTime,server_default=db.func.now(),nullable=False)
    resolved_at = db.Column(db.DateTime)
    severity = db.relationship("AlertSeverity")