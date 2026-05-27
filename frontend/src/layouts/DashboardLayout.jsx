/* src/layouts/DashboardLayout.jsx */

import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import "../styles/layout/layout.css";

function DashboardLayout() {

  return (
    <div className="layout-container">

      {/* SIDEBAR */}
      <Sidebar />
      {/* CONTENIDO */}
      <div className="layout-content">
        <main className="layout-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;