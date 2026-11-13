import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
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
 * Responsive Camera Framer
 * 
 * Mathematically calculates the camera's Z distance to guarantee that the
 * entire Olympic Weight Plate (diameter 3.28) is 100% visible with a generous
 * safe margin on all sides, regardless of viewport dimensions, canvas aspect
 * ratio, rotation angle, or floating levitation.
 */
function CameraFramer({ isMobile }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = Math.max(0.1, size.width / Math.max(1, size.height));
    const fov = 40;
    const vFovRad = (fov * Math.PI) / 180;
    const tanHalf = Math.tan(vFovRad / 2);
    const plateDiameter = 3.28;
    // Generous safe margin ensuring complete visibility across all animation states
    const safeMargin = isMobile ? 0.95 : 0.90;
    const requiredSpace = plateDiameter + safeMargin;

    // Formula ensures BOTH visible height and visible width >= requiredSpace
    const minAspectFactor = Math.min(1.0, aspect);
    const targetZ = requiredSpace / (2 * tanHalf * minAspectFactor);

    camera.fov = fov;
    camera.position.set(0, 0, targetZ);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, isMobile]);

  return null;
}

/**
 * 3D Sculpted Olympic Barbell Weight Plate
 * 
 * Features authentic commercial gym geometry:
 * - Solid circular plate body with recessed web.
 * - Real 50.4mm Olympic standard center through-hole (bore hole).
 * - 3 ergonomic grip cutout openings (tri-grip design).
 * - Raised outer rim (flange) with beveled protective lip.
 * - Machined stainless steel center collar insert.
 * - Subtle metallic gold accent pinstriping embedded into the rim.
 * - 3/4 isometric perspective angle showing thickness, center hole, and face depth.
 */
function OlympicWeightPlate({ isMobile = false }) {
  const plateGroupRef = useRef();

  // Create real Olympic plate geometries with through-holes
  const { webGeom, rimGeom, hubGeom, collarGeom, goldRingGeom } = useMemo(() => {
    const curveSegments = isMobile ? 24 : 36;
    const outerR = 1.62;
    const rimInnerR = 1.38;
    const centerR = 0.23; // Standard Olympic bore radius
    const hubOuterR = 0.45;
    const gripRadius = 0.94;

    // 1. Recessed Web with Center Hole and 3 Ergonomic Grip Openings
    const webShape = new THREE.Shape();
    webShape.absarc(0, 0, outerR - 0.02, 0, Math.PI * 2, false);

    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, centerR, 0, Math.PI * 2, true);
    webShape.holes.push(centerHole);

    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 + Math.PI / 6;
      const cx = Math.cos(angle) * gripRadius;
      const cy = Math.sin(angle) * gripRadius;
      const w = 0.46;
      const h = 0.20;

      const grip = new THREE.Path();
      const rot = angle + Math.PI / 2;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const dx = (w / 2) * cosR;
      const dy = (w / 2) * sinR;
      const nx = (h / 2) * -sinR;
      const ny = (h / 2) * cosR;

      grip.moveTo(cx - dx - nx, cy - dy - ny);
      grip.lineTo(cx + dx - nx, cy + dy - ny);
      grip.quadraticCurveTo(cx + dx, cy + dy, cx + dx + nx, cy + dy + ny);
      grip.lineTo(cx - dx + nx, cy - dy + ny);
      grip.quadraticCurveTo(cx - dx, cy - dy, cx - dx - nx, cy - dy - ny);
      webShape.holes.push(grip);
    }

    const web = new THREE.ExtrudeGeometry(webShape, {
      depth: 0.10,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.016,
      bevelSegments: 2,
      curveSegments,
    });
    web.center();

    // 2. Raised Outer Rim (Flange)
    const rimShape = new THREE.Shape();
    rimShape.absarc(0, 0, outerR, 0, Math.PI * 2, false);
    const rimHole = new THREE.Path();
    rimHole.absarc(0, 0, rimInnerR, 0, Math.PI * 2, true);
    rimShape.holes.push(rimHole);

    const rim = new THREE.ExtrudeGeometry(rimShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.016,
      bevelSegments: 2,
      curveSegments,
    });
    rim.center();

    // 3. Center Hub
    const hubShape = new THREE.Shape();
    hubShape.absarc(0, 0, hubOuterR, 0, Math.PI * 2, false);
    const hubHole = new THREE.Path();
    hubHole.absarc(0, 0, centerR, 0, Math.PI * 2, true);
    hubShape.holes.push(hubHole);

    const hub = new THREE.ExtrudeGeometry(hubShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.016,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments,
    });
    hub.center();

    // 4. Stainless Steel Inner Collar Ring
    const collarShape = new THREE.Shape();
    collarShape.absarc(0, 0, centerR + 0.065, 0, Math.PI * 2, false);
    const collarHole = new THREE.Path();
    collarHole.absarc(0, 0, centerR, 0, Math.PI * 2, true);
    collarShape.holes.push(collarHole);

    const collar = new THREE.ExtrudeGeometry(collarShape, {
      depth: 0.20,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.008,
      bevelSegments: 2,
      curveSegments,
    });
    collar.center();

    // 5. Subtle Gold Accent Inlay
    const goldRingShape = new THREE.Shape();
    goldRingShape.absarc(0, 0, rimInnerR + 0.008, 0, Math.PI * 2, false);
    const goldHole = new THREE.Path();
    goldHole.absarc(0, 0, rimInnerR - 0.016, 0, Math.PI * 2, true);
    goldRingShape.holes.push(goldHole);

    const goldRing = new THREE.ExtrudeGeometry(goldRingShape, {
      depth: 0.11,
      bevelEnabled: false,
      curveSegments,
    });
    goldRing.center();

    return {
      webGeom: web,
      rimGeom: rim,
      hubGeom: hub,
      collarGeom: collar,
      goldRingGeom: goldRing,
    };
  }, [isMobile]);

  // Clean, realistic commercial gym materials
  const castIronMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#222630'),
        metalness: 0.7,
        roughness: 0.38,
      }),
    []
  );

  const steelCollarMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#f1f5f9'),
        metalness: 0.94,
        roughness: 0.18,
      }),
    []
  );

  const goldAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#e5b842'),
        metalness: 0.88,
        roughness: 0.24,
        emissive: new THREE.Color('#241a04'),
        emissiveIntensity: 0.15,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (plateGroupRef.current) {
      // 3/4 isometric perspective base orientation
      const baseRotY = -0.30;
      const baseRotX = 0.24;
      const baseRotZ = 0.02;

      // Restrained, ultra-smooth floating oscillation
      // Keeps the plate strictly inside safe bounds at all times
      const targetRotY =
        baseRotY +
        Math.sin(t * 0.4) * 0.07 +
        (!isMobile && state.pointer ? state.pointer.x * 0.08 : 0);

      const targetRotX =
        baseRotX +
        Math.cos(t * 0.3) * 0.035 -
        (!isMobile && state.pointer ? state.pointer.y * 0.05 : 0);

      plateGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        plateGroupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      plateGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        plateGroupRef.current.rotation.x,
        targetRotX,
        0.05
      );
      plateGroupRef.current.rotation.z = baseRotZ + Math.sin(t * 0.25) * 0.012;

      // Smooth floating levitation (height amplitude 0.04)
      plateGroupRef.current.position.y = Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <group ref={plateGroupRef} position={[0, 0, 0]}>
      {/* 1. Recessed Web with 3 Ergonomic Grip Openings */}
      <mesh geometry={webGeom} material={castIronMaterial} />

      {/* 2. Raised Outer Rim Flange */}
      <mesh geometry={rimGeom} material={castIronMaterial} />

      {/* 3. Center Hub */}
      <mesh geometry={hubGeom} material={castIronMaterial} />

      {/* 4. Machined Stainless Steel Collar Sleeve Insert */}
      <mesh geometry={collarGeom} material={steelCollarMaterial} />

      {/* 5. Subtle Metallic Gold Inlay Ring */}
      <mesh geometry={goldRingGeom} material={goldAccentMaterial} />
    </group>
  );
}

/**
 * Atmospheric embers drifting with gold and warm amber glow
 * Kept restrained to avoid visual clutter.
 */
function AtmosphericEmbers({ isMobile = false }) {
  return (
    <Sparkles
      count={isMobile ? 12 : 24}
      scale={[7, 6, 5]}
      size={isMobile ? 1.5 : 2.0}
      speed={0.25}
      opacity={0.4}
      color="#e6c66e"
    />
  );
}

/**
 * Lightweight SVG/CSS Olympic weight plate fallback for reduced-motion
 * or environments without WebGL acceleration.
 */
function FallbackCanvas() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-full border-4 border-[#2d323f] bg-gradient-to-tr from-[#161820] to-[#252936] shadow-2xl flex items-center justify-center">
        {/* Outer Gold Accent Rim */}
        <div className="absolute inset-2 rounded-full border border-amber-500/30" />
        
        {/* 3 Grip Opening Representations */}
        <div className="absolute top-4 h-4 w-14 rounded-full bg-[#050608] border border-white/10" />
        <div className="absolute bottom-8 left-5 h-4 w-14 -rotate-60 rounded-full bg-[#050608] border border-white/10" />
        <div className="absolute bottom-8 right-5 h-4 w-14 rotate-60 rounded-full bg-[#050608] border border-white/10" />

        {/* Center Collar & Bore Hole */}
        <div className="relative h-18 w-18 rounded-full border-2 border-surface-300 bg-gradient-to-b from-surface-200 to-surface-400 flex items-center justify-center shadow-lg">
          <div className="h-8 w-8 rounded-full bg-[#050608] border border-white/20 shadow-inner" />
        </div>
      </div>
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
    <div className={`relative h-full w-full max-w-full pointer-events-none select-none ${className}`}>
      <ErrorBoundary>
        <Suspense fallback={<FallbackCanvas />}>
          <Canvas
            camera={{ position: [0, 0, isMobile ? 6.4 : 5.8], fov: 40 }}
            dpr={isMobile ? [1, 1.25] : [1, 1.75]}
            gl={{
              antialias: !isMobile,
              powerPreference: 'high-performance',
              alpha: true,
              depth: true,
            }}
            className="h-full w-full max-w-full max-h-full pointer-events-none"
          >
            {/* Dynamic camera framing guaranteeing complete visibility at all aspect ratios */}
            <CameraFramer isMobile={isMobile} />

            {/* Ambient Lighting for base visibility */}
            <ambientLight intensity={0.9} />

            {/* Studio Key Light (warm white) illuminating the plate face & grip bevels */}
            <directionalLight position={[5, 5, 5]} intensity={3.6} color="#fff6e5" />

            {/* Studio Rim Light (cool slate) picking up the outer cylindrical edge & plate thickness */}
            <directionalLight position={[-4, 4, -4]} intensity={4.5} color="#cbd5e1" />

            {/* Soft Amber Accent Fill from lower angle */}
            <pointLight position={[-3, -3, 3]} intensity={8} color="#d97706" distance={10} />

            {/* Dedicated 3D Olympic Weight Plate */}
            <OlympicWeightPlate isMobile={isMobile} />

            {/* Subtle atmospheric dust motes */}
            <AtmosphericEmbers isMobile={isMobile} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
