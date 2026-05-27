from extensions import db

class MetricType(db.Model):
    __tablename__ = 'metric_types'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80),unique=True,nullable=False)
    unit = db.Column(db.String(20),nullable=False)
    description = db.Column(db.String(255))
    warning_threshold = db.Column(db.Float)
    critical_threshold = db.Column(db.Float)            

class Metric(db.Model):
    __tablename__ = 'metrics'

    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer,nullable=False,index=True)
    metric_type_id = db.Column(db.Integer,db.ForeignKey('metric_types.id'),nullable=False)
    value = db.Column(db.Float,nullable=False)
    recorded_at = db.Column(db.DateTime,server_default=db.func.now(),nullable=False,index=True)
    metric_type = db.relationship("MetricType")