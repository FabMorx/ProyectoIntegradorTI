import {
  FaBell,
  FaSearch,
  FaDesktop,
  FaBell as FaBellIcon,
  FaMicrochip,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

const roleNames = {
  1: "Superadmin",
  2: "Admin TI",
  3: "Técnico TI",
  4: "Monitor",
  5: "Auditor",
};

const roleAccess = {
  1: ["devices", "alerts", "metrics", "users", "locations"],
  2: ["devices", "alerts", "metrics", "locations"],
  3: ["devices", "alerts", "metrics"],
  4: ["devices", "alerts", "metrics"],
  5: ["devices", "alerts", "metrics", "users", "locations"],
};

const getNameFromEmail = (email) => {
  if (!email) return "Usuario";
  const local = email.split("@")[0];
  return local
    .split(".")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const categoryIcon = {
  devices:   <FaDesktop />,
  alerts:    <FaBellIcon />,
  metrics:   <FaMicrochip />,
  users:     <FaUsers />,
  locations: <FaMapMarkerAlt />,
};

const categoryLabel = {
  devices:   "Dispositivo",
  alerts:    "Alerta",
  metrics:   "Métrica",
  users:     "Usuario",
  locations: "Ubicación",
};

const severityStyle = {
  CRITICAL: { background: "rgba(239, 68, 68, 0.10)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" },
  WARNING:  { background: "rgba(245, 158, 11, 0.10)", color: "#d97706", border: "1px solid rgba(245,158,11,0.2)" },
  INFO:     { background: "rgba(59, 130, 246, 0.10)", color: "#2563eb", border: "1px solid rgba(59,130,246,0.2)" },
};

const defaultStyle = { background: "rgba(99,102,241,0.08)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.15)" };

function DashboardHeader({
  devices = [],
  alerts = [],
  metrics = [],
  users = [],
  locations = [],
  metricTypes = [],
}) {
  const token = localStorage.getItem("token");
  const roleId = Number(localStorage.getItem("role_id"));

  let email = "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    email = payload.email || "";
  } catch { email = ""; }

  const name = getNameFromEmail(email);
  const role = roleNames[roleId] || "Usuario";
  const avatar = name.charAt(0).toUpperCase();

  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const searchRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const notifications = [
    ...alerts.slice(0, 3).map((a) => ({
      type: "alerts",
      label: a.message,
      sub: a.severity?.name || "Alerta",
      severity: a.severity?.name,
      time: a.created_at,
      data: a,
    })),
    ...devices.slice(0, 2).map((d) => ({
      type: "devices",
      label: d.name,
      sub: `Dispositivo — ${d.status}`,
      severity: null,
      time: null,
      data: d,
    })),
    ...metrics.slice(0, 2).map((m) => {
      const type = metricTypes.find((t) => t.id === m.metric_type_id);
      return {
        type: "metrics",
        label: type?.name || `Métrica #${m.id}`,
        sub: `${m.value} ${type?.unit || ""}`,
        severity: null,
        time: m.recorded_at,
        data: m,
      };
    }),
  ].slice(0, 8);

  const unresolvedCount = alerts.filter((a) => !a.is_resolved).length;

  // =====================
  // SEARCH HANDLERS
  // =====================
  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (!q.trim()) { setResults([]); setShowDropdown(false); return; }

    const access = roleAccess[roleId] || [];
    const lower = q.toLowerCase();
    const found = [];

    if (access.includes("devices")) {
      devices
        .filter((d) => d.name?.toLowerCase().includes(lower) || d.ip_address?.toLowerCase().includes(lower))
        .forEach((d) => found.push({ category: "devices", label: d.name, sub: d.ip_address, data: d }));
    }
    if (access.includes("alerts")) {
      alerts
        .filter((a) => a.message?.toLowerCase().includes(lower) || a.severity?.name?.toLowerCase().includes(lower))
        .forEach((a) => found.push({ category: "alerts", label: a.message, sub: a.severity?.name, data: a }));
    }
    if (access.includes("metrics")) {
      metrics
        .filter((m) => {
          const type = metricTypes.find((t) => t.id === m.metric_type_id);
          return type?.name?.toLowerCase().includes(lower) || String(m.value).includes(lower);
        })
        .forEach((m) => {
          const type = metricTypes.find((t) => t.id === m.metric_type_id);
          found.push({ category: "metrics", label: type?.name || `Métrica #${m.id}`, sub: `${m.value} ${type?.unit || ""}`, data: m });
        });
    }
    if (access.includes("users")) {
      users
        .filter((u) => u.email?.toLowerCase().includes(lower))
        .forEach((u) => found.push({ category: "users", label: u.email, sub: `Role ID: ${u.role_id}`, data: u }));
    }
    if (access.includes("locations")) {
      locations
        .filter((l) => l.name?.toLowerCase().includes(lower))
        .forEach((l) => found.push({ category: "locations", label: l.name, sub: l.address || "", data: l }));
    }

    setResults(found.slice(0, 8));
    setShowDropdown(true);
  };

  const handleResultClick = (item) => {
    setSelectedItem({ category: item.category, label: item.label, data: item.data });
    setShowModal(true);
    setShowDropdown(false);
    setQuery("");
  };

  const handleNotifClick = (notif) => {
    setSelectedItem({ category: notif.type, label: notif.label, data: notif.data });
    setShowModal(true);
    setShowNotifications(false);
  };

  
  // MODAL CONTENT
  const renderModalContent = () => {
    if (!selectedItem) return null;
    const { category, data } = selectedItem;

    const Row = ({ label, value }) => (
      <div className="search-modal-row">
        <span className="search-modal-label">{label}</span>
        <span>{value ?? "-"}</span>
      </div>
    );

    if (category === "devices") return (
      <><Row label="Nombre" value={data.name} /><Row label="IP" value={data.ip_address} /><Row label="MAC" value={data.mac_address} /><Row label="Estado" value={data.status} /></>
    );
    if (category === "alerts") return (
      <><Row label="Mensaje" value={data.message} /><Row label="Severidad" value={data.severity?.name} /><Row label="Estado" value={data.is_resolved ? "Resuelta" : "Pendiente"} /><Row label="Creada" value={data.created_at ? new Date(data.created_at).toLocaleString() : "-"} /></>
    );
    if (category === "metrics") {
      const type = metricTypes.find((t) => t.id === data.metric_type_id);
      return (
        <><Row label="Tipo" value={type?.name} /><Row label="Valor" value={`${data.value} ${type?.unit || ""}`} /><Row label="Dispositivo ID" value={data.device_id} /><Row label="Fecha" value={data.recorded_at} /></>
      );
    }
    if (category === "users") return (
      <><Row label="Email" value={data.email} /><Row label="Rol ID" value={data.role_id} /></>
    );
    if (category === "locations") return (
      <><Row label="Nombre" value={data.name} /><Row label="Dirección" value={data.address} /></>
    );
  };
  const showOverlay = showDropdown || showNotifications || showModal;

  return (
    <>
  
      {showOverlay && (
        <div
          className="topbar-backdrop"
          onClick={() => {
            setShowDropdown(false);
            setShowNotifications(false);
            setShowModal(false);
          }}
        />
      )}

      <header className="dashboard-topbar">

        {/* SEARCH */}
        <div className="topbar-search" ref={searchRef}>
          <FaSearch />
          <input
            type="text"
            placeholder="Buscar dispositivos, alertas..."
            value={query}
            onChange={handleSearch}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
          />

          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item, i) => (
                <div className="search-result-item" key={i} onClick={() => handleResultClick(item)}>
                  <span className="search-result-icon">{categoryIcon[item.category]}</span>
                  <div className="search-result-text">
                    <span className="search-result-label">{item.label}</span>
                    <span className="search-result-sub">{categoryLabel[item.category]} — {item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showDropdown && query && results.length === 0 && (
            <div className="search-dropdown">
              <div className="search-no-results">Sin resultados para "{query}"</div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="topbar-actions">

          {/* ✅ CAMPANA */}
          <div className="notif-wrapper" ref={notifRef}>
            <button
              className="topbar-icon-btn notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {unresolvedCount > 0 && (
                <span className="notification-dot">{unresolvedCount > 9 ? "9+" : unresolvedCount}</span>
              )}
            </button>

            {/* ✅ DROPDOWN NOTIFICACIONES */}
            {showNotifications && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <h4>Notificaciones</h4>
                  <span>{unresolvedCount} sin resolver</span>
                </div>

                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="notif-empty">Sin notificaciones recientes</div>
                  ) : (
                    notifications.map((notif, i) => {
                      const style = notif.severity
                        ? (severityStyle[notif.severity] || defaultStyle)
                        : defaultStyle;
                      return (
                        <div
                          className="notif-item"
                          key={i}
                          style={{ background: style.background, border: style.border }}
                          onClick={() => handleNotifClick(notif)}
                        >
                          <span className="notif-icon" style={{ color: style.color }}>
                            {categoryIcon[notif.type]}
                          </span>
                          <div className="notif-text">
                            <span className="notif-label" style={{ color: style.color }}>{notif.label}</span>
                            <span className="notif-sub">{notif.sub}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* USER */}
          <div className="topbar-user">
            <div className="user-avatar">{avatar}</div>
            <div>
              <h4>{name}</h4>
              <span>{role}</span>
            </div>
          </div>

        </div>
      </header>

      {/* MODAL DETALLE */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="search-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="search-modal-icon">{categoryIcon[selectedItem.category]}</span>
                <div>
                  <h3>{selectedItem.label}</h3>
                  <span className="search-modal-category">{categoryLabel[selectedItem.category]}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="search-modal-body">{renderModalContent()}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardHeader;