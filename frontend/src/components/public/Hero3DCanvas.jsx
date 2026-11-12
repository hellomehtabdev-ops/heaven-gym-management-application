import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Checks whether WebGL is supported by the client browser.
 */
function isWebGLSupported() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * 3D Sculpted Olympic Barbell Weight Plate & Strength Crest
 * Communicates authentic gym strength, precision engineering, and luxury fitness.
 */
function OlympicStrengthPlate({ isMobile = false }) {
  const mainPlateRef = useRef();
  const innerRingRef = useRef();
  const centerHubRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Smooth rotational drifting of the main Olympic plate
    if (mainPlateRef.current) {
      mainPlateRef.current.rotation.x = 0.35 + Math.sin(t * 0.35) * 0.1;
      mainPlateRef.current.rotation.y += delta * 0.22;
      mainPlateRef.current.rotation.z = Math.cos(t * 0.25) * 0.08;
    }

    // Counter-rotating calibrated inner gold ring
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -0.25 + Math.cos(t * 0.3) * 0.12;
      innerRingRef.current.rotation.y -= delta * 0.28;
    }

    // Subtle breathing pulse of center Olympic sleeve hub
    if (centerHubRef.current) {
      centerHubRef.current.rotation.y += delta * 0.4;
      centerHubRef.current.position.y = Math.sin(t * 0.7) * 0.06;
    }

    // Subtle pointer parallax tilt on desktop
    if (!isMobile && state.pointer) {
      state.camera.position.x = THREE.MathUtils.lerp(
        state.camera.position.x,
        state.pointer.x * 0.45,
        0.04
      );
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        state.pointer.y * 0.3,
        0.04
      );
      state.camera.lookAt(0, 0, 0);
    }
  });

  // Premium Materials: Brushed Metallic Gold & Matte Gunmetal Steel
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4af37'),
        metalness: 0.92,
        roughness: 0.24,
        emissive: new THREE.Color('#382806'),
        emissiveIntensity: 0.2,
      }),
    []
  );

  const gunmetalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#141720'),
        metalness: 0.88,
        roughness: 0.32,
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
        emissiveIntensity: 0.25,
      }),
    []
  );

  const radialSegments = isMobile ? 36 : 64;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Calibrated Olympic Plate Body */}
      <group ref={mainPlateRef}>
        {/* Outer Heavy Steel Rim */}
        <mesh material={gunmetalMaterial}>
          <cylinderGeometry args={[2.3, 2.3, 0.16, radialSegments]} />
        </mesh>

        {/* Raised Outer Edge Ring (Plate Flange) */}
        <mesh material={goldMaterial}>
          <torusGeometry args={[2.25, 0.08, 16, radialSegments]} />
        </mesh>

        {/* Inner Recessed Weight Channel */}
        <mesh material={gunmetalMaterial} position={[0, 0, 0]}>
          <cylinderGeometry args={[1.7, 1.7, 0.12, radialSegments]} />
        </mesh>

        {/* Dual Ergonomic Hand-Grip Cutout Inserts */}
        <mesh material={goldMaterial} position={[1.25, 0, 0]}>
          <torusGeometry args={[0.32, 0.04, 12, 24]} />
        </mesh>
        <mesh material={goldMaterial} position={[-1.25, 0, 0]}>
          <torusGeometry args={[0.32, 0.04, 12, 24]} />
        </mesh>
      </group>

      {/* 2. Counter-Rotating Precision Calibrated Gold Ring */}
      <mesh ref={innerRingRef} material={goldMaterial}>
        <torusGeometry args={[1.45, 0.06, 16, radialSegments]} />
      </mesh>

      {/* 3. Center Olympic Barbell Sleeve Collar Hub */}
      <group ref={centerHubRef}>
        {/* Central Olympic Barbell Sleeve Hub */}
        <mesh material={goldMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.32, radialSegments]} />
        </mesh>

        {/* Knurled Collar Ring Accent */}
        <mesh material={crimsonAccentMaterial} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.08, radialSegments]} />
        </mesh>

        {/* Core Insignia Emblem Accent */}
        <mesh material={goldMaterial} position={[0, 0, 0.18]}>
          <boxGeometry args={[0.22, 0.22, 0.04]} />
        </mesh>
      </group>

      {/* 4. Satellite Floating Dumbbell Plates */}
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[2.7, 1.3, -1.0]} material={goldMaterial}>
          <cylinderGeometry args={[0.48, 0.48, 0.07, isMobile ? 24 : 36]} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1.0} floatIntensity={1.4}>
        <mesh position={[-2.6, -1.2, -0.8]} material={gunmetalMaterial}>
          <cylinderGeometry args={[0.55, 0.55, 0.09, isMobile ? 24 : 36]} />
        </mesh>
      </Float>

      <Float speed={2.0} rotationIntensity={0.6} floatIntensity={1.0}>
        <mesh position={[-2.1, 1.5, -1.2]} material={crimsonAccentMaterial}>
          <torusGeometry args={[0.36, 0.05, 12, isMobile ? 24 : 32]} />
        </mesh>
      </Float>
    </group>
  );
}

/**
 * Atmospheric embers drifting with gold and warm amber glow
 */
function AtmosphericEmbers({ isMobile = false }) {
  return (
    <Sparkles
      count={isMobile ? 35 : 90}
      scale={[8, 7, 7]}
      size={isMobile ? 2.0 : 2.6}
      speed={0.35}
      opacity={0.6}
      color="#e6c66e"
    />
  );
}

/**
 * Lightweight luxury fallback displayed when WebGL is unsupported, disabled,
 * or when the user prefers reduced motion.
 */
function FallbackCanvas() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-radial from-brand-950/25 via-[#050608] to-[#050608]">
      <div className="h-64 w-64 sm:h-80 sm:w-80 rounded-full border border-amber-500/20 bg-gradient-to-tr from-amber-500/10 via-brand-500/5 to-transparent blur-3xl animate-pulse" />
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
  componentDidCatch() {
    // Graceful degradation when Three.js fails or WebGL context is lost
  }
  render() {
    if (this.state.hasError) return <FallbackCanvas />;
    return this.props.children;
  }
}

export default function Hero3DCanvas({ className = '' }) {
  const [supported, setSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setSupported(isWebGLSupported());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      mq.removeEventListener?.('change', handler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!supported || reducedMotion) {
    return <FallbackCanvas />;
  }

  return (
    <div className={`relative h-full w-full pointer-events-none select-none ${className}`}>
      <ErrorBoundary>
        <Suspense fallback={<FallbackCanvas />}>
          <Canvas
            camera={{ position: [0, 0, isMobile ? 7.6 : 6.6], fov: 45 }}
            dpr={isMobile ? [1, 1.25] : [1, 1.75]}
            gl={{
              antialias: !isMobile,
              powerPreference: 'high-performance',
              alpha: true,
              depth: true,
            }}
            className="h-full w-full pointer-events-none"
          >
            {/* Ambient Lighting */}
            <ambientLight intensity={0.65} />

            {/* Warm Metallic Gold Key Light */}
            <pointLight position={[6, 4, 5]} intensity={18} color="#f6d365" distance={15} />

            {/* Crimson Contrast Fill Light */}
            <pointLight position={[-6, -3, 3]} intensity={20} color="#dc2626" distance={15} />

            {/* Subtle Metallic Specular Rim Highlight */}
            <directionalLight position={[0, 6, -3]} intensity={3} color="#93c5fd" />

            {/* 3D Olympic Weight Plate & Calibrated Rings */}
            <OlympicStrengthPlate isMobile={isMobile} />

            {/* Atmospheric Drifting Embers */}
            <AtmosphericEmbers isMobile={isMobile} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
