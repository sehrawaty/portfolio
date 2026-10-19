"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { usePalette, type Palette } from "./palette";

// Shared scroll progress (0 at top, 1 at bottom), written by a passive listener
// so the render loop never touches React state.
// `hero` is scroll measured in viewport heights, used to fly the core out of the hero.
const scroll = { p: 0, hero: 0 };
if (typeof window !== "undefined") {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scroll.p = max > 0 ? window.scrollY / max : 0;
    scroll.hero = window.scrollY / window.innerHeight;
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* ---------- 1. The core: a liquid, distorting orb wrapped in a wire shell ---------- */
function Core({ palette }: { palette: Palette }) {
  const group = useRef<THREE.Group>(null!);
  const shell = useRef<THREE.Mesh>(null!);
  const { pointer, viewport } = useThree();
  const isMobile = viewport.width < 7;

  useFrame((state, dt) => {
    const g = group.current;
    // Follow the cursor softly, drift away as the user scrolls.
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.x * 0.6, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.4, 3, dt);
    // Hero: sits to the right. Scrolling away: drifts up-right and out of the content's way.
    const h = Math.min(scroll.hero, 1.5);
    const targetX = isMobile ? 1.1 + h * 1.5 : 2.6 + h * 2.2;
    const targetY = (isMobile ? 2.3 : 0.1) + h * 3.2 - scroll.p * 1.5;
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 2.5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 2.5, dt);
    const s = (isMobile ? 0.55 : 1) * (1 - Math.min(h, 1) * 0.3);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 2, dt));
    shell.current.rotation.y += dt * 0.15;
    shell.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.25, 28]} />
          <MeshDistortMaterial
            color={new THREE.Color(palette.accent).multiplyScalar(palette.dark ? 0.75 : 1.05)}
            emissive={new THREE.Color(palette.accent).multiplyScalar(0.18)}
            emissiveIntensity={palette.dark ? 0.6 : 0.9}
            roughness={0.28}
            metalness={0.7}
            distort={0.42}
            speed={1.8}
          />
        </mesh>
        <mesh ref={shell} scale={1.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={palette.accent2} wireframe transparent opacity={palette.dark ? 0.22 : 0.35} />
        </mesh>
      </Float>
      <Orbits palette={palette} />
    </group>
  );
}

/* ---------- 2. Orbiting rings with satellites — services circling the core ---------- */
function Orbits({ palette }: { palette: Palette }) {
  const rings = useMemo(
    () => [
      { r: 2.3, tilt: [1.2, 0.2, 0], speed: 0.5, color: palette.accent2 },
      { r: 2.8, tilt: [0.4, 0.9, 0.3], speed: -0.35, color: palette.accent },
      { r: 3.3, tilt: [1.7, -0.5, 0.6], speed: 0.25, color: palette.accent3 },
    ],
    [palette],
  );
  return (
    <>
      {rings.map((ring, i) => (
        <Ring key={i} {...ring} tilt={ring.tilt as [number, number, number]} />
      ))}
    </>
  );
}

function Ring({ r, tilt, speed, color }: { r: number; tilt: [number, number, number]; speed: number; color: string }) {
  const sat = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    sat.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[r, 0.006, 8, 200]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      <group ref={sat}>
        <mesh position={[r, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <pointLight position={[r, 0, 0]} color={color} intensity={2} distance={3} />
      </group>
    </group>
  );
}

/* ---------- 3. Galaxy particle field with a custom shader ---------- */
const galaxyVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    float r = length(p.xz);
    float angle = atan(p.z, p.x) + uTime * 0.04 * (8.0 / (r + 2.0)) + uScroll * 1.5;
    p.x = cos(angle) * r;
    p.z = sin(angle) * r;
    p.y += sin(uTime * 0.6 + r) * 0.08;
    p.xy += uPointer * 0.25 * (r / 10.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * 28.0 / -mv.z;
    vColor = aColor;
  }
`;
const galaxyFragment = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a);
  }
`;

function Galaxy({ palette, count = 6000 }: { palette: Palette; count?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const { pointer } = useThree();

  const [positions, colors, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    const inner = new THREE.Color(palette.accent);
    const outer = new THREE.Color(palette.accent2);
    const branches = 4;
    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * 14 + 0.5;
      const branch = ((i % branches) / branches) * Math.PI * 2;
      const spin = r * 0.45;
      const rand = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.6 * r * 0.35;
      pos[i * 3] = Math.cos(branch + spin) * r + rand();
      pos[i * 3 + 1] = rand() * 0.5;
      pos[i * 3 + 2] = Math.sin(branch + spin) * r + rand();
      const c = inner.clone().lerp(outer, r / 14);
      if (Math.random() < 0.06) c.set(palette.accent3);
      col.set([c.r, c.g, c.b], i * 3);
      sca[i] = Math.random() * 1.2 + 0.2;
    }
    return [pos, col, sca];
  }, [count, palette]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uScroll: { value: 0 }, uPointer: { value: new THREE.Vector2() } }),
    [],
  );

  useFrame((state, dt) => {
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uScroll.value = THREE.MathUtils.damp(u.uScroll.value, scroll.p, 2, dt);
    u.uPointer.value.lerp(pointer, 0.05);
  });

  return (
    <points position={[0, -3.2, -6]} rotation={[0.35, 0, 0.12]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={galaxyVertex}
        fragmentShader={galaxyFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={palette.dark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/* ---------- Camera dolly tied to scroll ---------- */
function CameraRig() {
  useFrame((state, dt) => {
    const cam = state.camera;
    cam.position.z = THREE.MathUtils.damp(cam.position.z, 7 + scroll.p * 2, 2, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, -scroll.p * 1.5, 2, dt);
    cam.lookAt(0, -scroll.p * 1.5, 0);
  });
  return null;
}

export default function Scene() {
  const palette = usePalette();
  if (!palette) return null;
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color={palette.accent3} />
      <directionalLight position={[-5, -2, -2]} intensity={1.4} color={palette.accent2} />
      {/* Studio lighting built from in-scene light panels: no HDR download needed. */}
      <Environment key={`${palette.dark}-${palette.accent}`} resolution={256} frames={1}>
        <Lightformer form="ring" intensity={4} color={palette.accent2} position={[-4, 2, 3]} scale={3} />
        <Lightformer form="rect" intensity={6} color={palette.accent3} position={[4, -1, 2]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, -2]} scale={[8, 1, 1]} />
        <Lightformer form="circle" intensity={3} color={palette.accent} position={[0, -4, 4]} scale={3} />
      </Environment>
      <Core palette={palette} />
      <Galaxy palette={palette} />
      <Sparkles count={60} scale={[14, 8, 6]} size={2.2} speed={0.3} color={palette.accent3} opacity={palette.dark ? 0.6 : 0.8} />
      <CameraRig />
    </Canvas>
  );
}
