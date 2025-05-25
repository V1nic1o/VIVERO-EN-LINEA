// src/components/HeroChatbot.jsx
import './HeroChatbot.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

function Modelo3D() {
  const gltf = useGLTF('https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Duck/glTF-Binary/Duck.glb');
  return <primitive object={gltf.scene} scale={1.5} />;
}

export default function HeroChatbot() {
  return (
    <div className="hero-container">
      <div className="hero-text">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Conoce a tu Asistente Inteligente
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          Un chatbot que entiende, aprende, recomienda y evoluciona contigo.
        </motion.p>
      </div>
      <div className="hero-model">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} />
          <Suspense fallback={null}>
            <Modelo3D />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate />
        </Canvas>
      </div>
    </div>
  );
}
