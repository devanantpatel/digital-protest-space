import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. Zameen (Protest Ground)
function ProtestGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[70, 70]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
  );
}

// 2. Main Live Screen
function MainScreen({ videoId, notice }) {
  return (
    <group position={[0, 5, -14]}>
      {/* Screen Frame & Stand */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[16.5, 9.5, 0.4]} />
        <meshStandardMaterial color="#080808" />
      </mesh>
      <mesh position={[-6, -4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[6, -4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Screen Display */}
      <Html transform occlude position={[0, 0, 0.22]} distanceFactor={7.5}>
        <div style={{ width: '800px', height: '450px', background: '#000', display: 'flex', flexDirection: 'column' }}>
          {notice && (
            <div style={{ background: '#d32f2f', color: '#fff', padding: '6px 12px', fontSize: '18px', fontWeight: 'bold' }}>
              📢 ANNOUNCEMENT: {notice}
            </div>
          )}
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

// 3. Optimized 3D Crowd (InstancedMesh - No Lag)
function ProtestCrowd({ count = 250 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Har bande ki position screen ke aage scatter hogi
  const crowdData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 28;
      const z = -2 - Math.random() * 18; // screen ke samne
      const speed = 1.5 + Math.random() * 2;
      const offset = Math.random() * Math.PI * 2;
      data.push({ x, z, speed, offset });
    }
    return data;
  }, [count]);

  // Chant / Naare lagane jaisa subtle jumping motion
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    crowdData.forEach((person, i) => {
      const y = Math.max(0, Math.sin(t * person.speed + person.offset) * 0.15);
      dummy.position.set(person.x, 1 + y, person.z);
      // Avatars hamesha thoda screen ki taraf face karenge
      dummy.lookAt(0, 4, -14);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* Capsule shape body jo door se realistic low-poly character lage */}
      <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
      <meshStandardMaterial color="#4a5568" roughness={0.7} />
    </instancedMesh>
  );
}

export default function App() {
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');
  const [notice, setNotice] = useState('Welcome to the Digital Protest Space!');
  const [inputUrl, setInputUrl] = useState('');

  // YouTube URL se direct Video ID nikalne ka logic
  const handleUpdateStream = (e) => {
    e.preventDefault();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    if (match && match[2].length === 11) {
      setVideoId(match[2]);
      setInputUrl('');
    } else {
      alert('Invalid YouTube URL');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Floating Admin & Control Bar */}
      <div style={{
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 10,
        background: 'rgba(15, 15, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '12px 16px',
        borderRadius: '10px',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        maxWidth: '320px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>✊ Digital Protest HQ</h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999' }}>
          Drag to rotate view | 250+ Protesters in ground
        </p>

        {/* Quick Stream Changer (Admin prototype) */}
        <form onSubmit={handleUpdateStream} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            placeholder="Paste YouTube Live Link"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 8px',
              fontSize: '12px',
              borderRadius: '4px',
              border: '1px solid #444',
              background: '#222',
              color: '#fff'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              background: '#e53e3e',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Live
          </button>
        </form>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 4, 8], fov: 65 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} />
        <pointLight position={[0, 6, -10]} intensity={2} color="#ffffff" />
        
        <ProtestGround />
        <MainScreen videoId={videoId} notice={notice} />
        <ProtestCrowd count={250} />
        
        <OrbitControls
          maxPolarAngle={Math.PI / 2 - 0.02}
          minDistance={3}
          maxDistance={25}
        />
      </Canvas>
    </div>
  );
}
