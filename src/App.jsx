import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// City environment backdrops (Buildings / Road)
function UrbanEnvironment() {
  return (
    <group>
      {/* City Road left side */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-35, 0.01, 0]}>
        <planeGeometry args={[15, 80]} />
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </mesh>
      {/* Decorative High rises left & back */}
      <mesh position={[-45, 12, 0]}>
        <boxGeometry args={[5, 24, 70]} />
        <meshStandardMaterial color="#4a5568" roughness={0.9} />
      </mesh>
      <mesh position={[0, 15, -45]}>
        <boxGeometry args={[80, 30, 8]} />
        <meshStandardMaterial color="#718096" roughness={0.9} />
      </mesh>
    </group>
  );
}

function LargeStage({ videoId }) {
  return (
    <group position={[18, 0, -5]}>
      {/* Platform */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[16, 2.5, 10]} />
        <meshStandardMaterial color="#111" roughness={0.8} />
      </mesh>
      {/* Stage scaffold side towers */}
      <mesh position={[-7.5, 5.5, 4.5]}>
        <cylinderGeometry args={[0.15, 0.15, 11]} />
        <meshStandardMaterial color="#718096" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[7.5, 5.5, 4.5]}>
        <cylinderGeometry args={[0.15, 0.15, 11]} />
        <meshStandardMaterial color="#718096" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Overhead banner truss support */}
      <mesh position={[0, 10.5, 4.5]}>
        <boxGeometry args={[16, 0.8, 0.4]} />
        <meshStandardMaterial color="#1a202c" />
      </mesh>
      
      {/* Stage Front banners (Bilingual Text in standard style) */}
      <Html position={[0, 10.51, 4.8]} center distanceFactor={18}>
        <div style={{
          background: '#000', color: '#fff', padding: '5px 25px', 
          border: '2px solid #fff', borderRadius: '4px', textAlign: 'center',
          fontFamily: 'sans-serif', whiteSpace: 'nowrap'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>न्याय के लिए हम एक हैं!</h2>
          <span style={{ fontSize: '12px' }}>लोकतंत्र बचाओ • विरोध प्रदर्शन</span>
        </div>
      </Html>

      {/* Main Broadcast Screen Backdrop (Right visual block) */}
      <group position={[0, 6, 0.5]}>
        <mesh>
          <boxGeometry args={[14.5, 8.2, 0.4]} />
          <meshStandardMaterial color="#080808" />
        </mesh>
        
        {/* Dynamic Youtube IFrame embed Screen */}
        <Html transform occlude position={[0, 0, 0.22]} distanceFactor={6.2}>
          <div style={{ width: '800px', height: '450px', background: '#000', display: 'flex', flexDirection: 'column' }}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
              title="Protest Livestream Feed"
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

// 2D Crowd with placard holding and Flag textures (optimized instanced sprites)
function DenseCrowd({ count = 500 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const crowdData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      // Crowd scatters around the stage plaza
      const x = (Math.random() - 0.5) * 38;
      const z = 8 + Math.random() * 25; // in front of camera & right side plaza
      const speed = 1.0 + Math.random() * 2;
      const offset = Math.random() * Math.PI * 2;
      // random placard scale
      const sizeY = 1.4 + Math.random() * 0.4;
      data.push({ x, z, speed, offset, sizeY });
    }
    return data;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    crowdData.forEach((person, i) => {
      // jump and hand wavings simulated oscillation 
      const y = Math.max(0, Math.sin(t * person.speed + person.offset) * 0.18);
      dummy.position.set(person.x, (person.sizeY/2) + y, person.z);
      dummy.lookAt(18, 4, -5); // everyone looks at Stage
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <capsuleGeometry args={[0.25, 1.3, 4, 8]} />
      {/* High-contrast human and protester look color variety */}
      <meshStandardMaterial color="#2d3748" roughness={0.8} />
    </instancedMesh>
  );
}

// Floor Ground tiles
function PlazaGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4a5568" roughness={0.9} />
    </mesh>
  );
}

export default function App() {
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');
  const [inputUrl, setInputUrl] = useState('');

  const handleUpdateStream = (e) => {
    e.preventDefault();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = inputUrl.match(regExp);
    if (match && match[2].length === 11) {
      setVideoId(match[2]);
      setInputUrl('');
    } else {
      alert('Invalid URL');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic admin interface */}
      <div style={{
        position: 'absolute', top: 15, left: 15, zIndex: 10,
        background: 'rgba(26,32,44, 0.9)', border: '1px solid #4a5568',
        backdropFilter: 'blur(10px)', padding: '12px 16px', borderRadius: '8px',
        color: '#fff', fontFamily: 'sans-serif', maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>✊ Digital Protest Area</h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#cbd5e0' }}>
          Real urban square environment with high intensity dynamic rally.
        </p>

        <form onSubmit={handleUpdateStream} style={{ display: 'flex', gap: '5px' }}>
          <input
            type="text" value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Change YouTube Broadcast URL"
            style={{
              flex: 1, padding: '5px 8px', fontSize: '12px',
              borderRadius: '4px', border: '1px solid #4a5568',
              background: '#2d3748', color: '#fff'
            }}
          />
          <button type="submit" style={{
            background: '#e53e3e', color: '#fff', border: 'none',
            padding: '5px 10px', fontSize: '11px', borderRadius: '4px', fontWeight: 'bold'
          }}>Update</button>
        </form>
      </div>

      <Canvas camera={{ position: [0, 8, 25], fov: 60 }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[20, 30, 20]} intensity={1.4} castShadow />
        <pointLight position={[18, 12, -2]} intensity={2.5} />
        
        <UrbanEnvironment />
        <PlazaGround />
        <LargeStage videoId={videoId} />
        <DenseCrowd count={480} />
        
        <OrbitControls
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={5}
          maxDistance={45}
        />
      </Canvas>
    </div>
  );
}
