import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Footer from "../../components/layout/Footer";

import "../../styles/auth/login.css";

import imgLogin from "../../assets/images/imglogin.png";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales incorrectas");
      }

      localStorage.setItem("token", data.token);

      const payload = JSON.parse(
        atob(data.token.split(".")[1])
      );

      localStorage.setItem("role_id", payload.role_id);

      setSuccess("Inicio de sesión exitoso");

      setTimeout(() => {
        navigate("/dashboard");
      }, 400);

    } catch (err) {
      setError(err.message || "Error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">

        <div
          className="home-icon"
          onClick={() => navigate("/")}
        >
          <FaHome />
        </div>

        <div className="login-card">

          {/* IZQUIERDA */}
          <div className="login-left">

            <h1>Login Page</h1>

            <p>
              Bienvenido al sistema de monitoreo TI.
            </p>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {success && (
              <div className="login-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Correo</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@hospital.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-boton"
                disabled={loading}
              >
                {loading
                  ? "Ingresando..."
                  : "Iniciar Sesión"}
              </button>

            </form>

          </div>

          {/* DERECHA */}
          <div className="login-right">

            <img
              src={imgLogin}
              alt="Login Illustration"
            />

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Login;