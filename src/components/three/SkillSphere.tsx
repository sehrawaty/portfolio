"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, OrbitControls, Text } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const palette = ["#c4b5fd", "#67e8f9", "#f9a8d4", "#a5b4fc", "#5eead4"];

function Word({ text, position, color }: { text: string; position: THREE.Vector3; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  useFrame((_, dt) => {
    const s = hovered ? 1.5 : 1;
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, s, 8, dt));
  });
  return (
    <Billboard position={position}>
      <Text
        ref={ref}
        font="/fonts/Geist-Medium.ttf"
        fontSize={0.3}
        color={hovered ? "#ffffff" : color}
        anchorX="center"
        anchorY="middle"
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        {text}
      </Text>
    </Billboard>
  );
}

function Cloud({ words, radius = 3.4 }: { words: string[]; radius?: number }) {
  const group = useRef<THREE.Group>(null!);
  // Fibonacci sphere: evenly spread points regardless of how many skills there are.
  const points = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return words.map((w, i) => {
      const y = 1 - (i / (words.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return {
        text: w,
        pos: new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius),
        color: palette[i % palette.length],
      };
    });
  }, [words, radius]);

  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.12;
  });

  return (
    <group ref={group}>
      {points.map((p) => (
        <Word key={p.text} text={p.text} position={p.pos} color={p.color} />
      ))}
      <mesh>
        <sphereGeometry args={[radius * 0.92, 32, 32]} />
        <meshBasicMaterial color="#7c5cff" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export default function SkillSphere({ words }: { words: string[] }) {
  return (
    <Canvas camera={{ position: [0, 0, 9.5], fov: 50 }} dpr={[1, 1.75]} gl={{ alpha: true }}>
      <Cloud words={words} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} autoRotate={false} />
    </Canvas>
  );
}
