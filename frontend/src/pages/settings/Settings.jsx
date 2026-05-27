/* src/pages/settings/Settings.jsx */

import "../../styles/settings/settings.css";

import {
  FaUserShield,
  FaBell,
  FaPalette,
  FaDatabase,
  FaSave,
  FaGlobe,
} from "react-icons/fa";

function Settings() {

  return (
    <div className="settings-container">

      {/* HEADER */}
      <section className="settings-header">

        <div>
          <h1>Configuración del Sistema</h1>

          <p>
            Configuración general del sistema de monitoreo hospitalario.
          </p>
        </div>

        <button className="settings-save-btn">
          <FaSave />
          Save Changes
        </button>

      </section>

      {/* GRID */}
      <section className="settings-grid">

        {/* USER SETTINGS */}
        <div className="settings-card">

          <div className="settings-card-header">
            <FaUserShield />

            <h3>User Preferences</h3>
          </div>

          <div className="settings-form">

            <div className="settings-group">
              <label>Username</label>

              <input type="text" value="admin" readOnly />
            </div>

            <div className="settings-group">
              <label>Email</label>

              <input
                type="email"
                value="admin@hospital.com"
                readOnly
              />
            </div>

          </div>

        </div>

        {/* NOTIFICATIONS */}
        <div className="settings-card">

          <div className="settings-card-header">
            <FaBell />

            <h3>Notifications</h3>
          </div>

          <div className="settings-switches">

            <div className="switch-item">
              <span>Email Alerts</span>

              <input type="checkbox" defaultChecked />
            </div>

            <div className="switch-item">
              <span>Critical Notifications</span>

              <input type="checkbox" defaultChecked />
            </div>

            <div className="switch-item">
              <span>Maintenance Alerts</span>

              <input type="checkbox" />
            </div>

          </div>

        </div>


        {/* DATABASE */}
        <div className="settings-card">

          <div className="settings-card-header">
            <FaDatabase />

            <h3>Database</h3>
          </div>

          <div className="database-info">

            <div className="db-item">
              <span>Status</span>

              <p className="db-online">
                Connected
              </p>
            </div>

            <div className="db-item">
              <span>Last Backup</span>

              <p>Today - 03:00 AM</p>
            </div>

            <div className="db-item">
              <span>Storage Used</span>

              <p>68%</p>
            </div>

          </div>

        </div>

        {/* SYSTEM */}
        <div className="settings-card">

          <div className="settings-card-header">
            <FaGlobe />

            <h3>System Preferences</h3>
          </div>

          <div className="settings-form">

            <div className="settings-group">
              <label>Language</label>

              <select>
                <option>English</option>
                <option>Spanish</option>
              </select>
            </div>

            <div className="settings-group">
              <label>Timezone</label>

              <select>
                <option>America/Bogota</option>
                <option>UTC</option>
              </select>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Settings;