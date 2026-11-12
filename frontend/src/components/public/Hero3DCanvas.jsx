import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Metallic Gym Monogram / Interlocking Strength Rings
function SculptedInsignia() {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const coreHubRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = 0.4 + Math.sin(t * 0.4) * 0.15;
      outerRingRef.current.rotation.y += delta * 0.25;
      outerRingRef.current.rotation.z = Math.cos(t * 0.3) * 0.1;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -0.3 + Math.cos(t * 0.35) * 0.15;
      innerRingRef.current.rotation.y -= delta * 0.35;
      innerRingRef.current.rotation.z = Math.sin(t * 0.25) * 0.12;
    }

    if (coreHubRef.current) {
      coreHubRef.current.rotation.y += delta * 0.5;
      coreHubRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    }

    // Interactive mouse cursor parallax tilt
    if (state.pointer) {
      state.camera.position.x = THREE.MathUtils.lerp(
        state.camera.position.x,
        state.pointer.x * 0.6,
        0.05
      );
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        state.pointer.y * 0.4,
        0.05
      );
      state.camera.lookAt(0, 0, 0);
    }
  });

  // Materials: Deep Gunmetal and Brushed Metallic Gold
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4af37'),
        metalness: 0.95,
        roughness: 0.22,
        emissive: new THREE.Color('#382806'),
        emissiveIntensity: 0.25,
      }),
    []
  );

  const gunmetalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1c202a'),
        metalness: 0.9,
        roughness: 0.3,
      }),
    []
  );

  const crimsonAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#dc2626'),
        metalness: 0.85,
        roughness: 0.25,
        emissive: new THREE.Color('#7f1d1d'),
        emissiveIntensity: 0.3,
      }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Calibrated Torus */}
      <mesh ref={outerRingRef} material={goldMaterial}>
        <torusGeometry args={[2.0, 0.07, 32, 100]} />
      </mesh>

      {/* Counter-rotating Inner Heavy Ring */}
      <mesh ref={innerRingRef} material={gunmetalMaterial}>
        <torusGeometry args={[1.5, 0.09, 32, 100]} />
      </mesh>

      {/* Floating Central Core Monogram / Octahedron Crest */}
      <group ref={coreHubRef}>
        <mesh material={crimsonAccentMaterial}>
          <octahedronGeometry args={[0.7, 0]} />
        </mesh>

        {/* High-tension accent collar */}
        <mesh material={goldMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        </mesh>
      </group>

      {/* Orbiting Satellite Floating Plates */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh position={[2.8, 1.2, -1.2]} material={goldMaterial}>
          <cylinderGeometry args={[0.5, 0.5, 0.08, 32]} />
        </mesh>
      </Float>

      <Float speed={1.7} rotationIntensity={1.5} floatIntensity={1.8}>
        <mesh position={[-2.7, -1.1, -0.8]} material={gunmetalMaterial}>
          <cylinderGeometry args={[0.65, 0.65, 0.1, 32]} />
        </mesh>
      </Float>

      <Float speed={2.4} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[-2.2, 1.6, -1.5]} material={crimsonAccentMaterial}>
          <torusGeometry args={[0.4, 0.05, 16, 32]} />
        </mesh>
      </Float>

      <Float speed={1.9} rotationIntensity={1.1} floatIntensity={1.4}>
        <mesh position={[2.4, -1.4, -1.0]} material={goldMaterial}>
          <octahedronGeometry args={[0.35, 0]} />
        </mesh>
      </Float>
    </group>
  );
}

// Cinematic particle dust
function AtmosphericEmbers() {
  return (
    <Sparkles
      count={120}
      scale={[10, 8, 8]}
      size={2.5}
      speed={0.4}
      opacity={0.65}
      color="#e6c66e"
    />
  );
}

// Fallback when WebGL is loading or unavailable
function FallbackCanvas() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-radial from-brand-950/20 via-black to-black">
      <div className="h-72 w-72 rounded-full border border-brand-500/20 bg-brand-500/5 blur-3xl animate-pulse" />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <FallbackCanvas />;
    return this.props.children;
  }
}

export default function Hero3DCanvas({ className = '' }) {
  return (
    <div className={`relative h-full w-full pointer-events-none select-none ${className}`}>
      <ErrorBoundary>
        <Suspense fallback={<FallbackCanvas />}>
          <Canvas
            camera={{ position: [0, 0, 6.8], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              alpha: true,
            }}
            className="h-full w-full"
          >
            {/* Ambient Base Light */}
            <ambientLight intensity={0.6} />

            {/* Warm Metallic Gold Key Light */}
            <pointLight position={[6, 4, 5]} intensity={18} color="#f6d365" distance={15} />

            {/* Crimson Fill Light */}
            <pointLight position={[-6, -3, 3]} intensity={22} color="#dc2626" distance={15} />

            {/* Subtle Cyan Rim Highlight */}
            <directionalLight position={[0, 6, -3]} intensity={3.5} color="#60a5fa" />

            {/* 3D Insignia and Orbiting Weight Objects */}
            <SculptedInsignia />

            {/* Atmospheric Drifting Embers */}
            <AtmosphericEmbers />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
