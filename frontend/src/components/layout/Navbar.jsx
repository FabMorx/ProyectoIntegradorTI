import { useNavigate } from "react-router-dom";
import "../../styles/layout/navbar.css";
import logo from "../../assets/images/logo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO / NOMBRE */}
        <div className="navbar-logo">

          <img
            src={logo}
            alt="TI Monitor Logo"
            className="navbar-logo-img"
          />

          <h2>TI Monitor</h2>

        </div>

        {/* DERECHA */}
        <div className="navbar-actions">

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Iniciar Sesión
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;