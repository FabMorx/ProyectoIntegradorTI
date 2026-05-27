import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,     
        "pool_recycle": 280,       
        "pool_size": 5,
        "max_overflow": 10
    }
    
    AUTH_SERVICE_URL = "http://localhost:5006"
    USERS_SERVICE_URL = "http://localhost:5001"
    LOCATIONS_SERVICE_URL = "http://localhost:5003"
    DEVICES_SERVICE_URL = "http://localhost:5002"
    METRICS_SERVICE_URL = "http://localhost:5004"
    ALERTS_SERVICE_URL = "http://localhost:5005"