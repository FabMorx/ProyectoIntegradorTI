from models.userModel import User
from extensions import db
from utils.jwt_handler import generate_token
from werkzeug.security import generate_password_hash, check_password_hash

def login(data):
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()
    if not user:
        return {"error": "Usuario no encontrado"}, 404
    if not check_password_hash(user.password, password):
        return {"error": "Credenciales incorrectas"}, 401
    token = generate_token(user)
    return {"token": token}, 200

def register(data):
    email = data.get("email")
    password = data.get("password")
    role_id = data.get("role_id")
    
    if not email or not password or not role_id:
        return {"error": "Email, password y role_id son obligatorios"}, 400

    if User.query.filter_by(email=email).first():
        return {"error": "El usuario ya existe"}, 400
    

    hashed_password = generate_password_hash(password)

    new_user = User(
        email=email,
        password=hashed_password,
        role_id=role_id
    )

    db.session.add(new_user)
    db.session.commit()

    return {"message": "Usuario creado exitosamente"}, 201
