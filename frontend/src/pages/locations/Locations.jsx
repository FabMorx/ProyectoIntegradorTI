import "../../styles/locations/locations.css";
import "../../styles/toast.css";
import "../../styles/loading.css";

import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Locations() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // TOAST
  // =========================
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3000);
  };

  const [formData, setFormData] = useState({
    name: "",
    building: "",
    floor: "",
    description: "",
  });

  // =========================
  // LOAD DATA
  // =========================
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/locations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error loading locations:", err);
      showToast("Error cargando ubicaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
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
  const handleView = (location) => {
    setSelectedLocation(location);
    setShowViewModal(true);
  };

  // =========================
  // EDITAR
  // =========================
  const handleEdit = (location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      building: location.building,
      floor: location.floor,
      description: location.description,
    });
    setShowLocationModal(true);
  };

  // =========================
  // CONFIRMAR BORRAR
  // =========================
  const handleDeleteConfirm = (location) => {
    setSelectedLocation(location);
    setShowDeleteModal(true);
  };

  // =========================
  // BORRAR
  // =========================
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/locations/${selectedLocation.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || "Error eliminando ubicación", "error");
        return;
      }

      await loadData();
      setShowDeleteModal(false);
      setSelectedLocation(null);
      showToast("Ubicación eliminada correctamente", "success");
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  // =========================
  // CREAR O EDITAR LOCATION
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEdit = selectedLocation !== null;
    const url = isEdit
      ? `${API_URL}/locations/${selectedLocation.id}`
      : `${API_URL}/locations/`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error guardando ubicación", "error");
        return;
      }

      await loadData();
      setShowLocationModal(false);
      setSelectedLocation(null);
      setFormData({ name: "", building: "", floor: "", description: "" });
      showToast(
        isEdit ? "Ubicación actualizada correctamente" : "Ubicación creada correctamente",
        "success",
      );
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  return (
    <div className="locations-container">
      {toast.visible && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {/* HEADER */}
      <section className="locations-header">
        <div>
          <h1>Locations Management</h1>
          <p>Administración de sedes y ubicaciones del sistema hospitalario.</p>
        </div>
        <button
          className="locations-btn"
          onClick={() => {
            setSelectedLocation(null);
            setFormData({ name: "", building: "", floor: "", description: "" });
            setShowLocationModal(true);
          }}
        >
          <FaPlus /> Agregar Ubicación
        </button>
      </section>

      {/* STATS */}
      <section className="locations-stats">
        <div className="locations-stat-card">
          <div className="locations-stat-icon"><FaMapMarkerAlt /></div>
          <div>
            <h2>{locations.length}</h2>
            <p>Total Ubicaciones</p>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="locations-table-panel">
        <div className="locations-table-header">
          <h3>Lista de Ubicaciones</h3>
        </div>

        {loading ? (
          <div className="loading-state">
            <span>Cargando ubicaciones</span>
            <span className="dots"><i></i><i></i><i></i></span>
          </div>
        ) : (
          <div className="locations-table">
            <div className="locations-table-row locations-table-head">
              <span>Nombre</span>
              <span>Edificio</span>
              <span>Piso</span>
              <span>Descripción</span>
              <span>Acciones</span>
            </div>

            {locations.map((location) => (
              <div className="locations-table-row" key={location.id}>
                <span>{location.name}</span>
                <span>{location.building}</span>
                <span>{location.floor}</span>
                <span>{location.description}</span>
                <div className="locations-table-actions">
                  {/* VER */}
                  <button onClick={() => handleView(location)}>
                    <FaEye />
                  </button>
                  {/* EDITAR */}
                  <button onClick={() => handleEdit(location)}>
                    <FaEdit />
                  </button>
                  {/* BORRAR */}
                  <button
                    className="locations-delete-btn"
                    onClick={() => handleDeleteConfirm(location)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL VER DETALLES */}
      {showViewModal && selectedLocation && (
        <div className="locations-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="locations-modal" onClick={(e) => e.stopPropagation()}>
            <div className="locations-modal-header">
              <div>
                <h2>Detalles de la Ubicación</h2>
                <p className="locations-modal-subtitle">Información completa de la ubicación.</p>
              </div>
              <button className="locations-modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="dv-view-body">
              <div className="dv-view-row">
                <span className="dv-view-label">Nombre</span>
                <span>{selectedLocation.name}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Edificio</span>
                <span>{selectedLocation.building}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Piso</span>
                <span>{selectedLocation.floor}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Descripción</span>
                <span>{selectedLocation.description}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR BORRAR */}
      {showDeleteModal && selectedLocation && (
        <div className="locations-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="locations-modal dv-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="locations-modal-header">
              <div>
                <h2>Eliminar Ubicación</h2>
                <p className="locations-modal-subtitle">Esta acción no se puede deshacer.</p>
              </div>
              <button className="locations-modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>

            <div className="dv-delete-body">
              <p>
                ¿Estás seguro que deseas eliminar{" "}
                <strong>{selectedLocation.name}</strong>?
              </p>
            </div>

            <div className="locations-modal-actions">
              <button
                type="button"
                className="locations-cancel-btn"
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
      {showLocationModal && (
        <div className="locations-modal-overlay">
          <div className="locations-modal">
            <div className="locations-modal-header">
              <div>
                <h2>{selectedLocation ? "Editar Ubicación" : "Agregar Nueva Ubicación"}</h2>
                <p className="locations-modal-subtitle">
                  {selectedLocation
                    ? "Modifique los datos de la ubicación."
                    : "Registre una nueva sede o ubicación."}
                </p>
              </div>
              <button
                className="locations-modal-close"
                onClick={() => {
                  setShowLocationModal(false);
                  setSelectedLocation(null);
                }}
              >
                ×
              </button>
            </div>

            <form className="locations-form" onSubmit={handleSubmit}>
              <div className="locations-form-group">
                <label>Nombre</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="locations-form-group">
                <label>Edificio</label>
                <input name="building" value={formData.building} onChange={handleChange} required />
              </div>
              <div className="locations-form-group">
                <label>Piso</label>
                <input name="floor" value={formData.floor} onChange={handleChange} required />
              </div>
              <div className="locations-form-group">
                <label>Descripción</label>
                <input name="description" value={formData.description} onChange={handleChange} required />
              </div>

              <div className="locations-modal-actions">
                <button
                  type="button"
                  className="locations-cancel-btn"
                  onClick={() => {
                    setShowLocationModal(false);
                    setSelectedLocation(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="locations-save-btn">
                  {selectedLocation ? "Guardar Cambios" : "Guardar Ubicación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Locations;