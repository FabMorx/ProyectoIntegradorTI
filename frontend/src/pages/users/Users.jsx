import { useEffect, useState } from "react";
import "../../styles/users/users.css";
import "../../styles/toast.css";
import "../../styles/loading.css";

import {
  FaUsers,
  FaUserShield,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function Users() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role_id: 1,
  });

  const token = localStorage.getItem("token");

  // =========================
  // TOAST
  // =========================
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3000);
  };

  // =========================
  // LOAD USERS
  // =========================
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error cargando usuarios");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      showToast("Error cargando usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =========================
  // VER
  // =========================
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // =========================
  // EDITAR
  // =========================
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "",
      role_id: user.role_id,
    });
    setShowModal(true);
  };

  // =========================
  // CONFIRMAR BORRAR
  // =========================
  const handleDeleteConfirm = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // =========================
  // BORRAR
  // =========================
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || "Error eliminando usuario", "error");
        return;
      }

      await loadData();
      setShowDeleteModal(false);
      setSelectedUser(null);
      showToast("Usuario eliminado correctamente", "success");
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  // =========================
  // CREAR O EDITAR USUARIO
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEdit = selectedUser !== null;

    try {
      let res;

      if (isEdit) {
        // Edición: PUT /users/:id (no manda password si está vacío)
        const payload = {
          email: formData.email,
          role_id: Number(formData.role_id),
        };
        if (formData.password) payload.password = formData.password;

        res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Creación: POST /auth/register
        res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role_id: Number(formData.role_id),
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error guardando usuario", "error");
        return;
      }

      await loadData();
      setShowModal(false);
      setSelectedUser(null);
      setFormData({ email: "", password: "", role_id: 1 });
      showToast(
        isEdit ? "Usuario actualizado correctamente" : "Usuario creado correctamente",
        "success",
      );
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  // =========================
  // ROLE LABEL
  // =========================
  const getRoleName = (id) => {
    switch (Number(id)) {
      case 1: return "Super Admin";
      case 2: return "Admin TI";
      case 3: return "Técnico TI";
      case 4: return "Monitor";
      case 5: return "Auditor";
      default: return "Unknown";
    }
  };

  return (
    <div className="users-page-container">
      {toast.visible && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {/* HEADER */}
      <section className="users-page-header">
        <div>
          <h1>Users Management</h1>
          <p>Administración de usuarios y permisos del sistema.</p>
        </div>
        <button
          className="users-page-btn"
          onClick={() => {
            setSelectedUser(null);
            setFormData({ email: "", password: "", role_id: 1 });
            setShowModal(true);
          }}
        >
          <FaPlus /> Add User
        </button>
      </section>

      {/* STATS */}
      <section className="users-page-stats">
        <div className="users-page-stat-card">
          <div className="users-page-stat-icon"><FaUsers /></div>
          <div>
            <h2>{users.length}</h2>
            <p>Total Users</p>
          </div>
        </div>
        <div className="users-page-stat-card">
          <div className="users-page-stat-icon admin"><FaUserShield /></div>
          <div>
            <h2>Roles Activos</h2>
            <p>SuperAdmin / Admin / Técnico / Monitor / Auditor</p>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="users-page-table-panel">
        <div className="users-page-table-header">
          <h3>Users List</h3>
        </div>

        <div className="users-page-table">
          <div className="users-page-row users-page-head">
            <span>ID</span>
            <span>Email</span>
            <span>Role</span>
            <span>Created At</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="loading-state">
              <span>Cargando usuarios</span>
              <span className="dots"><i></i><i></i><i></i></span>
            </div>
          ) : (
            users.map((user) => (
              <div className="users-page-row" key={user.id}>
                <span>{user.id}</span>
                <span>{user.email}</span>
                <span>{getRoleName(user.role_id)}</span>
                <span>{user.created_at}</span>
                <div className="users-page-actions">
                  {/* VER */}
                  <button onClick={() => handleView(user)}>
                    <FaEye />
                  </button>
                  {/* EDITAR */}
                  <button onClick={() => handleEdit(user)}>
                    <FaEdit />
                  </button>
                  {/* BORRAR */}
                  <button
                    className="users-page-delete-btn"
                    onClick={() => handleDeleteConfirm(user)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODAL VER DETALLES */}
      {showViewModal && selectedUser && (
        <div className="users-page-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="users-page-modal" onClick={(e) => e.stopPropagation()}>
            <div className="users-page-modal-header">
              <div>
                <h2>Detalles del Usuario</h2>
                <p className="users-page-modal-subtitle">Información completa del usuario.</p>
              </div>
              <button className="users-page-modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="dv-view-body">
              <div className="dv-view-row">
                <span className="dv-view-label">ID</span>
                <span>{selectedUser.id}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Email</span>
                <span>{selectedUser.email}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Rol</span>
                <span>{getRoleName(selectedUser.role_id)}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Creado</span>
                <span>{selectedUser.created_at}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR BORRAR */}
      {showDeleteModal && selectedUser && (
        <div className="users-page-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="users-page-modal dv-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="users-page-modal-header">
              <div>
                <h2>Eliminar Usuario</h2>
                <p className="users-page-modal-subtitle">Esta acción no se puede deshacer.</p>
              </div>
              <button className="users-page-modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>

            <div className="dv-delete-body">
              <p>
                ¿Estás seguro que deseas eliminar a{" "}
                <strong>{selectedUser.email}</strong>?
              </p>
            </div>

            <div className="users-page-modal-actions">
              <button
                type="button"
                className="users-page-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="dv-delete-confirm-btn"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      {showModal && (
        <div className="users-page-modal-overlay">
          <div className="users-page-modal">
            <div className="users-page-modal-header">
              <div>
                <h2>{selectedUser ? "Editar Usuario" : "Add New User"}</h2>
                <p className="users-page-modal-subtitle">
                  {selectedUser
                    ? "Modifique los datos del usuario."
                    : "Registre un nuevo usuario en el sistema."}
                </p>
              </div>
              <button
                className="users-page-modal-close"
                onClick={() => {
                  setShowModal(false);
                  setSelectedUser(null);
                }}
              >
                ×
              </button>
            </div>

            <form className="users-page-form" onSubmit={handleSubmit}>
              <div className="users-page-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@hospital.com"
                  required
                />
              </div>

              <div className="users-page-form-group">
                <label>
                  Password{selectedUser && <span style={{ fontWeight: 400, fontSize: "0.8rem", color: "#94a3b8" }}> (dejar vacío para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  required={!selectedUser}
                />
              </div>

              <div className="users-page-form-group">
                <label>Role</label>
                <select name="role_id" value={formData.role_id} onChange={handleChange}>
                  <option value={1}>Super Admin</option>
                  <option value={2}>Admin TI</option>
                  <option value={3}>Técnico TI</option>
                  <option value={4}>Monitor</option>
                  <option value={5}>Auditor</option>
                </select>
              </div>

              <div className="users-page-modal-actions">
                <button
                  type="button"
                  className="users-page-cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="users-page-save-btn">
                  {selectedUser ? "Guardar Cambios" : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;