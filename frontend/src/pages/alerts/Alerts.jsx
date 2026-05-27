import { useEffect, useState } from "react";

import "../../styles/alerts/alerts.css";
import "../../styles/toast.css";
import "../../styles/loading.css";

import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function Alerts() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3000);
  };

  const [formData, setFormData] = useState({
    device_id: "",
    metric_id: "",
    severity_id: "",
    message: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [alertsRes, devicesRes, severityRes, metricsRes] = await Promise.all([
        fetch(`${API_URL}/alerts/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/devices/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/alerts/severities`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/metrics/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [alertsData, devicesData, severityData, metricsData] = await Promise.all([
        alertsRes.json(),
        devicesRes.json(),
        severityRes.json(),
        metricsRes.json(),
      ]);

      setAlerts(Array.isArray(alertsData) ? alertsData : []);
      setDevices(Array.isArray(devicesData) ? devicesData : []);
      setSeverities(Array.isArray(severityData) ? severityData : []);
      setMetrics(Array.isArray(metricsData) ? metricsData : []);
    } catch (err) {
      console.log(err);
      showToast("Error cargando alertas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredMetrics = metrics.filter(
    (m) => m.device_id === Number(formData.device_id),
  );

  // VER
  const handleView = (alert) => {
    setSelectedAlert(alert);
    setShowViewModal(true);
  };

  // EDITAR
  const handleEdit = (alert) => {
    setSelectedAlert(alert);
    setFormData({
      device_id: alert.device_id,
      metric_id: alert.metric_id || "",
      severity_id: alert.severity_id,
      message: alert.message,
    });
    setShowModal(true);
  };

  // CONFIRMAR BORRAR
  const handleDeleteConfirm = (alert) => {
    setSelectedAlert(alert);
    setShowDeleteModal(true);
  };

  // BORRAR
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/alerts/${selectedAlert.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || "Error eliminando alerta", "error");
        return;
      }

      await loadData();
      setShowDeleteModal(false);
      setSelectedAlert(null);
      showToast("Alerta eliminada correctamente", "success");
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  // CREAR O EDITAR
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      device_id: Number(formData.device_id),
      metric_id: formData.metric_id ? Number(formData.metric_id) : null,
      severity_id: Number(formData.severity_id),
      message: formData.message,
    };

    const isEdit = selectedAlert !== null;
    const url = isEdit
      ? `${API_URL}/alerts/${selectedAlert.id}`
      : `${API_URL}/alerts/`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error guardando alerta", "error");
        return;
      }

      await loadData();
      setShowModal(false);
      setSelectedAlert(null);
      setFormData({ device_id: "", metric_id: "", severity_id: "", message: "" });
      showToast(
        isEdit ? "Alerta actualizada correctamente" : "Alerta creada correctamente",
        "success",
      );
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  // RESOLVER
  const handleResolve = async (id) => {
    try {
      const res = await fetch(`${API_URL}/alerts/${id}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Error resolviendo alerta", "error");
        return;
      }

      await loadData();
      showToast("Alerta resuelta", "success");
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  const getSeverityClass = (severityName) => {
    switch (severityName) {
      case "CRITICAL": return "critical";
      case "WARNING":  return "warning";
      case "INFO":     return "info";
      default:         return "";
    }
  };

  return (
    <div className="alerts-container">
      {toast.visible && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {/* HEADER */}
      <section className="alerts-header">
        <div>
          <h1>Monitoreo de Alertas </h1>
          <p>Monitoreo y administración de alertas del sistema.</p>
        </div>
        <div className="alerts-header-buttons">
          <button
            className="alerts-btn"
            onClick={() => {
              setSelectedAlert(null);
              setFormData({ device_id: "", metric_id: "", severity_id: "", message: "" });
              setShowModal(true);
            }}
          >
            <FaPlus />
            Crear Alerta
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="alerts-stats">
        <div className="alert-stat-card">
          <div className="alert-stat-icon"><FaBell /></div>
          <div>
            <h2>{alerts.length}</h2>
            <p>Total de Alertas</p>
          </div>
        </div>
        <div className="alert-stat-card">
          <div className="alert-stat-icon critical"><FaTimesCircle /></div>
          <div>
            <h2>{alerts.filter((a) => !a.is_resolved).length}</h2>
            <p>No resueltas</p>
          </div>
        </div>
        <div className="alert-stat-card">
          <div className="alert-stat-icon warning"><FaExclamationTriangle /></div>
          <div>
            <h2>{alerts.filter((a) => a.severity?.name === "WARNING").length}</h2>
            <p>Advertencia</p>
          </div>
        </div>
        <div className="alert-stat-card">
          <div className="alert-stat-icon resolved"><FaCheckCircle /></div>
          <div>
            <h2>{alerts.filter((a) => a.is_resolved).length}</h2>
            <p>Resuelto</p>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="alerts-table-panel">
        <div className="table-header">
          <h3>Lista de Alertas</h3>
        </div>

        {loading ? (
          <div className="loading-state">
            <span>Cargando alertas</span>
            <span className="dots"><i></i><i></i><i></i></span>
          </div>
        ) : (
          <div className="alerts-table">
            <div className="table-row table-head">
              <span>Dispositivo</span>
              <span>Severidad</span>
              <span>Mensaje</span>
              <span>Status</span>
              <span>Creado</span>
              <span>Resuelto</span>
              <span>Acciones</span>
            </div>
            {alerts.map((alert) => (
              <div className="table-row" key={alert.id}>
                <span>
                  {devices.find((d) => d.id === alert.device_id)?.name || alert.device_id}
                </span>
                <span className={`alert-badge ${getSeverityClass(alert.severity?.name)}`}>
                  {alert.severity?.name}
                </span>
                <span>{alert.message}</span>
                <span className={`alert-status ${alert.is_resolved ? "resolved" : "pending"}`}>
                  {alert.is_resolved ? "Resolved" : "Pending"}
                </span>
                <span>{new Date(alert.created_at).toLocaleString()}</span>
                <span>
                  {alert.resolved_at ? new Date(alert.resolved_at).toLocaleString() : "-"}
                </span>
                <div className="table-actions">
                  {/* VER */}
                  <button onClick={() => handleView(alert)}>
                    <FaEye />
                  </button>
                  {/* RESOLVER */}
                  {!alert.is_resolved && (
                    <button onClick={() => handleResolve(alert.id)} style={{ color: "green" }}>
                      <FaCheckCircle />
                    </button>
                  )}
                  <button onClick={() => handleEdit(alert)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteConfirm(alert)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {showViewModal && selectedAlert && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Detalles de la Alerta</h2>
                <p className="modal-subtitle">Información completa de la alerta.</p>
              </div>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="dv-view-body">
              <div className="dv-view-row">
                <span className="dv-view-label">Dispositivo</span>
                <span>{devices.find((d) => d.id === selectedAlert.device_id)?.name || "-"}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Severidad</span>
                <span className={`alert-badge ${getSeverityClass(selectedAlert.severity?.name)}`}>
                  {selectedAlert.severity?.name || "-"}
                </span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Mensaje</span>
                <span>{selectedAlert.message}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Estado</span>
                <span className={`alert-status ${selectedAlert.is_resolved ? "resolved" : "pending"}`}>
                  {selectedAlert.is_resolved ? "Resolved" : "Pending"}
                </span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Creada</span>
                <span>{new Date(selectedAlert.created_at).toLocaleString()}</span>
              </div>
              <div className="dv-view-row">
                <span className="dv-view-label">Resuelta</span>
                <span>
                  {selectedAlert.resolved_at
                    ? new Date(selectedAlert.resolved_at).toLocaleString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && selectedAlert && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="alert-modal dv-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Eliminar Alerta</h2>
                <p className="modal-subtitle">Esta acción no se puede deshacer.</p>
              </div>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>

            <div className="dv-delete-body">
              <p>
                ¿Estás seguro que deseas eliminar la alerta de{" "}
                <strong>{devices.find((d) => d.id === selectedAlert.device_id)?.name || selectedAlert.device_id}</strong>?
              </p>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button type="button" className="dv-delete-confirm-btn" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="alert-modal">
            <div className="modal-header">
              <div>
                <h2>{selectedAlert ? "Editar Alerta" : "Crear Alerta"}</h2>
                <p className="modal-subtitle">
                  Registre una alerta asociada a un dispositivo.
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setSelectedAlert(null);
                }}
              >
                ×
              </button>
            </div>

            <form className="alert-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Dispositivo</label>
                <select
                  name="device_id"
                  value={formData.device_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione dispositivo</option>
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Métrica</label>
                <select name="metric_id" value={formData.metric_id} onChange={handleChange}>
                  <option value="">Seleccione métrica</option>
                  {filteredMetrics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.metric_type?.name} - {m.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Severidad</label>
                <select
                  name="severity_id"
                  value={formData.severity_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione severidad</option>
                  {severities.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Mensaje</label>
                <input
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAlert(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  {selectedAlert ? "Guardar Cambios" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;