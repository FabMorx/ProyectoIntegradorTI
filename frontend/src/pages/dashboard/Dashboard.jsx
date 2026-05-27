import "../../styles/dashboard/dashboard.css";
import "../../styles/loading.css";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

import { useState, useEffect } from "react";

import {
  FaServer,
  FaBell,
  FaUsers,
  FaMapMarkerAlt,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaMicrochip,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const token = localStorage.getItem("token");

  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [metricTypes, setMetricTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        devicesRes,
        alertsRes,
        metricsRes,
        usersRes,
        locationsRes,
        typesRes,
      ] = await Promise.all([
        fetch(`${API_URL}/devices/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/alerts/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/metrics/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/locations/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/metrics/types`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [
        devicesData,
        alertsData,
        metricsData,
        usersData,
        locationsData,
        typesData,
      ] = await Promise.all([
        devicesRes.json(),
        alertsRes.json(),
        metricsRes.json(),
        usersRes.json(),
        locationsRes.json(),
        typesRes.json(),
      ]);

      setDevices(Array.isArray(devicesData) ? devicesData : []);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
      setMetrics(Array.isArray(metricsData) ? metricsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setLocations(Array.isArray(locationsData) ? locationsData : []);
      setMetricTypes(Array.isArray(typesData) ? typesData : []);
    } catch (err) {
      console.log("Error cargando dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 90000);

    return () => clearInterval(interval);
  }, []);

  // HELPERS
  const getMetricStatus = (value, type) => {
    if (!type) return "normal";
    if (type.critical_threshold !== null && value >= type.critical_threshold)
      return "critical";
    if (type.warning_threshold !== null && value >= type.warning_threshold)
      return "warning";
    return "normal";
  };

  const criticalAlerts = alerts.filter((a) => a.severity?.name === "CRITICAL");
  const unresolvedAlerts = alerts.filter((a) => !a.is_resolved);
  const activeDevices = devices.filter((d) => d.status === "ACTIVE");
  const criticalMetrics = metrics.filter((m) => {
    const type = metricTypes.find((t) => t.id === m.metric_type_id);
    return getMetricStatus(m.value, type) === "critical";
  });

  const stats = [
    {
      title: "Dispositivos Activos",
      value: loading ? "—" : activeDevices.length,
      total: `de ${devices.length} totales`,
      icon: <FaServer />,
      trend: "up",
      trendLabel: `${devices.filter((d) => d.status === "MAINTENANCE").length} en mantenimiento`,
    },
    {
      title: "Alertas Sin Resolver",
      value: loading ? "—" : unresolvedAlerts.length,
      total: `de ${alerts.length} totales`,
      icon: <FaBell />,
      trend: unresolvedAlerts.length > 0 ? "down" : "up",
      trendLabel: `${criticalAlerts.length} críticas`,
    },
    {
      title: "Métricas Críticas",
      value: loading ? "—" : criticalMetrics.length,
      total: `de ${metrics.length} totales`,
      icon: <FaMicrochip />,
      trend: criticalMetrics.length > 0 ? "down" : "up",
      trendLabel: `${metricTypes.length} tipos de métrica`,
    },
    {
      title: "Usuarios del Sistema",
      value: loading ? "—" : users.length,
      total: `en ${locations.length} ubicaciones`,
      icon: <FaUsers />,
      trend: "up",
      trendLabel: "accesos activos",
    },
  ];

  const recentAlerts = [...alerts]
    .sort((a, b) => {
      if (!a.is_resolved && b.is_resolved) return -1;
      if (a.is_resolved && !b.is_resolved) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .slice(0, 5);

  const getSeverityClass = (severityName) => {
    switch (severityName) {
      case "CRITICAL":
        return "critical";
      case "WARNING":
        return "warning";
      case "INFO":
        return "info";
      default:
        return "";
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "-";
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  };

  const systemStatus = [
    {
      icon:
        devices.filter((d) => d.status === "INACTIVE").length > 0 ? (
          <FaExclamationTriangle className="status-warning" />
        ) : (
          <FaCheckCircle className="status-success" />
        ),
      label: `Dispositivos offline: ${devices.filter((d) => d.status === "INACTIVE").length}`,
    },
    {
      icon:
        devices.filter((d) => d.status === "MAINTENANCE").length > 0 ? (
          <FaExclamationTriangle className="status-warning" />
        ) : (
          <FaCheckCircle className="status-success" />
        ),
      label: `En mantenimiento: ${devices.filter((d) => d.status === "MAINTENANCE").length}`,
    },
    {
      icon:
        criticalAlerts.length > 0 ? (
          <FaExclamationTriangle className="status-warning" />
        ) : (
          <FaCheckCircle className="status-success" />
        ),
      label: `Alertas críticas activas: ${criticalAlerts.filter((a) => !a.is_resolved).length}`,
    },
    {
      icon:
        metrics.filter((m) => {
          const type = metricTypes.find((t) => t.id === m.metric_type_id);
          return getMetricStatus(m.value, type) === "warning";
        }).length > 0 ? (
          <FaExclamationTriangle className="status-warning" />
        ) : (
          <FaCheckCircle className="status-success" />
        ),
      label: `Métricas en warning: ${
        metrics.filter((m) => {
          const type = metricTypes.find((t) => t.id === m.metric_type_id);
          return getMetricStatus(m.value, type) === "warning";
        }).length
      }`,
    },
    {
      icon: <FaCheckCircle className="status-success" />,
      label: "Servicio Devices: Online",
    },
    {
      icon: <FaCheckCircle className="status-success" />,
      label: "Servicio Alerts: Online",
    },
    {
      icon: <FaCheckCircle className="status-success" />,
      label: "Servicio Metrics: Online",
    },
    {
      icon: <FaCheckCircle className="status-success" />,
      label: "Servicio Users: Online",
    },
  ];

const recentActivity = [
  ...devices
    .filter((d) => d.status === "MAINTENANCE")
    .slice(0, 2)
    .map((d) => `Dispositivo "${d.name}" en mantenimiento.`),
  ...devices
    .filter((d) => d.status === "INACTIVE")
    .slice(0, 2)
    .map((d) => `Dispositivo "${d.name}" está offline.`),
  ...alerts
    .filter((a) => !a.is_resolved)
    .slice(0, 2)
    .map((a) => `Alerta pendiente: "${a.message}".`),
  ...alerts
    .filter((a) => a.is_resolved)
    .slice(0, 1)
    .map((a) => `Alerta resuelta en dispositivo #${a.device_id}.`),
  `👥 ${users.length} usuarios registrados en el sistema.`,
].slice(0, 5);

  return (
    <div className="dashboard-container">
      <DashboardHeader
        devices={devices}
        alerts={alerts}
        metrics={metrics}
        users={users}
        locations={locations}
        metricTypes={metricTypes}
      />

      {/* HEADER */}
      <section className="dashboard-header">
        <div>
          <h1>Infrastructure Dashboard</h1>
          <p>Monitoréo en tiempo real de la infraestructura TI hospitalaria.</p>
        </div>
      </section>

      {/* STATS */}
      {loading ? (
        <div className="loading-state">
          <span>Cargando dashboard</span>
          <span className="dots">
            <i></i>
            <i></i>
            <i></i>
          </span>
        </div>
      ) : (
        <section className="stats-grid">
          {stats.map((item, index) => (
            <div className="stats-card" key={index}>
              <div className="stats-top">
                <div className="stats-icon">{item.icon}</div>
                <span
                  className={`stats-badge ${item.trend === "down" ? "badge-down" : ""}`}
                >
                  {item.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
                  {item.trendLabel}
                </span>
              </div>
              <h2>{item.value}</h2>
              <p>{item.title}</p>
              <small style={{ color: "#94a3b8", fontSize: "12px" }}>
                {item.total}
              </small>
            </div>
          ))}
        </section>
      )}

      {/* STATUS GRID */}
      <section className="dashboard-grid">
        {/* SYSTEM STATUS */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Status del Sistema</h3>
          </div>
          <div className="status-list">
            {loading ? (
              <div className="loading-state">
                <span>Cargando</span>
                <span className="dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </span>
              </div>
            ) : (
              systemStatus.map((item, i) => (
                <div className="status-item" key={i}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* UBICACIONES */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Ubicaciones</h3>
          </div>
          <div className="services-list">
            {loading ? (
              <div className="loading-state">
                <span>Cargando</span>
                <span className="dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </span>
              </div>
            ) : locations.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>Sin ubicaciones registradas.</p>
            ) : (
              locations.slice(0, 5).map((loc) => {
                const count = devices.filter(
                  (d) => d.location_id === loc.id,
                ).length;
                return (
                  <div className="service-item" key={loc.id}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaMapMarkerAlt style={{ color: "#6366f1" }} />
                      {loc.name}
                    </span>
                    <span className="service-status online">
                      {count} dispositivo{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ALERTAS RECIENTES */}
      <section className="dashboard-panel">
        <div className="panel-header">
          <h3>Alertas Recientes</h3>
          <span style={{ color: "#94a3b8", fontSize: "13px" }}>
            {unresolvedAlerts.length} sin resolver
          </span>
        </div>

        <div className="alerts-table">
          {loading ? (
            <div className="loading-state">
              <span>Cargando alertas</span>
              <span className="dots">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </div>
          ) : recentAlerts.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No hay alertas registradas.</p>
          ) : (
            recentAlerts.map((alert) => (
              <div className="alert-row" key={alert.id}>
                <span>
                  {devices.find((d) => d.id === alert.device_id)?.name ||
                    `Dispositivo #${alert.device_id}`}
                </span>
                <span
                  className={`alert-badge ${getSeverityClass(alert.severity?.name)}`}
                >
                  {alert.severity?.name || "-"}
                </span>
                <span style={{ color: "#64748b", fontSize: "13px" }}>
                  {timeAgo(alert.created_at)}
                </span>
                <span
                  className={`alert-badge ${alert.is_resolved ? "info" : "critical"}`}
                  style={{ fontSize: "12px" }}
                >
                  {alert.is_resolved ? "Resuelta" : "Pendiente"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ACTIVIDAD RECIENTE */}
      <section className="dashboard-panel">
        <div className="panel-header">
          <h3>Actividad Reciente</h3>
        </div>
        <div className="activity-list">
          {loading ? (
            <div className="loading-state">
              <span>Cargando</span>
              <span className="dots">
                <i></i>
                <i></i>
                <i></i>
              </span>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="activity-item">Sin actividad reciente.</div>
          ) : (
            recentActivity.map((item, i) => (
              <div className="activity-item" key={i}>
                {item}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
