import { useEffect, useState } from 'react';
import './NeuralBrain.css';
import axios from 'axios';
import API from '../services/api';

function NeuralBrain() {
  const [mensajes, setMensajes] = useState([]);
  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);
  const centerX = 300;
  const centerY = 200;
  const radio = 100;

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await axios.get(`${API}/api/estadisticas/intenciones`);
        const data = Array.isArray(res.data) ? res.data : [];
        setMensajes(data);
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
        setMensajes([]);
      }
    };
    fetchMensajes();
  }, []);

  const generarNodos = () => {
    if (!Array.isArray(mensajes) || mensajes.length === 0) return null;

    return mensajes.map((item, i) => {
      const angle = (i / mensajes.length) * 2 * Math.PI;
      const randomOffset = Math.random() * 40;
      const x = centerX + (radio + randomOffset) * Math.cos(angle);
      const y = centerY + (radio + randomOffset) * Math.sin(angle);

      return (
        <g
          key={`${item.mensajeUsuario}-${i}`}
          className="nodo-intencion"
          onClick={() => setNodoSeleccionado({ x, y, ...item })}
        >
          <line x1={centerX} y1={centerY} x2={x} y2={y} />
          <circle cx={x} cy={y} r={8 + parseInt(item.cantidad || 0)} />
          <text x={x + 14} y={y + 4} className="tooltip-text">
            {item.mensajeUsuario}
          </text>
        </g>
      );
    });
  };

  return (
    <svg className="neural-canvas" viewBox="0 0 600 400">
      <circle cx={centerX} cy={centerY} r={24} className="pulse-core" />
      <text
        x={centerX - 55}
        y={centerY - 30}
        className="nodo-central"
      >
        Agente Inteligente
      </text>

      {generarNodos()}

      {nodoSeleccionado && (
        <foreignObject
          x={nodoSeleccionado.x}
          y={nodoSeleccionado.y}
          width="180"
          height="100"
        >
          <div className="tooltip-card" xmlns="http://www.w3.org/1999/xhtml">
            <strong>Frase:</strong>
            <div>{nodoSeleccionado.mensajeUsuario}</div>
            <strong>Cantidad:</strong> {nodoSeleccionado.cantidad}
            <br />
            <button onClick={() => setNodoSeleccionado(null)}>Cerrar</button>
          </div>
        </foreignObject>
      )}
    </svg>
  );
}

export default NeuralBrain;
