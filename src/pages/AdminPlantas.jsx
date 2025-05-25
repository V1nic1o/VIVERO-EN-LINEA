// src/pages/AdminPlantas.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../services/api';

function AdminPlantas() {
  const [plantas, setPlantas] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    tamano: '',
    luz: '',
    riego: '',
    cuidado: '',
    purificaAire: false
  });
  const [imagen, setImagen] = useState(null);

  const obtenerPlantas = async () => {
    try {
      const res = await axios.get(`${API}/api/plantas`);
      setPlantas(res.data);
    } catch (err) {
      console.error('Error al cargar plantas:', err);
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const manejarImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const guardarPlanta = async () => {
    const camposObligatorios = ['nombre', 'descripcion', 'tamano', 'luz', 'riego', 'cuidado'];
    for (let campo of camposObligatorios) {
      if (!formulario[campo]) {
        alert(`Por favor completa el campo: ${campo}`);
        return;
      }
    }

    try {
      const formData = new FormData();
      Object.entries(formulario).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imagen) {
        formData.append('imagen', imagen);
      }

      await axios.post(`${API}/api/plantas`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormulario({
        nombre: '',
        descripcion: '',
        tamano: '',
        luz: '',
        riego: '',
        cuidado: '',
        purificaAire: false
      });
      setImagen(null);
      obtenerPlantas();
    } catch (err) {
      console.error('❌ Error al guardar planta:', err);
      alert('Error al guardar la planta. Revisa consola para más detalles.');
    }
  };

  useEffect(() => {
    obtenerPlantas();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">🌿 Administrar Plantas</h2>

      <div className="card p-4 shadow mb-4">
        <h5 className="mb-3">Agregar nueva planta</h5>
        <div className="row g-2">
          <div className="col-md-6">
            <input name="nombre" className="form-control" placeholder="Nombre" value={formulario.nombre} onChange={manejarCambio} />
          </div>
          <div className="col-md-6">
            <input name="descripcion" className="form-control" placeholder="Descripción" value={formulario.descripcion} onChange={manejarCambio} />
          </div>
          <div className="col-md-4">
            <select name="tamano" className="form-select" value={formulario.tamano} onChange={manejarCambio}>
              <option value="">Tamaño</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>
          <div className="col-md-4">
            <select name="luz" className="form-select" value={formulario.luz} onChange={manejarCambio}>
              <option value="">Luz</option>
              <option value="poca">Poca</option>
              <option value="indirecta">Indirecta</option>
              <option value="mucha">Mucha</option>
            </select>
          </div>
          <div className="col-md-4">
            <select name="riego" className="form-select" value={formulario.riego} onChange={manejarCambio}>
              <option value="">Riego</option>
              <option value="escaso">Escaso</option>
              <option value="moderado">Moderado</option>
              <option value="frecuente">Frecuente</option>
            </select>
          </div>
          <div className="col-md-4">
            <select name="cuidado" className="form-select" value={formulario.cuidado} onChange={manejarCambio}>
              <option value="">Cuidado</option>
              <option value="fácil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="exigente">Exigente</option>
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-center">
            <label className="form-check-label me-2">¿Purifica el aire?</label>
            <input name="purificaAire" type="checkbox" className="form-check-input" checked={formulario.purificaAire} onChange={manejarCambio} />
          </div>
          <div className="col-md-4">
            <input type="file" className="form-control" accept="image/*" onChange={manejarImagen} />
          </div>
          <div className="col-12">
            <button className="btn btn-success w-100" onClick={guardarPlanta}>Guardar Planta</button>
          </div>
        </div>
      </div>

      <h5>Lista de Plantas</h5>
      <div className="row">
        {plantas.map(planta => (
          <div key={planta.id} className="col-md-4 mb-4">
            <div className="card shadow h-100">
              {planta.imagen && (
                <img src={planta.imagen} className="card-img-top" alt={planta.nombre} style={{ height: 200, objectFit: 'cover' }} />
              )}
              <div className="card-body">
                <h6 className="card-title fw-bold">{planta.nombre}</h6>
                <p className="card-text">{planta.descripcion}</p>
                <small className="text-muted">Tamaño: {planta.tamano} | Luz: {planta.luz}</small><br />
                <small className="text-muted">Riego: {planta.riego} | Cuidado: {planta.cuidado}</small><br />
                <small className="text-muted">Purifica aire: {planta.purificaAire ? 'Sí' : 'No'}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPlantas;
