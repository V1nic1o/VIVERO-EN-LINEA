import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import API from '../services/api';

function AdminHistorialRespuestas() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    try {
      const res = await axios.get(`${API}/api/historial`);
      // Ordenamos por fecha descendente
      const ordenado = res.data.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
      setHistorial(ordenado);
    } catch (error) {
      console.error('Error al cargar historial:', error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📊 Historial de Respuestas del Chatbot</h3>
      <Table striped bordered hover responsive>
        <thead className="table-success">
          <tr>
            <th>🗨️ Usuario</th>
            <th>🤖 Respuesta</th>
            <th>🧠 Fuente</th>
            <th>📅 Fecha</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((item) => (
            <tr key={item.id}>
              <td>{item.mensajeUsuario}</td>
              <td>{item.respuesta}</td>
              <td>{item.fuente}</td>
              <td>{new Date(item.fechaHora).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminHistorialRespuestas;
