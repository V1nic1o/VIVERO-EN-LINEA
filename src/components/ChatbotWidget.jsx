// src/components/ChatbotWidget.jsx
import './ChatbotWidget.css';
import API from '../services/api';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaMicrophone, FaHeadphones, FaLeaf } from 'react-icons/fa';
import VoiceMode from './VoiceMode';

function ChatbotWidget() {
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [modoVozActivo, setModoVozActivo] = useState(false);
  const [modoRecomendador, setModoRecomendador] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState('');
  const [opciones, setOpciones] = useState([]);
  const [recomendacionFinal, setRecomendacionFinal] = useState([]);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [mensajes]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript;
      setInput('');
      enviarMensaje(texto);
    };

    recognition.onend = () => setGrabando(false);
    recognition.onerror = () => setGrabando(false);

    recognitionRef.current = recognition;
  }, []);

  const enviarMensaje = async (mensajeManual = null) => {
    const mensajeUsuario = mensajeManual !== null ? mensajeManual : input.trim();
    if (!mensajeUsuario) return;

    setMensajes(prev => [...prev, { from: 'usuario', text: mensajeUsuario }]);
    setInput('');
    setCargando(true);
    setOpciones([]);
    setRecomendacionFinal([]);

    try {
      const res = await axios.post(`${API}/api/chat`, { mensaje: mensajeUsuario });
      const { respuesta, fuente, recomendaciones } = res.data;

      if (fuente === 'recomendador') {
        if (respuesta.includes('tamaño')) {
          setPreguntaActual(respuesta);
          setOpciones(['pequeño', 'mediano', 'grande']);
        } else if (respuesta.includes('luz')) {
          setPreguntaActual(respuesta);
          setOpciones(['mucha', 'poca', 'indirecta']);
        } else if (respuesta.includes('riego')) {
          setPreguntaActual(respuesta);
          setOpciones(['frecuente', 'moderado', 'escaso']);
        } else if (respuesta.includes('cuidado')) {
          setPreguntaActual(respuesta);
          setOpciones(['fácil', 'medio', 'exigente']);
        } else if (respuesta.includes('purifique')) {
          setPreguntaActual(respuesta);
          setOpciones(['sí', 'no']);
        } else if (recomendaciones && recomendaciones.length > 0) {
          setPreguntaActual('');
          setRecomendacionFinal(recomendaciones);
        }
      } else {
        setPreguntaActual('');
      }

      setMensajes(prev => [...prev, { from: 'bot', text: respuesta }]);
    } catch (error) {
      console.error("❌ Error:", error.message);
      setMensajes(prev => [
        ...prev,
        { from: 'bot', text: '⚠️ Ocurrió un error al contactar al chatbot.' },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const enviarMensajeDesdeVoz = async (mensajeUsuario) => {
    if (!mensajeUsuario) return '';

    setMensajes(prev => [...prev, { from: 'usuario', text: mensajeUsuario }]);
    setCargando(true);
    setOpciones([]);
    setRecomendacionFinal([]);

    try {
      const res = await axios.post(`${API}/api/chat`, { mensaje: mensajeUsuario });
      const { respuesta } = res.data;

      setMensajes(prev => [...prev, { from: 'bot', text: respuesta }]);
      return respuesta;
    } catch (error) {
      setMensajes(prev => [...prev, { from: 'bot', text: '⚠️ Error al contactar al chatbot.' }]);
      return 'Ocurrió un error al contactar al chatbot.';
    } finally {
      setCargando(false);
    }
  };

  const iniciarRecomendador = () => {
    setModoRecomendador(true);
    enviarMensaje('Recomiéndame una planta');
  };

  const finalizarConversacion = () => {
    setModoRecomendador(false);
    setPreguntaActual('');
    setOpciones([]);
    setRecomendacionFinal([]);
    setMensajes(prev => [...prev, { from: 'bot', text: '✅ Conversación finalizada. Puedes iniciar una nueva cuando gustes.' }]);
  };

  const limpiarConversacion = () => {
    setMensajes([]);
    setInput('');
    setOpciones([]);
    setPreguntaActual('');
    setRecomendacionFinal([]);
    setModoRecomendador(false);
  };

  const manejarEnter = (e) => {
    if (e.key === 'Enter') enviarMensaje();
  };

  const iniciarEscucha = () => {
    if (grabando) {
      recognitionRef.current?.stop();
      setGrabando(false);
    } else {
      recognitionRef.current?.start();
      setGrabando(true);
    }
  };

  return (
<div className="chatbot-widget-background">
      {modoVozActivo && (
        <VoiceMode
          onClose={() => setModoVozActivo(false)}
          onSend={(mensaje) => enviarMensajeDesdeVoz(mensaje)}
        />
      )}

      <img src="/bot-plantas.png" alt="Asistente Bot" className="embedded-bot" />
      <div className="chatbot-card mx-auto w-100">
        <div className="mb-3 text-center chatbot-header">
          <h5>Asistente de Vivero en Línea 🌿</h5>
          <h5>Agente verde</h5>
          <small className="text-muted">Hazme preguntas o recibe recomendaciones personalizadas</small>
        </div>

        <div className="text-center mb-3 d-flex justify-content-center flex-wrap gap-2">
          <button className="btn btn-success btn-sm" onClick={iniciarRecomendador}>
            <FaLeaf /> Recomendador de Plantas
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={finalizarConversacion}>
            ❌ Finalizar Conversación
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={limpiarConversacion}>
            🧹 Nueva Conversación
          </button>
        </div>

        <div ref={chatRef} className="chatbot-body mb-3">
          {mensajes.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`d-flex ${msg.from === 'usuario' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
            >
              <div className={`chatbot-message ${msg.from === 'usuario' ? 'chatbot-user' : 'chatbot-bot'}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}

          {preguntaActual && (
            <div className="text-center mb-2 fw-bold chatbot-question">{preguntaActual}</div>
          )}

          {opciones.length > 0 && (
            <div className="d-flex flex-wrap gap-2 p-2 justify-content-center chatbot-options">
              {opciones.map(op => (
                <button key={op} className="btn btn-outline-primary btn-sm" onClick={() => enviarMensaje(op)}>
                  {op}
                </button>
              ))}
            </div>
          )}

          {Array.isArray(recomendacionFinal) && recomendacionFinal.length > 0 && (
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
              {recomendacionFinal.map((planta, index) => (
                <div key={index} className="card chatbot-recommendation-card">
                  <img
                    src={planta.imagen}
                    className="card-img-top"
                    alt={planta.nombre}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{planta.nombre}</h5>
                    <p className="card-text">{planta.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cargando && (
            <div className="text-start text-muted small ps-2">Escribiendo...</div>
          )}
        </div>

        <div className="chatbot-footer input-group">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Escribe tu mensaje o usa el micrófono..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={manejarEnter}
          />
          <button className="btn btn-success" onClick={() => enviarMensaje()} title="Enviar texto">
            <FaPaperPlane />
          </button>
          <button
            className={`btn ${grabando ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={iniciarEscucha}
            title="Hablar rápido"
          >
            <FaMicrophone />
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={() => setModoVozActivo(true)}
            title="Modo de Voz tipo llamada"
          >
            <FaHeadphones />
          </button>
        </div>

        <AnimatePresence>
          {grabando && (
            <motion.div
              className="microphone-bubble"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="bubble-inner"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ChatbotWidget;


