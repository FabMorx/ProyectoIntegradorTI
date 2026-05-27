import { NavLink } from "react-router-dom";

import {
  FaChartPie,
  FaDesktop,
  FaBell,
  FaChartLine,
  FaUsers,
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "../../styles/layout/sidebar.css";
import logo from "../../assets/images/logo.png";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaChartPie />,
    roles: [1, 2, 3, 4, 5],
  },
  {
    name: "Dispositivos",
    path: "/devices",
    icon: <FaDesktop />,
    roles: [1, 2, 3, 4],
  },
  { name: "Alertas", path: "/alerts", icon: <FaBell />, roles: [1, 2, 3, 4] },
  {
    name: "Graficas",
    path: "/metrics",
    icon: <FaChartLine />,
    roles: [1, 2, 3, 4],
  },
  { name: "Usuarios", path: "/users", icon: <FaUsers />, roles: [1] },
  {
    name: "Localizaciones",
    path: "/locations",
    icon: <FaMapMarkerAlt />,
    roles: [1, 2],
  },
  { name: "Configuración", path: "/settings", icon: <FaCog />, roles: [1] },
];

function Sidebar() {
  const roleId = Number(localStorage.getItem("role_id"));
  const filteredItems = menuItems.filter((item) => item.roles.includes(roleId));

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">
        <img src={logo} alt="Hospital TI" className="sidebar-logo-img" />
        <span>Monitoring System</span>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        {filteredItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>
          <p>Sistema Online</p>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role_id");
            window.location.href = "/";
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
