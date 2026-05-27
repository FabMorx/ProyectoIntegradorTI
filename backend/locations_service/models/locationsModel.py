from extensions import db

class Location(db.Model):
    __tablename__ = 'locations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    building = db.Column(db.String(50), nullable=False)
    floor = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    
    def __repr__(self):
        return f"<Location {self.name}>"