import "../../styles/home/home.css";

import { motion } from "framer-motion";

import {
  heroAnimation,
  containerAnimation,
  cardAnimation,
} from "../../animations/homeAnimations";

import {
  FaServer,
  FaNetworkWired,
  FaBell,
  FaLayerGroup,
} from "react-icons/fa";

function Home() {

  const features = [
    {
      icon: <FaServer />,
      title: "Monitoreo Centralizado",
      text: "Supervisión en tiempo real de toda la infraestructura TI del hospital.",
    },
    {
      icon: <FaNetworkWired />,
      title: "Gestión de Dispositivos",
      text: "Control de servidores, routers y equipos conectados.",
    },
    {
      icon: <FaBell />,
      title: "Alertas Inteligentes",
      text: "Detección automática de fallos críticos en la red.",
    },
    {
      icon: <FaLayerGroup />,
      title: "Escalabilidad",
      text: "Arquitectura preparada para microservicios y crecimiento.",
    },
  ];

  return (
    <div className="home-container">

      {/* HERO */}
      <motion.section
        className="hero"
        variants={heroAnimation}
        initial="hidden"
        animate="visible"
      >

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Sistema Inteligente de Monitoreo TI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Plataforma centralizada para supervisar la infraestructura del
          Hospital Universitario San Rafael de Tunja.
        </motion.p>

      </motion.section>

      {/* FEATURES */}
      <motion.section
        className="features"
        variants={containerAnimation}
        initial="hidden"
        animate="visible"
      >

        {features.map((item, index) => (

          <motion.div
            className="card"
            key={index}
            variants={cardAnimation}

            whileHover={{
              y: -8,
              scale: 1.03,
            }}

            whileTap={{
              scale: 0.98,
            }}
          >

            <motion.div
              className="card-icon"

              whileHover={{
                rotate: 5,
                scale: 1.12,
              }}

              transition={{
                type: "spring",
                stiffness: 300,
              }}
            >
              {item.icon}
            </motion.div>

            <h3>{item.title}</h3>

            <p>{item.text}</p>

          </motion.div>

        ))}

      </motion.section>

      {/* HIGHLIGHT */}
      <motion.section
        className="highlight-wrapper"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >

        <motion.div
          className="highlight-card"

          whileHover={{
            y: -6,
            scale: 1.01,
          }}
        >

          <h2>
            Impacto en la Operación Hospitalaria
          </h2>

          <p>
            Mejora la disponibilidad de los equipos médicos conectados a la red del hospital,
            permitiendo una supervisión más eficiente de dispositivos críticos y reduciendo
            interrupciones en procesos de atención.
          </p>

        </motion.div>

      </motion.section>

    </div>
  );
}

export default Home;