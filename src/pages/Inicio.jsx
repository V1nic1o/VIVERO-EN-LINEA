// src/pages/Inicio.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Inicio.css';
import API from '../services/api';

function Inicio() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [plantas, setPlantas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlides();
    fetchPlantas();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${API}/api/slides`);
      setSlides(res.data);
    } catch (err) {
      console.error('Error al cargar slides:', err);
    }
  };

  const fetchPlantas = async () => {
    try {
      const res = await axios.get(`${API}/api/plantas`);
      setPlantas(res.data.slice(0, 3));
    } catch (err) {
      console.error('Error al cargar plantas:', err);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="inicio-immersive">
      {/* HERO: Slide inmersivo con mensaje central */}
      <section className="hero-section">
        <div
          className="hero-background"
          style={{
            backgroundImage: `url(${currentSlide?.imagen})`,
          }}
        ></div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Botón admin visible */}
          <button
            className="btn btn-outline-light position-absolute top-0 end-0 m-3"
            style={{ zIndex: 10 }}
            onClick={() => navigate('/admin')}
          >
            Admin
          </button>

          <h1 className="hero-title">Bienvenido al vivero en linea</h1>
          <p className="hero-subtitle">Descubre, conecta y transforma tu espacio con plantas</p>
          <button className="btn btn-success mt-3" onClick={() => navigate('/catalogo')}>
            Explorar catálogo
          </button>
        </motion.div>
      </section>

      {/* Paso 1: Recomendador */}
      <section className="immersive-section">
        <motion.div
          className="immersive-block"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="block-title">🌱 Recomendador inteligente</h2>
          <p className="block-text">Responde algunas preguntas y te sugeriremos la planta perfecta para ti.</p>
          <button className="btn btn-outline-light mt-2" onClick={() => navigate('/chatbot')}>
            Iniciar recomendador
          </button>
        </motion.div>
      </section>

      {/* Paso 2: Plantas destacadas */}
      <section className="immersive-section">
        <motion.div
          className="immersive-block"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="block-title">🪴 Plantas destacadas</h2>
          <div className="row g-4 mt-3">
            {plantas.map((planta) => (
              <div key={planta.id} className="col-md-4">
                <div className="card plant-card">
                  {planta.imagen && (
                    <img
                      src={planta.imagen}
                      className="card-img-top"
                      alt={planta.nombre}
                      style={{ height: 180, objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body text-light">
                    <h6>{planta.nombre}</h6>
                    <p className="small text-muted">{planta.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Paso 3: Asistente bot */}
      <section className="immersive-section">
        <motion.div
          className="immersive-block text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="block-title">🤖 Asistente de vivero</h2>
          <p className="block-text">Habla con nuestro bot inteligente y futurista para resolver dudas, recibir consejos o buscar plantas.</p>
          <button className="btn btn-success mt-2" onClick={() => navigate('/chatbot')}>
            Ir al Asistente
          </button>
        </motion.div>
      </section>

      {/* Paso 4: Presentación del chatbot */}
      <section className="immersive-section">
        <motion.div
          className="immersive-block text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="block-title">🌟 Presentación del Chatbot</h2>
          <p className="block-text">Descubre cómo fue creado, cómo funciona y por qué es único.</p>
          <button className="btn btn-outline-light mt-3" onClick={() => navigate('/presentacion')}>
            Ver presentación
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center text-muted py-4">
        <p className="small">© {new Date().getFullYear()} Vivero Inteligente 🌿</p>
      </footer>
    </div>
  );
}

export default Inicio;
 