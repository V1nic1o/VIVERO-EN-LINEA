// src/components/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <header>
        <h1 className="m-0">🌿 Panel de Administración</h1>
      </header>

      <div className="d-flex">
        <aside className="p-3" style={{ width: '240px', minHeight: '100vh', borderRight: '1px solid #cce3d5' }}>
          <nav className="nav flex-column">
            <NavLink to="/" className="nav-link">🏠 Volver al inicio</NavLink>
            <NavLink to="/admin/plantas" className="nav-link">🪴 Plantas</NavLink>
            <NavLink to="/admin/slides" className="nav-link">🎞️ Slides</NavLink>
            <NavLink to="/admin/historial" className="nav-link">📊 Historial Chatbot</NavLink>
            <NavLink to="/admin/estadisticas" className="nav-link">📈 Estadísticas</NavLink>
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
