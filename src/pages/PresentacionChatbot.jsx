// src/pages/PresentacionChatbot.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import './PresentacionChatbot.css';

const secciones = [
  {
    titulo: '🤖 Asistente Verde: Inteligencia Natural Aplicada',
    descripcion:
      'Bienvenido a un chatbot conversacional avanzado, diseñado para mantener una conversación fluida, coherente y con memoria real. Capaz de hablar, razonar y aprender. Presiona la barra espaciadora para iniciar esta presentación técnica.',
    fondo: 'fondo1',
  },
  {
    titulo: '🧠 Comprensión y memoria conversacional',
    descripcion:
      'El bot comprende lenguaje natural usando procesamiento NLP y mantiene la conversación con contexto, incluso en respuestas complejas como "¿Y otra parecida?". Ya no repite ni olvida, adapta su lógica al usuario.',
    fondo: 'fondo2',
  },
  {
    titulo: '📚 Aprendizaje automático pasivo',
    descripcion:
      'Cada vez que el bot responde de forma intuitiva, esa respuesta se guarda en su propia base de conocimientos. La próxima vez, responde desde memoria. Aprende de verdad.',
    fondo: 'fondo3',
  },
  {
    titulo: '🌿 Recomendador inteligente de plantas',
    descripcion:
      'El bot guía al usuario por una serie de preguntas y filtra resultados desde su base de datos: tamaño, luz, riego, cuidado y si purifica el aire. Ideal para quienes no tienen experiencia en jardinería.',
    fondo: 'fondo5',
  },
  {
    titulo: '🔊 Interacción por voz natural y continua',
    descripcion:
      'Con solo presionar un botón, puedes hablar con el bot. Usa la Web Speech API para convertir voz a texto y luego responde con voz hablada, creando una experiencia tipo llamada profesional, sin interrupciones ni comandos fijos.',
    fondo: 'fondo4',
  },
  {
    titulo: '💬 Simulación en tiempo real',
    typing: true,
    fondo: 'fondo5',
  },
  {
    titulo: '🛠️ Stack de tecnologías',
    descripcion:
      'Frontend en React + Vite + Framer Motion. Backend en Node.js + Express + Sequelize. Base de datos PostgreSQL. Reconocimiento y síntesis de voz con Web Speech API. Cloudinary para imágenes. Arquitectura modular (ORM) y escalable.',
    fondo: 'fondo3',
  },
  {
    titulo: '🚀 ¡Interactúa tú mismo!',
    descripcion:
      'Ahora es tu turno de hablar con el bot. Puedes pedir recomendaciones, plantear situaciones o simplemente conversar. Este asistente fue creado para sorprender y servir con empatía e inteligencia.',
    fondo: 'fondo6',
    cta: true,
  },
];

export default function PresentacionChatbot() {
  const [index, setIndex] = useState(0);

  const avanzar = () => {
    setIndex((prev) => (prev < secciones.length - 1 ? prev + 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        avanzar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`presentacion fondo ${secciones[index].fondo}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="slide"
          initial={{
            opacity: 0,
            y: 100,
            scale: 0.95,
            filter: 'blur(5px)',
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          exit={{
            opacity: 0,
            y: -100,
            scale: 1.05,
            filter: 'blur(3px)',
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Título animado con gradiente */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {secciones[index].titulo}
          </motion.h1>

          {/* Simulación typing o descripción */}
          {secciones[index].typing ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="chat-simulado"
            >
              <div className="burbuja usuario">
                ¿Puedes recomendarme una planta para interiores?
              </div>
              <div className="burbuja bot">
                <span className="escribiendo">
                  <Typewriter
                    words={[
                      'Claro 🌿, te recomiendo una Sansevieria. Requiere poca luz y es fácil de cuidar.',
                    ]}
                    loop={1}
                    cursor
                    typeSpeed={50}
                    deleteSpeed={0}
                    delaySpeed={1000}
                  />
                </span>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                {secciones[index].descripcion}
              </motion.p>

              {secciones[index].cta && (
                <motion.button
                  className="cta-button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  onClick={() => (window.location.href = '/chatbot')}
                >
                  Ir al chatbot
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
