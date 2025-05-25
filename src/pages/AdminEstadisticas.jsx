// src/pages/AdminEstadisticas.jsx
import { useEffect, useState, useRef } from 'react';
import './AdminEstadisticas.css';
import { motion } from 'framer-motion';
import axios from 'axios';
import NeuralBrain from '../components/NeuralBrain';
import API from '../services/api';

function AdminEstadisticas() {
  const containerRef = useRef();
  const [intenciones, setIntenciones] = useState([]);
  const [fuentes, setFuentes] = useState([]);
  const [aprendidas, setAprendidas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [intRes, fuenteRes, aprendidasRes] = await Promise.all([
        axios.get(`${API}/api/estadisticas/intenciones`),
        axios.get(`${API}/api/estadisticas/fuentes`),
        axios.get(`${API}/api/estadisticas/aprendidas`),
      ]);

        console.log('✔ Intenciones:', intRes.data);
        console.log('✔ Fuentes:', fuenteRes.data);
        console.log('✔ Aprendidas:', aprendidasRes.data);

        setIntenciones(Array.isArray(intRes.data) ? intRes.data : []);
        setFuentes(Array.isArray(fuenteRes.data) ? fuenteRes.data : []);
        setAprendidas(Array.isArray(aprendidasRes.data) ? aprendidasRes.data : []);
      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error.message);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  const totalAprendidas = aprendidas.reduce(
    (acc, f) => acc + parseInt(f.cantidad || 0),
    0
  );

  const totalRespuestas = fuentes.reduce(
    (acc, f) => acc + parseInt(f.cantidad || 0),
    0
  );

  const formatearNombreFuente = (nombre) => {
    if (nombre === 'openai') return 'dataset';
    return nombre;
  };

  return (
    <div ref={containerRef} className="dashboard-container">
      {/* Cabecera narrativa */}
      <section className="intro-section">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          🧠 Estadísticas del Agente Inteligente
        </motion.h1>
        <p className="intro-subtitle">
          Visualiza cómo aprende y evoluciona tu asistente en tiempo real.
        </p>
      </section>

      {/* Visualización tipo cerebro */}
      <section className="neural-visual-section">
        <div className="neural-brain">
          {cargando ? (
            <p className="placeholder-text">Cargando visualización neuronal...</p>
          ) : (
            <NeuralBrain />
          )}
        </div>
      </section>

      {/* Métricas resumidas */}
      <section className="metrics-section">
        {cargando ? (
          <div className="metric-card">Cargando métricas...</div>
        ) : (
          <>
            <div className="metric-card">
              Mensajes distintos analizados: <strong>{intenciones.length}</strong>
            </div>
            <div className="metric-card">
              Frases aprendidas: <strong>{totalAprendidas}</strong>
            </div>
            <div className="metric-card">
              Respuestas totales: <strong>{totalRespuestas}</strong>
            </div>
            <div className="metric-card">
              Fuentes:
              {fuentes.map((f, i) => (
                <div key={i}>
                  {formatearNombreFuente(f.fuente)}: <strong>{f.cantidad}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminEstadisticas;
