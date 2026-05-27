from models.usersModel import User, Role
from extensions import db

def get_all_users():
    users = User.query.order_by(User.id.asc()).all()
    return [serialize_user(user) for user in users], 200

def get_all_roles():
    roles = Role.query.order_by(Role.id.asc()).all()
    return [{"id": role.id, "name": role.name} for role in roles], 200

def get_user_by_id(user_id, requester_id, requester_role):
    if requester_role != 1 and requester_id != user_id:
        return {"error": "Access denied"}, 403
    
    user = User.query.get(user_id)
    if  not user:
        return {"error": "User not found"}, 404
    return serialize_user(user), 200

def update_user(user_id, data, requester_id, requester_role):
    if requester_role != 1 and requester_id != user_id:
        return {"error": "Access denied"}, 403
    
    # Solo superadmin puede cambiar roles
    if requester_role != 1 and data.get('role_id'):
        return {"error": "You cannot change your own role"}, 403

    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404
    
    if not data.get('email') or not data.get('role_id'):
     return {"error": "Email and role are required"}, 400
    
    existing_user = User.query.filter(
        User.email == data['email'],
        User.id != user_id
    ).first()
    if existing_user:
        return {"error": "Email already in use"}, 400
    
    user.email = data['email']
    user.password = data['password']
    user.role_id = data['role_id']
    db.session.commit()
    return {
        "message": "User updated successfully",
        "user": serialize_user(user)
    }, 200
    
def delete_user(user_id, requester_id, requester_role):
    if requester_role != 1:
        return {"error": "Access denied"}, 403

    user = User.query.get(user_id)
    
    if not user:
        return {"error": "User not found"}, 404
    
    db.session.delete(user)
    db.session.commit()
    return {"message": "User deleted successfully"}, 200


def serialize_user(user):
    return {
        "id": user.id,
        "email": user.email,
        "role_id": user.role_id,
        "created_at": user.created_at
    }
