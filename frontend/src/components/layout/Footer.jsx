import "../../styles/layout/footer.css";

import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-bottom">

        {/* IZQUIERDA */}
        <div className="footer-copy">
          © 2026 - Sistema de Monitoreo TI- Ingenieria De Sistemas
        </div>

        {/* DERECHA */}
        <div className="footer-right">

          <div className="footer-support">
            soporte@hospital-ti.com
          </div>

          <div className="social-icons">

            <a
              href="https://www.facebook.com/HospitalSanRafaelDeTunja"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.youtube.com/c/HospitalSanRafaelTunja"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>

            <a
              href="https://www.instagram.com/hsanrafaeltunja/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.tiktok.com/@hsanrafaeltunja"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok />
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;