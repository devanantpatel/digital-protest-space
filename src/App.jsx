import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sky, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// 1. Realistic Road & Plaza Floor
function Ground() {
  return (
    <group>
      {/* Main Plaza Pavement */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#b0b5bc" roughness={0.7} />
      </mesh>
      {/* Grid pattern illusion for street tiles */}
      <gridHelper args={[100, 50, '#718096', '#cbd5e1']} position={[0, 0.01, 0]} />
    </group>
  );
}

// 2. Realistic Stage Structure & Lighting Rig
function RallyStage({ videoId }) {
  return (
    <group position={[14, 0, -4]}>
      {/* Wooden / Concrete Stage Base */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[16, 2.4, 9]} />
        <meshStandardMaterial color="#2d3748" roughness={0.6} />
      </mesh>

      {/* Metal Truss Towers */}
      <mesh position={[-7.5, 6, 4]}>
        <cylinderGeometry args={[0.15, 0.15, 12]} />
        <meshStandardMaterial color="#cbd5e0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[7.5, 6, 4]}>
        <cylinderGeometry args={[0.15, 0.15, 12]} />
        <meshStandardMaterial color="#cbd5e0" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 11.5, 4]}>
        <boxGeometry args={[15.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#cbd5e0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main Top Slogan Banner */}
      <Html position={[0, 11.6, 4.2]} center distanceFactor={14}>
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '8px 24px',
          border: '2px solid #ef4444',
          borderRadius: '6px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '1px' }}>
            न्याय के लिए हम एक हैं!
          </h2>
          <span style={{ fontSize: '13px', color: '#f87171', fontWeight: 'bold' }}>
            लोकतंत्र बचाओ • विरोध प्रदर्शन मंच
          </span>
        </div>
      </Html>

      {/* Big Screen Display */}
      <group position={[0, 6.2, 0.2]}>
        <mesh>
          <boxGeometry args={[14.2, 8.2, 0.3]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        <Html transform occlude position={[0, 0, 0.18]} distanceFactor={6.2}>
          <div style={{ width: '800px', height: '460px', background: '#000' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
              title="Broadcast"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </Html>
      </group>
    </group>
  );
}

// 3. Realistic Crowd using Colored Billboard Cutouts with Flags
function HumanCrowd({ count = 350 }) {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const meshRef = useRef();

  // Distinct rally colors (White kurta, saffron, green, blue shirts)
  const clothesColors = ['#f8fafc', '#ea580c', '#16a34a', '#2563eb', '#dc2626', '#475569'];

  const people = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 32;
      const z = 4 + Math.random() * 22;
      const height = 1.6 + Math.random() * 0.3;
      const speed = 2 + Math.random() * 3;
      const offset = Math.random() * Math.PI * 2;
      const color = clothesColors[Math.floor(Math.random() * clothesColors.length)];
      list.push({ x, z, height, speed, offset, color });
    }
    return list;
  }, [count]);

  return (
    <group>
      {people.map((p, idx) => (
        <group key={idx} position={[p.x, p.height / 2, p.z]}>
          {/* Billboard face camera automatically */}
          <Billboard follow={true}>
            {/* Torso/Body */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.65, p.height]} />
              <meshStandardMaterial color={p.color} roughness={0.5} />
            </mesh>
            {/* Head */}
            <mesh position={[0, p.height * 0.55, 0]}>
              <circleGeometry args={[0.2, 16]} />
              <meshStandardMaterial color="#fcd34d" />
            </mesh>
            {/* Placard / Signboards for some users */}
            {idx % 4 === 0 && (
              <mesh position={[0.3, p.height * 0.7, 0]}>
                <planeGeometry args={[0.7, 0.45]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            )}
          </group>
        </group>
      ))}
    </group>
  );
}

// 4. Background Cityscape / Buildings
function CityBackdrop() {
  return (
    <group position={[-25, 0, -25]}>
      {/* Building blocks */}
      <mesh position={[0, 15, 0]}>
        <boxGeometry args={[14, 30, 14]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>
      <mesh position={[18, 18, -10]}>
        <boxGeometry args={[16, 36, 12]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
      <mesh position={[-18, 12, 10]}>
        <boxGeometry args={[14, 24, 15]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function App() {
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');
  const [inputUrl, setInputUrl] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    if (match && match[2].length === 11) {
      setVideoId(match[2]);
      setInputUrl('');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Top Floating Control Bar */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 10,
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
        padding: '10px 14px', borderRadius: '8px', color: '#fff',
        fontFamily: 'sans-serif', maxWidth: '320px', border: '1px solid #334155'
      }}>
        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>✊ Digital Rally HQ</h4>
        <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            placeholder="Paste YouTube Live Link"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            style={{
              flex: 1, padding: '6px 8px', fontSize: '12px',
              borderRadius: '4px', border: '1px solid #475569',
              background: '#1e293b', color: '#fff'
            }}
          />
          <button type="submit" style={{
            background: '#ef4444', color: '#fff', border: 'none',
            borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold'
          }}>
            Live
          </button>
        </form>
      </div>

      <Canvas camera={{ position: [0, 6, 22], fov: 60 }}>
        {/* Realistic Sky with Sun position */}
        <Sky sunPosition={[100, 30, 100]} turbidity={8} rayleigh={3} />
        
        {/* Sunlight & Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[50, 80, 50]} intensity={2.2} castShadow />

        <CityBackdrop />
        <Ground />
        <RallyStage videoId={videoId} />
        <HumanCrowd count={350} />

        <OrbitControls
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={4}
          maxDistance={40}
        />
      </Canvas>
    </div>
  );
}
