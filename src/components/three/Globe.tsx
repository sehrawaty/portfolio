"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Palette = { ink: string; accent: string; line: string };

function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement);
  return {
    ink: s.getPropertyValue("--ink").trim() || "#141413",
    accent: s.getPropertyValue("--accent").trim() || "#e5531a",
    line: s.getPropertyValue("--line-strong").trim() || "#cfccc2",
  };
}

/** Re-reads the CSS tokens whenever the theme attribute flips. */
function usePalette() {
  const [palette, setPalette] = useState<Palette | null>(null);
  useEffect(() => {
    setPalette(readPalette());
    const obs = new MutationObserver(() => setPalette(readPalette()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return palette;
}

const dotVertex = /* glsl */ `
  uniform float uSize;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = normalize(normalMatrix * position).z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize;
  }
`;
const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vFacing;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = mix(0.07, 0.55, smoothstep(-0.3, 0.7, vFacing));
    gl_FragColor = vec4(uColor, a);
  }
`;

function fibonacciSphere(n: number, r: number) {
  const out = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t = golden * i;
    out.set([Math.cos(t) * rad * r, y * r, Math.sin(t) * rad * r], i * 3);
  }
  return out;
}

const fromLatLng = (lat: number, lng: number, r = 1) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

// Service nodes and the requests that travel between them.
const NODES = [
  [28, 77], [12, 79], [37, -122], [51, 0], [1, 104], [-33, 151], [40, -74], [35, 139],
].map(([a, b]) => fromLatLng(a, b));
const ROUTES: [number, number][] = [
  [0, 1], [0, 3], [1, 4], [2, 6], [3, 6], [4, 7], [4, 5], [0, 7], [2, 7],
];

function arcPoints(a: THREE.Vector3, b: THREE.Vector3, segments = 64) {
  const pts: THREE.Vector3[] = [];
  const angle = a.angleTo(b);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().copy(a).lerp(b, t).normalize();
    pts.push(p.multiplyScalar(1 + Math.sin(Math.PI * t) * angle * 0.18));
  }
  return pts;
}

function Planet({ palette }: { palette: Palette }) {
  const group = useRef<THREE.Group>(null!);
  const pulses = useRef<THREE.Mesh[]>([]);
  const { pointer, size } = useThree();

  const dots = useMemo(() => fibonacciSphere(size.width < 500 ? 1400 : 2200, 1), [size.width]);
  const dotMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dotVertex,
        fragmentShader: dotFragment,
        uniforms: { uColor: { value: new THREE.Color() }, uSize: { value: 2.4 * Math.min(window.devicePixelRatio, 1.5) } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  const arcs = useMemo(() => ROUTES.map(([a, b]) => arcPoints(NODES[a], NODES[b])), []);
  const arcLines = useMemo(
    () =>
      arcs.map((pts) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55 }))),
    [arcs],
  );

  useEffect(() => {
    dotMat.uniforms.uColor.value.set(palette.ink);
    arcLines.forEach((l) => (l.material as THREE.LineBasicMaterial).color.set(palette.line));
  }, [palette, dotMat, arcLines]);

  useFrame((state, dt) => {
    const g = group.current;
    g.rotation.y += dt * 0.08;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.35 - pointer.y * 0.15, 2, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, pointer.x * 0.08, 2, dt);
    const t = state.clock.elapsedTime;
    pulses.current.forEach((m, i) => {
      const pts = arcs[i];
      const phase = ((t * 0.35 + i * 0.37) % 1.6) / 1.6; // pause between trips
      const k = Math.min(phase * 1.6, 1);
      m.visible = phase * 1.6 < 1;
      m.position.copy(pts[Math.floor(k * (pts.length - 1))]);
    });
  });

  return (
    <group ref={group} rotation={[0.35, -1.6, 0]}>
      <points material={dotMat}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dots, 3]} />
        </bufferGeometry>
      </points>
      {arcLines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
      {NODES.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color={palette.accent} />
        </mesh>
      ))}
      {arcs.map((_, i) => (
        <mesh key={i} ref={(m) => { if (m) pulses.current[i] = m; }}>
          <sphereGeometry args={[0.014, 10, 10]} />
          <meshBasicMaterial color={palette.accent} />
        </mesh>
      ))}
    </group>
  );
}

export default function Globe() {
  const palette = usePalette();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely when the globe is off screen, so scrolling the rest of the page costs nothing.
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) obs.observe(wrap.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      {palette && (
        <Canvas
          frameloop={visible ? "always" : "never"}
          camera={{ position: [0, 0, 3.1], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        >
          <Planet palette={palette} />
        </Canvas>
      )}
    </div>
  );
}
