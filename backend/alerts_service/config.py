import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,     
        "pool_recycle": 280,       
        "pool_size": 5,
        "max_overflow": 10
    }
    
    DEVICES_SERVICE_URL = "http://localhost:5002"
    METRICS_SERVICE_URL = "http://localhost:5004"
    USERS_SERVICE_URL = "http://localhost:5001"
    
    