import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

function ProtestGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#222222" roughness={0.8} />
    </mesh>
  );
}

function MainScreen({ videoId }) {
  return (
    <group position={[0, 4, -12]}>
      {/* स्क्रीन का फ्रेम */}
      <mesh>
        <boxGeometry args={[14.5, 8.5, 0.4]} />
        <meshStandardMaterial color="#050505" />
      </mesh>

      {/* यूट्यूब लाइव स्क्रीन */}
      <Html transform occlude position={[0, 0, 0.22]} distanceFactor={7}>
        <div style={{ width: '720px', height: '405px', background: '#000' }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
            title="Protest Stream"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </Html>
    </group>
  );
}

export default function App() {
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ'); // डिफ़ॉल्ट वीडियो आईडी

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* UI कंट्रोल बार */}
      <div style={{
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 10,
        background: 'rgba(0,0,0,0.7)',
        padding: '10px 15px',
        borderRadius: '8px',
        color: '#fff',
        fontFamily: 'sans-serif'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Digital Protest Space</h3>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#aaa' }}>
          स्क्रीन घुमाने के लिए ड्रैग करें
        </p>
      </div>

      {/* 3D कैनवास */}
      <Canvas camera={{ position: [0, 3, 10], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 15]} intensity={1.2} />
        <ProtestGround />
        <MainScreen videoId={videoId} />
        <OrbitControls maxPolarAngle={Math.PI / 2 - 0.05} />
      </Canvas>
    </div>
  );
}
