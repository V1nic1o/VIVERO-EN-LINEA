// src/pages/AdminSlides.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../services/api';

function AdminSlides() {
  const [slides, setSlides] = useState([]);
  const [imagen, setImagen] = useState(null);

  const obtenerSlides = async () => {
    try {
      const res = await axios.get(`${API}/api/slides`);
      setSlides(res.data);
    } catch (err) {
      console.error('Error al cargar slides:', err);
    }
  };

  const manejarArchivo = (e) => {
    setImagen(e.target.files[0]);
  };

  const guardarSlide = async () => {
    if (!imagen) {
      alert('Selecciona una imagen antes de subir.');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', imagen);

    try {
      await axios.post(`${API}/api/slides`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImagen(null);
      obtenerSlides();
    } catch (err) {
      console.error('❌ Error al subir slide:', err);
      alert('Error al subir el slide.');
    }
  };

  const eliminarSlide = async (id) => {
    try {
      await axios.delete(`${API}/api/slides/${id}`);
      obtenerSlides();
    } catch (err) {
      console.error('Error al eliminar slide:', err);
      alert('Error al eliminar slide');
    }
  };

  useEffect(() => {
    obtenerSlides();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">📸 Administrar Slides</h2>

      <div className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">Subir nueva imagen</h5>
        <div className="row g-3">
          <div className="col-md-8">
            <input type="file" className="form-control" accept="image/*" onChange={manejarArchivo} />
          </div>
          <div className="col-md-4">
            <button className="btn btn-success w-100" onClick={guardarSlide}>Guardar Slide</button>
          </div>
        </div>
      </div>

      <h5 className="mb-3">Imágenes actuales</h5>
      <div className="row">
        {slides.map(slide => (
          <div key={slide.id} className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <img src={slide.imagen} alt={`Slide ${slide.id}`} className="card-img-top" style={{ height: 200, objectFit: 'cover' }} />
              <div className="card-body text-center">
                <button className="btn btn-danger btn-sm" onClick={() => eliminarSlide(slide.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminSlides;
