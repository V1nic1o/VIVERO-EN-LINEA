import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import ChatbotWidget from './components/ChatbotWidget';
import PresentacionChatbot from './pages/PresentacionChatbot';

import AdminPlantas from './pages/AdminPlantas';
import AdminSlides from './pages/AdminSlides';
import AdminHistorialRespuestas from './pages/AdminHistorialRespuestas';
import AdminLayout from './components/admin/AdminLayout';
import AdminEstadisticas from './pages/AdminEstadisticas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/chatbot" element={<ChatbotWidget />} />
        <Route path="/presentacion" element={<PresentacionChatbot />} />

        {/* 🧠 Panel de administración con layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="plantas" element={<AdminPlantas />} />
          <Route path="slides" element={<AdminSlides />} />
          <Route path="estadisticas" element={<AdminEstadisticas />} /> {/* ✅ Corregido */}
          <Route path="historial" element={<AdminHistorialRespuestas />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
