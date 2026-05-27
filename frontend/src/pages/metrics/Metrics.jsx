import "../../styles/metrics/metrics.css";
import "../../styles/toast.css";
import "../../styles/loading.css";

import { useState, useEffect } from "react";

import {
  FaMicrochip,
  FaMemory,
  FaThermometerHalf,
  FaServer,
  FaChartLine,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

function Metrics() {
  // =====================
  // STATES
  // =====================
  const [showModal, setShowModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const [metrics, setMetrics] = useState([]);
  const [devices, setDevices] = useState([]);
  const [metricTypes, setMetricTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type: "", visible: false }), 3000);
  };

  const [formData, setFormData] = useState({
    device_id: "",
    metric_type_id: "",
    value: "",
  });

  const [typeForm, setTypeForm] = useState({
    name: "",
    unit: "",
    description: "",
    warning_threshold: "",
    critical_threshold: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsRes, devicesRes, typesRes] = await Promise.all([
        fetch(`${API_URL}/metrics/`, { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
        fetch(`${API_URL}/devices/`, { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
        fetch(`${API_URL}/metrics/types`, { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
      ]);

      const [metricsData, devicesData, typesData] = await Promise.all([
        metricsRes.json(),
        devicesRes.json(),
        typesRes.json(),
      ]);

      setMetrics(Array.isArray(metricsData) ? metricsData : []);
      setDevices(Array.isArray(devicesData) ? devicesData : []);
      setMetricTypes(Array.isArray(typesData) ? typesData : []);
    } catch (err) {
      console.log(err);
      showToast("Error cargando métricas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================
  // HANDLE INPUT
  // =====================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setTypeForm({ ...typeForm, [e.target.name]: e.target.value });
  };

  // =====================
  // VER
  // =====================
  const handleView = (metric) => {
    setSelectedMetric(metric);
    setShowViewModal(true);
  };

  // =====================
  // EDITAR
  // =====================
  const handleEdit = (metric) => {
    setSelectedMetric(metric);
    setFormData({
      device_id: metric.device_id,
      metric_type_id: metric.metric_type_id,
      value: metric.value,
    });
    setShowModal(true);
  };

  // =====================
  // CONFIRMAR BORRAR
  // =====================
  const handleDeleteConfirm = (metric) => {
    setSelectedMetric(metric);
    setShowDeleteModal(true);
  };

  // =====================
  // BORRAR
  // =====================
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/metrics/${selectedMetric.id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || "Error eliminando métrica", "error");
        return;
      }

      await loadData();
      setShowDeleteModal(false);
      setSelectedMetric(null);
      showToast("Métrica eliminada correctamente", "success");
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      device_id: Number(formData.device_id),
      metric_type_id: Number(formData.metric_type_id),
      value: Number(formData.value),
    };

    const isEdit = selectedMetric !== null;
    const url = isEdit
      ? `${API_URL}/metrics/${selectedMetric.id}`
      : `${API_URL}/metrics/`;
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
        showToast(data.error || "Error guardando métrica", "error");
        return;
      }
      await loadData();
      setShowModal(false);
      setSelectedMetric(null);
      setFormData({ device_id: "", metric_type_id: "", value: "" });
      showToast(
        isEdit ? "Métrica actualizada correctamente" : "Métrica creada correctamente",
        "success",
      );
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  const handleCreateType = async (e) => {
    e.preventDefault();
    const payload = {
      ...typeForm,
      warning_threshold: typeForm.warning_threshold ? Number(typeForm.warning_threshold) : null,
      critical_threshold: typeForm.critical_threshold ? Number(typeForm.critical_threshold) : null,
    };
    try {
      const res = await fetch(`${API_URL}/metrics/types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Error creando tipo", "error");
        return;
      }
      await loadData();
      setShowTypeModal(false);
      setTypeForm({ name: "", unit: "", description: "", warning_threshold: "", critical_threshold: "" });
      showToast("Tipo de métrica creado correctamente", "success");
    } catch (err) {
      console.log(err);
      showToast("Error del servidor", "error");
    }
  };

  // =====================
  // HELPERS
  // =====================
  const getMetricStatus = (value, type) => {
    if (!type) return "normal";
    if (type.critical_threshold !== null && value >= type.critical_threshold) return "critical";
    if (type.warning_threshold !== null && value >= type.warning_threshold) return "warning";
    return "normal";
  };

  const COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6"];

  const areaData = metricTypes.map((type) => {
    const typeMetrics = metrics.filter((m) => m.metric_type_id === type.id);
    return {
      name: type.name,
      Normal: typeMetrics.filter((m) => getMetricStatus(m.value, type) === "normal").length,
      Warning: typeMetrics.filter((m) => getMetricStatus(m.value, type) === "warning").length,
      Critical: typeMetrics.filter((m) => getMetricStatus(m.value, type) === "critical").length,
    };
  });

  const pieData = metricTypes
    .map((type) => ({
      name: type.name,
      value: metrics.filter((m) => m.metric_type_id === type.id).length,
    }))
    .filter((d) => d.value > 0);

  return (
    <div className="metrics-container">
      {toast.visible && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {/* HEADER */}
      <section className="metrics-header">
        <div>
          <h1>Monitoreo de Métricas</h1>
          <p>Supervisión de métricas y rendimiento de dispositivos.</p>
        </div>
        <div className="metrics-header-buttons">
          <button className="metrics-btn chart-btn" onClick={() => setShowChartModal(true)}>
            <FaChartLine /> Vista Gráfica
          </button>
          <button className="metrics-btn secondary" onClick={() => setShowTypeModal(true)}>
            <FaPlus /> Crear Tipo
          </button>
          <button
            className="metrics-btn"
            onClick={() => {
              setSelectedMetric(null);
              setFormData({ device_id: "", metric_type_id: "", value: "" });
              setShowModal(true);
            }}
          >
            <FaPlus /> Crear Métrica
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="metrics-stats">
        <div className="metric-stat-card">
          <div className="metric-stat-icon"><FaMicrochip /></div>
          <div>
            <h2>{metrics.length}</h2>
            <p>Total Métricas</p>
          </div>
        </div>
        <div className="metric-stat-card">
          <div className="metric-stat-icon"><FaServer /></div>
          <div>
            <h2>{devices.length}</h2>
            <p>Dispositivos</p>
          </div>
        </div>
        <div className="metric-stat-card">
          <div className="metric-stat-icon"><FaMemory /></div>
          <div>
            <h2>{metricTypes.length}</h2>
            <p>Tipos de Métricas</p>
          </div>
        </div>
        <div className="metric-stat-card">
          <div className="metric-stat-icon"><FaThermometerHalf /></div>
          <div>
            <h2>
              {metrics.filter((m) => {
                const type = metricTypes.find((t) => t.id === m.metric_type_id);
                return getMetricStatus(m.value, type) === "critical";
              }).length}
            </h2>
            <p>Críticas</p>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="metrics-table-panel">
        <div className="table-header">
          <h3>Lista de Métricas</h3>
        </div>

        {loading ? (
          <div className="loading-state">
            <span>Cargando métricas</span>
            <span className="dots"><i></i><i></i><i></i></span>
          </div>
        ) : (
          <div className="metrics-table">
            <div className="metric-row metric-head">
              <span>ID</span>
              <span>Dispositivo</span>
              <span>Tipo</span>
              <span>Valor</span>
              <span>Fecha</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>

            {metrics.map((metric) => {
              const device = devices.find((d) => d.id === metric.device_id);
              const metricType = metricTypes.find((t) => t.id === metric.metric_type_id);
              const status = getMetricStatus(metric.value, metricType);

              return (
                <div className="metric-row" key={metric.id}>
                  <span>#{metric.id}</span>
                  <span>{device?.name || metric.device_id}</span>
                  <span>{metricType?.name || metric.metric_type_id}</span>
                  <span>{metric.value} {metricType?.unit}</span>
                  <span>{metric.recorded_at}</span>
                  <span className={`metric-status ${status}`}>{status}</span>
                  <div className="metric-actions">
                    {/* VER */}
                    <button onClick={() => handleView(metric)}>
                      <FaEye />
                    </button>
                    {/* EDITAR */}
                    <button onClick={() => handleEdit(metric)}>
                      <FaEdit />
                    </button>
                    {/* BORRAR */}
                    <button className="delete-btn" onClick={() => handleDeleteConfirm(metric)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* MODAL VER DETALLES */}
      {showViewModal && selectedMetric && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="metric-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Detalles de la Métrica</h2>
                <p className="modal-subtitle">Información completa de la métrica.</p>
              </div>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>

            <div className="dv-view-body">
              {(() => {
                const device = devices.find((d) => d.id === selectedMetric.device_id);
                const metricType = metricTypes.find((t) => t.id === selectedMetric.metric_type_id);
                const status = getMetricStatus(selectedMetric.value, metricType);
                return (
                  <>
                    <div className="dv-view-row">
                      <span className="dv-view-label">ID</span>
                      <span>#{selectedMetric.id}</span>
                    </div>
                    <div className="dv-view-row">
                      <span className="dv-view-label">Dispositivo</span>
                      <span>{device?.name || "-"}</span>
                    </div>
                    <div className="dv-view-row">
                      <span className="dv-view-label">Tipo</span>
                      <span>{metricType?.name || "-"}</span>
                    </div>
                    <div className="dv-view-row">
                      <span className="dv-view-label">Valor</span>
                      <span>{selectedMetric.value} {metricType?.unit}</span>
                    </div>
                    <div className="dv-view-row">
                      <span className="dv-view-label">Fecha</span>
                      <span>{selectedMetric.recorded_at}</span>
                    </div>
                    <div className="dv-view-row">
                      <span className="dv-view-label">Estado</span>
                      <span className={`metric-status ${status}`}>{status}</span>
                    </div>
                    {metricType?.warning_threshold !== null && (
                      <div className="dv-view-row">
                        <span className="dv-view-label">Warning threshold</span>
                        <span>{metricType.warning_threshold} {metricType.unit}</span>
                      </div>
                    )}
                    {metricType?.critical_threshold !== null && (
                      <div className="dv-view-row">
                        <span className="dv-view-label">Critical threshold</span>
                        <span>{metricType.critical_threshold} {metricType.unit}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR BORRAR */}
      {showDeleteModal && selectedMetric && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="metric-modal dv-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Eliminar Métrica</h2>
                <p className="modal-subtitle">Esta acción no se puede deshacer.</p>
              </div>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>

            <div className="dv-delete-body">
              <p>
                ¿Estás seguro que deseas eliminar la métrica{" "}
                <strong>
                  #{selectedMetric.id} — {metricTypes.find((t) => t.id === selectedMetric.metric_type_id)?.name || selectedMetric.metric_type_id}
                </strong>?
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

      {/* MODAL CREAR / EDITAR MÉTRICA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="metric-modal">
            <div className="modal-header">
              <div>
                <h2>{selectedMetric ? "Editar Métrica" : "Crear Métrica"}</h2>
                <p className="modal-subtitle">Registre una métrica asociada a un dispositivo.</p>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setSelectedMetric(null);
                }}
              >
                ×
              </button>
            </div>

            <form className="metric-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Dispositivo</label>
                <select name="device_id" value={formData.device_id} onChange={handleChange} required>
                  <option value="">Seleccione dispositivo</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Métrica</label>
                <select name="metric_type_id" value={formData.metric_type_id} onChange={handleChange} required>
                  <option value="">Seleccione tipo</option>
                  {metricTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name} ({type.unit})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Valor</label>
                <input
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  placeholder="Ej: 75.5"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedMetric(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-btn">
                  {selectedMetric ? "Guardar Cambios" : "Guardar Métrica"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TYPE MODAL */}
      {showTypeModal && (
        <div className="modal-overlay">
          <div className="metric-modal">
            <div className="modal-header">
              <div>
                <h2>Crear Tipo de Métrica</h2>
                <p className="modal-subtitle">Cree categorías reutilizables para métricas.</p>
              </div>
              <button className="modal-close" onClick={() => setShowTypeModal(false)}>×</button>
            </div>

            <form className="metric-form" onSubmit={handleCreateType}>
              <div className="form-group">
                <label>Nombre</label>
                <input name="name" value={typeForm.name} onChange={handleTypeChange} placeholder="Ej: CPU Usage" required />
              </div>
              <div className="form-group">
                <label>Unidad</label>
                <input name="unit" value={typeForm.unit} onChange={handleTypeChange} placeholder="Ej: %" required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input name="description" value={typeForm.description} onChange={handleTypeChange} placeholder="Descripción" />
              </div>
              <div className="form-group">
                <label>Warning Threshold</label>
                <input type="number" step="0.01" name="warning_threshold" value={typeForm.warning_threshold} onChange={handleTypeChange} placeholder="70" />
              </div>
              <div className="form-group">
                <label>Critical Threshold</label>
                <input type="number" step="0.01" name="critical_threshold" value={typeForm.critical_threshold} onChange={handleTypeChange} placeholder="90" />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowTypeModal(false)}>Cancelar</button>
                <button type="submit" className="save-btn">Guardar Tipo</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showChartModal && (
        <div className="modal-overlay" onClick={() => setShowChartModal(false)}>
          <div className="chart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Vista Gráfica</h2>
                <p className="modal-subtitle">Distribución y evolución de métricas del sistema.</p>
              </div>
              <button className="modal-close" onClick={() => setShowChartModal(false)}>×</button>
            </div>

            <div className="chart-modal-body">
              <div className="chart-section">
                <h4>Métricas por Estado y Tipo</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={areaData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                    <Legend />
                    <Area type="monotone" dataKey="Normal" stroke="#6366f1" fill="url(#colorNormal)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Warning" stroke="#f59e0b" fill="url(#colorWarning)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Critical" stroke="#ef4444" fill="url(#colorCritical)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-section">
                <h4>Distribución por Tipo de Métrica</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Metrics;