import "../../styles/devices/devices.css";
import "../../styles/toast.css";
import "../../styles/loading.css";

import { useState, useEffect } from "react";

import {
  FaDesktop,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaNetworkWired,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function Devices() {
  // STATES
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [selectedDevice, setSelectedDevice] = useState(null); 

  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // TOAST
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3000);
  };

  // DEVICE FORM
  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    mac_address: "",
    location_id: "",
    status: "ACTIVE",
    device_type_id: "",
  });

  // DEVICE TYPE FORM
  const [typeForm, setTypeForm] = useState({ name: "", description: "" });

  // LOAD DATA 
  const loadData = async () => {
    setLoading(true);
    try {
      const [devicesRes, locationsRes, typesRes] = await Promise.all([
        fetch(`${API_URL}/devices/`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }),
        fetch(`${API_URL}/locations/`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }),
        fetch(`${API_URL}/devices/types`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }),
      ]);

      const [devicesData, locationsData, typesData] = await Promise.all([
        devicesRes.json(),
        locationsRes.json(),
        typesRes.json(),
      ]);

      setDevices(Array.isArray(devicesData) ? devicesData : []);
      setLocations(Array.isArray(locationsData) ? locationsData : []);
      setDeviceTypes(Array.isArray(typesData) ? typesData : []);
    } catch (err) {
      console.log(err);
      showToast("Error cargando datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // INPUTS
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTypeChange = (e) =>
    setTypeForm({ ...typeForm, [e.target.name]: e.target.value });

  // ✅ ABRIR MODAL VER
  const handleView = (device) => {
    setSelectedDevice(device);
    setShowViewModal(true);
  };

  
  const handleEdit = (device) => {
    setSelectedDevice(device);
    setFormData({
      name: device.name,
      ip_address: device.ip_address,
      mac_address: device.mac_address,
      location_id: device.location_id,
      status: device.status,
      device_type_id: device.device_type_id,
    });
    setShowModal(true);
  };

  const handleDeleteConfirm = (device) => {
    setSelectedDevice(device);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/devices/${selectedDevice.id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || "Error eliminando dispositivo", "error");
        return;
      }

      await loadData();
      setShowDeleteModal(false);
      setSelectedDevice(null);
      showToast("Dispositivo eliminado correctamente", "success");
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  // CREATE DEVICE TYPE
  const handleCreateType = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/devices/types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(typeForm),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Error creando tipo", "error");
        return;
      }
      await loadData();
      setShowTypeModal(false);
      setTypeForm({ name: "", description: "" });
      showToast("Tipo de dispositivo creado correctamente", "success");
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  // ✅ CREATE O EDIT DEVICE (detecta si es edición por selectedDevice)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      device_type_id: Number(formData.device_type_id),
      location_id: Number(formData.location_id),
    };

    const isEdit = selectedDevice !== null;
    const url = isEdit
      ? `${API_URL}/devices/${selectedDevice.id}`
      : `${API_URL}/devices/`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Error guardando dispositivo", "error");
        return;
      }
      await loadData();
      setShowModal(false);
      setSelectedDevice(null);
      setFormData({
        name: "",
        ip_address: "",
        mac_address: "",
        location_id: "",
        status: "ACTIVE",
        device_type_id: "",
      });
      showToast(
        isEdit
          ? "Dispositivo actualizado correctamente"
          : "Dispositivo creado correctamente",
        "success",
      );
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  return (
    <div className="dv-container">
      {toast.visible && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {/* HEADER */}
      <section className="dv-header">
        <div>
          <h1>Monitoreo De Dispositivos</h1>
          <p>Administración y monitoreo de dispositivos conectados.</p>
        </div>
        <div className="dv-header-buttons">
          <button
            className="dv-btn secondary"
            onClick={() => setShowTypeModal(true)}
          >
            <FaPlus /> Crear Tipo
          </button>
          <button
            className="dv-btn"
            onClick={() => {
              setSelectedDevice(null);
              setFormData({
                name: "",
                ip_address: "",
                mac_address: "",
                location_id: "",
                status: "ACTIVE",
                device_type_id: "",
              });
              setShowModal(true);
            }}
          >
            <FaPlus /> Crear Dispositivo
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="dv-stats">
        <div className="dv-stat-card">
          <div className="dv-stat-icon">
            <FaDesktop />
          </div>
          <div>
            <h2>{devices.length}</h2>
            <p>Total De Dispositivos</p>
          </div>
        </div>
        <div className="dv-stat-card">
          <div className="dv-stat-icon">
            <FaNetworkWired />
          </div>
          <div>
            <h2>{deviceTypes.length}</h2>
            <p>Dispositivos por Tipo</p>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="dv-table-panel">
        <div className="dv-table-header">
          <h3>Lista de Dispositivos</h3>
        </div>

        {loading ? (
          <div className="loading-state">
            <span>Cargando dispositivos</span>
            <span className="dots">
              <i></i>
              <i></i>
              <i></i>
            </span>
          </div>
        ) : (
          <div className="dv-table-scroll">
            <div className="dv-table">
              <div className="dv-row dv-row-head">
                <div className="dv-cell">Nombre</div>
                <div className="dv-cell">IP</div>
                <div className="dv-cell">MAC</div>
                <div className="dv-cell">Tipo</div>
                <div className="dv-cell">Ubicación</div>
                <div className="dv-cell">Estado</div>
                <div className="dv-cell">Acciones</div>
              </div>

              {devices.map((d) => (
                <div className="dv-row" key={d.id}>
                  <div className="dv-cell">{d.name}</div>
                  <div className="dv-cell">{d.ip_address}</div>
                  <div className="dv-cell">{d.mac_address}</div>
                  <div className="dv-cell">
                    {deviceTypes.find((t) => t.id === d.device_type_id)?.name ||
                      d.device_type_id}
                  </div>
                  <div className="dv-cell">
                    {locations.find((l) => l.id === d.location_id)?.name ||
                      d.location_id}
                  </div>
                  <div className="dv-cell">
                    <span className={`dv-status ${d.status}`}>{d.status}</span>
                  </div>
                  <div className="dv-cell">
                    <div className="dv-actions">
                      <button onClick={() => handleView(d)}>
                        <FaEye />
                      </button>
                      <button onClick={() => handleEdit(d)}>
                        <FaEdit />
                      </button>
                      <button
                        className="dv-delete-btn"
                        onClick={() => handleDeleteConfirm(d)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      {showViewModal && selectedDevice && (
        <div
          className="dv-modal-overlay"
          onClick={() => setShowViewModal(false)}
        >
          <div className="dv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dv-modal-header">
              <div>
                <h2>Detalles del Dispositivo</h2>
                <p className="dv-modal-subtitle">
                  Información completa del dispositivo.
                </p>
              </div>
              <button
                className="dv-modal-close"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>

            <div className="dv-view-body">
              <div className="dv-view-row">
                <span className="dv-view-label">Nombre</span>
                <span>{selectedDevice.name}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">IP</span>
                <span>{selectedDevice.ip_address}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">MAC</span>
                <span>{selectedDevice.mac_address}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Tipo</span>
                <span>
                  {deviceTypes.find(
                    (t) => t.id === selectedDevice.device_type_id,
                  )?.name || "-"}
                </span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Ubicación</span>
                <span>
                  {locations.find((l) => l.id === selectedDevice.location_id)
                    ?.name || "-"}
                </span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Estado</span>
                <span className={`dv-status ${selectedDevice.status}`}>
                  {selectedDevice.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && selectedDevice && (
        <div
          className="dv-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="dv-modal dv-modal-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dv-modal-header">
              <div>
                <h2>Eliminar Dispositivo</h2>
                <p className="dv-modal-subtitle">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <button
                className="dv-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <div className="dv-delete-body">
              <p>
                ¿Estás seguro que deseas eliminar{" "}
                <strong>{selectedDevice.name}</strong>?
              </p>
            </div>

            <div className="dv-modal-actions">
              <button
                type="button"
                className="dv-cancel-btn"
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

      {showModal && (
        <div className="dv-modal-overlay">
          <div className="dv-modal">
            <div className="dv-modal-header">
              <div>
                <h2>
                  {selectedDevice ? "Editar Dispositivo" : "Crear Dispositivo"}
                </h2>
                <p className="dv-modal-subtitle">
                  Registre un equipo físico o virtual conectado a la red.
                </p>
              </div>
              <button
                className="dv-modal-close"
                onClick={() => {
                  setShowModal(false);
                  setSelectedDevice(null);
                }}
              >
                ×
              </button>
            </div>

            <form className="dv-form" onSubmit={handleSubmit}>
              <div className="dv-form-group">
                <label>Nombre del dispositivo</label>
                <input
                  name="name"
                  placeholder="Ej: Router Piso 1"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="dv-form-group">
                <label>Dirección IP</label>
                <input
                  name="ip_address"
                  placeholder="Ej: 192.168.1.10"
                  value={formData.ip_address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="dv-form-group">
                <label>Dirección MAC</label>
                <input
                  name="mac_address"
                  placeholder="Ej: AA:BB:CC:DD:EE:FF"
                  value={formData.mac_address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="dv-form-group">
                <label>Ubicación</label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione ubicación</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dv-form-group">
                <label>Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="MAINTENANCE">Mantenimiento</option>
                </select>
              </div>
              <div className="dv-form-group">
                <label>Tipo de dispositivo</label>
                <select
                  name="device_type_id"
                  value={formData.device_type_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione tipo</option>
                  {deviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dv-modal-actions">
                <button
                  type="button"
                  className="dv-cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDevice(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="dv-save-btn">
                  {selectedDevice ? "Guardar Cambios" : "Guardar Dispositivo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTypeModal && (
        <div className="dv-modal-overlay">
          <div className="dv-modal">
            <div className="dv-modal-header">
              <div>
                <h2>Crear Tipo De Dispositivo</h2>
                <p className="dv-modal-subtitle">
                  Cree categorías reutilizables para organizar dispositivos.
                </p>
              </div>
              <button
                className="dv-modal-close"
                onClick={() => setShowTypeModal(false)}
              >
                ×
              </button>
            </div>
            <form className="dv-form" onSubmit={handleCreateType}>
              <div className="dv-form-group">
                <label>Nombre del tipo</label>
                <input
                  name="name"
                  placeholder="Ej: Router"
                  value={typeForm.name}
                  onChange={handleTypeChange}
                  required
                />
              </div>
              <div className="dv-form-group">
                <label>Descripción</label>
                <input
                  name="description"
                  placeholder="Ej: Dispositivo encargado de enrutar tráfico"
                  value={typeForm.description}
                  onChange={handleTypeChange}
                  required
                />
              </div>
              <div className="dv-modal-actions">
                <button
                  type="button"
                  className="dv-cancel-btn"
                  onClick={() => setShowTypeModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="dv-save-btn">
                  Guardar Tipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Devices;
