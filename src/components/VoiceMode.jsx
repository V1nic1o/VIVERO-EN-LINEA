import { useEffect, useRef, useState } from 'react';
import { FaLeaf, FaStopCircle, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './VoiceMode.css';

function VoiceMode({ onClose, onSend }) {
  const [hablando, setHablando] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);
  const [ultimoMensajeReconocido, setUltimoMensajeReconocido] = useState('');
  const recognitionRef = useRef(null);
  const ultimaFraseRef = useRef('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setEscuchando(true);
    recognition.onresult = (event) => {
      const mensaje = event.results[0][0].transcript;
      ultimaFraseRef.current = mensaje;
      setUltimoMensajeReconocido(mensaje);
    };
    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setMensajeError('No se detectó voz. Intenta hablar con más claridad 🌿');
        setTimeout(() => setMensajeError(''), 3000);
      }
    };
    recognition.onend = () => setEscuchando(false);

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const dividirTexto = (texto, maximo = 220) => {
    const frases = texto.split(/(?<=[.?!])\s+/);
    const bloques = [];
    let actual = '';

    for (const frase of frases) {
      if ((actual + frase).length > maximo) {
        if (actual) bloques.push(actual.trim());
        actual = frase + ' ';
      } else {
        actual += frase + ' ';
      }
    }

    if (actual.trim()) bloques.push(actual.trim());
    return bloques;
  };

  const hablarTextoDividido = async (texto) => {
    const partes = dividirTexto(texto);

    // 1. Asegurar que las voces estén disponibles
    await new Promise((resolve) => {
      let voces = window.speechSynthesis.getVoices();
      if (voces.length) return resolve();
      window.speechSynthesis.onvoiceschanged = resolve;
    });

    const vocesDisponibles = window.speechSynthesis.getVoices();
    const vozGoogle = vocesDisponibles.find(
      v => v.lang === 'es-ES' && v.name.toLowerCase().includes('google')
    );

    window.speechSynthesis.cancel();
    setHablando(true);

    // 2. Esperar si aún hay alguna reproducción previa
    await new Promise(resolve => {
      if (!window.speechSynthesis.speaking) resolve();
      else {
        const interval = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });

    // 3. Reproducir parte por parte de forma secuencial
    for (const parte of partes) {
      await new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(parte);
        utterance.lang = 'es-ES';
        if (vozGoogle) utterance.voice = vozGoogle;
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.onend = () => setTimeout(resolve, 300);
        window.speechSynthesis.speak(utterance);
      });
    }

    setHablando(false);
  };

  const iniciarEscucha = () => {
    if (recognitionRef.current && !grabando) {
      ultimaFraseRef.current = '';
      setUltimoMensajeReconocido('');
      recognitionRef.current.start();
      setGrabando(true);
    }
  };

  const detenerEscuchaYResponder = () => {
    if (recognitionRef.current && grabando) {
      recognitionRef.current.stop();
      setGrabando(false);
      const mensaje = ultimaFraseRef.current?.trim();

      if (mensaje && mensaje.length > 0) {
        setEsperandoRespuesta(true);
        window.speechSynthesis.cancel();

        onSend(mensaje).then(respuestaBot => {
          setEsperandoRespuesta(false);
          hablarTextoDividido(respuestaBot);
        }).catch(err => {
          setEsperandoRespuesta(false);
          console.error('❌ Error al procesar respuesta del bot:', err);
        });

        ultimaFraseRef.current = '';
      }
    }
  };

  const finalizarConversacion = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    setGrabando(false);
    setEscuchando(false);
    onClose();
  };

  return (
    <div className="voice-mode-container">
      <div className="voice-header">
        <FaLeaf size={24} style={{ marginRight: 10 }} />
        <span>Modo Conversación Manual 🌿</span>
      </div>

      <div className="voice-avatar-section">
        <img src="/bot-plantas.png" alt="Bot Planta" className="bot-avatar" />
        <p className="voice-subtitle">
          Activa el micrófono, habla, luego apágalo para que el asistente responda 🌱
        </p>
      </div>

      <div className="voice-waveform">
        {escuchando && (
          <motion.div className="wave escuchando" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
        )}
        {hablando && (
          <motion.div className="wave hablando" animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        )}
      </div>

      {ultimoMensajeReconocido && (
        <div className="mensaje-reconocido">
          <strong>📥 Reconocido:</strong> {ultimoMensajeReconocido}
        </div>
      )}

      <div className="voice-controls">
        {!grabando ? (
          <button className="btn-mic" onClick={iniciarEscucha}>
            <FaMicrophone /> Activar micrófono
          </button>
        ) : (
          <button className="btn-mic-off" onClick={detenerEscuchaYResponder}>
            <FaMicrophoneSlash /> Apagar micrófono
          </button>
        )}
        <button className="btn-salir" onClick={finalizarConversacion}>
          <FaStopCircle size={20} /> Finalizar conversación
        </button>
      </div>

      <AnimatePresence>
        {mensajeError && (
          <motion.div className="mensaje-error-voz" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.5 }}>
            {mensajeError}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {esperandoRespuesta && (
          <motion.div className="mensaje-espera-voz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.4 }}>
            Esperando respuesta del asistente...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default VoiceMode;
