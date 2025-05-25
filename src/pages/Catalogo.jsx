// src/pages/Catalogo.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Catalogo.css';
import API from '../services/api';

function Catalogo() {
  const [plantas, setPlantas] = useState([]);

  useEffect(() => {
    obtenerPlantas();
  }, []);

  const obtenerPlantas = async () => {
    try {
      const res = await axios.get(`${API}/api/plantas`);
      setPlantas(res.data);
    } catch (err) {
      console.error('Error al cargar el catálogo:', err);
    }
  };

return (
  <div className="catalogo-container">
    <h2 className="text-center">🌿 Catálogo de Plantas</h2>

    {plantas.length === 0 ? (
      <p className="text-center text-muted">No hay plantas disponibles.</p>
    ) : (
      <div className="catalogo-row">
        {plantas.map(planta => (
          <div key={planta.id} className="catalogo-card">
            {planta.imagen && (
              <img src={planta.imagen} alt={planta.nombre} />
            )}
            <div className="card-body">
              <h5>{planta.nombre}</h5>
              <p className="card-text">{planta.descripcion}</p>
              <ul className="list-unstyled">
                <li><strong>Tamaño:</strong> {planta.tamano}</li>
                <li><strong>Luz:</strong> {planta.luz}</li>
                <li><strong>Riego:</strong> {planta.riego}</li>
                <li><strong>Cuidado:</strong> {planta.cuidado}</li>
                <li><strong>Purifica el aire:</strong> {planta.purificaAire ? 'Sí' : 'No'}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default Catalogo;

