'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface NodeInfo {
  id: string;
  name: string;
  sub: string;
  position: [number, number, number];
  color: string;
}

const NODES: NodeInfo[] = [
  {
    id: 'app',
    name: 'Application',
    sub: 'Connected client & backend apps',
    position: [-3.4, 1.2, 0],
    color: '#8B5CF6' // Violet
  },
  {
    id: 'gateway',
    name: 'API Gateway',
    sub: 'Authenticated developer requests (ZTG_live_*)',
    position: [-1.2, -0.9, 0.4],
    color: '#67E8F9' // Cyan
  },
  {
    id: 'storage',
    name: 'Storage Node',
    sub: 'Persistent encrypted blob matrix',
    position: [1.3, 1.1, -0.2],
    color: '#FF4FD8' // Primary Pink
  },
  {
    id: 'delivery',
    name: 'Delivery Layer',
    sub: 'Low-latency range streaming & edge CDN',
    position: [3.4, -0.7, 0.3],
    color: '#FF2FB3' // Hot Pink
  }
];

// Quadratic bezier helper for packet flow
function createCurve(p1: [number, number, number], p2: [number, number, number], heightOffset = 0.8) {
  const v1 = new THREE.Vector3(...p1);
  const v2 = new THREE.Vector3(...p2);
  const mid = new THREE.Vector3()
    .addVectors(v1, v2)
    .multiplyScalar(0.5)
    .add(new THREE.Vector3(0, heightOffset, 0.2));
  return new THREE.QuadraticBezierCurve3(v1, mid, v2);
}

function CurvedWire({ 
  curve, 
  active, 
  color 
}: { 
  curve: THREE.QuadraticBezierCurve3; 
  active: boolean; 
  color: string 
}) {
  const points = useMemo(() => curve.getPoints(40), [curve]);
  const lineObj = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: new THREE.Color(color), 
      transparent: true, 
      opacity: active ? 0.75 : 0.25, 
      linewidth: 1 
    });
    return new THREE.Line(geometry, material);
  }, [points, color, active]);

  return <primitive object={lineObj} />;
}

function DataPacket({ 
  curve, 
  color, 
  speed = 0.5, 
  offset = 0 
}: { 
  curve: THREE.QuadraticBezierCurve3; 
  color: string; 
  speed?: number; 
  offset?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = ((state.clock.elapsedTime * speed + offset) % 1 + 1) % 1;
    const pos = curve.getPoint(t);
    meshRef.current.position.copy(pos);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function InfrastructureNode({
  node,
  hovered,
  onHover,
  onUnhover
}: {
  node: NodeInfo;
  hovered: boolean;
  onHover: (id: string) => void;
  onUnhover: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const targetScale = hovered ? 1.25 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
  });

  return (
    <group 
      position={node.position} 
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node.id);
      }}
      onPointerOut={() => onUnhover()}
    >
      {/* Outer translucent glass housing */}
      <mesh>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color={node.color}
          transparent
          opacity={hovered ? 0.45 : 0.18}
          roughness={0.1}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe border cage */}
      <mesh>
        <boxGeometry args={[0.92, 0.92, 0.92]} />
        <meshBasicMaterial 
          color={hovered ? '#FFFFFF' : node.color} 
          wireframe 
          transparent 
          opacity={hovered ? 0.9 : 0.4} 
        />
      </mesh>

      {/* Glowing inner core */}
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 3.0 : 1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Point light for node illumination */}
      <pointLight color={node.color} intensity={hovered ? 2.5 : 0.8} distance={3} />
    </group>
  );
}

const PARTICLE_COUNT = 90;
const PARTICLE_POSITIONS = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  PARTICLE_POSITIONS[i * 3] = ((i * 137.5) % 14) - 7;
  PARTICLE_POSITIONS[i * 3 + 1] = ((i * 89.3) % 8) - 4;
  PARTICLE_POSITIONS[i * 3 + 2] = ((i * 53.7) % 6) - 3;
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FF9BE8"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

function SceneContent({
  hoveredNodeId,
  setHoveredNodeId
}: {
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
}) {
  // Connections:
  // App -> Gateway -> Storage -> Delivery
  const curves = useMemo(() => {
    const c1 = createCurve(NODES[0].position, NODES[1].position, -0.4);
    const c2 = createCurve(NODES[1].position, NODES[2].position, 0.8);
    const c3 = createCurve(NODES[2].position, NODES[3].position, -0.5);
    return [
      { id: 'app-gateway', curve: c1, color: '#67E8F9' },
      { id: 'gateway-storage', curve: c2, color: '#FF4FD8' },
      { id: 'storage-delivery', curve: c3, color: '#FF2FB3' }
    ];
  }, []);

  // Parallax camera animation
  useFrame((state) => {
    const x = state.pointer.x * 0.8;
    const y = state.pointer.y * 0.5;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y + 0.2, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#CBD5E1" />
      <pointLight position={[0, 2, 2]} intensity={1.5} color="#FF4FD8" distance={10} />

      {/* Subtle floor grid */}
      <gridHelper 
        args={[16, 24, '#FF4FD8', '#ffffff']} 
        position={[0, -2.6, 0]} 
        material-transparent 
        material-opacity={0.08} 
      />

      <Particles />

      {/* Curved wires and animated packets */}
      {curves.map((c, i) => (
        <group key={c.id}>
          <CurvedWire 
            curve={c.curve} 
            active={hoveredNodeId !== null} 
            color={c.color} 
          />
          <DataPacket curve={c.curve} color={c.color} speed={0.4} offset={0} />
          <DataPacket curve={c.curve} color="#FFFFFF" speed={0.4} offset={0.5} />
        </group>
      ))}

      {/* Infrastructure Nodes */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        {NODES.map((node) => (
          <InfrastructureNode
            key={node.id}
            node={node}
            hovered={hoveredNodeId === node.id}
            onHover={(id) => setHoveredNodeId(id)}
            onUnhover={() => setHoveredNodeId(null)}
          />
        ))}
      </Float>
    </>
  );
}

export default function HeroScene() {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const activeNode = NODES.find((n) => n.id === hoveredNodeId);

  return (
    <div className="relative w-full h-[450px] md:h-[580px] rounded-2xl overflow-hidden liquid-glass border border-white/10 shadow-2xl">
      {/* Background glow canvas */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono">
          <div className="animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4FD8]" />
            Initializing ZentraGrid 3D Core...
          </div>
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          <SceneContent 
            hoveredNodeId={hoveredNodeId} 
            setHoveredNodeId={setHoveredNodeId} 
          />
        </Canvas>
      </Suspense>

      {/* Floating interactive tooltip */}
      {activeNode && (
        <div 
          id="scene-tooltip" 
          className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:max-w-xs liquid-glass p-3.5 rounded-xl border border-[#FF4FD8]/40 shadow-xl backdrop-blur-xl animate-fade-in pointer-events-none"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: activeNode.color }} 
            />
            {activeNode.name}
          </div>
          <div className="text-[11px] text-slate-300 mt-1 leading-snug">
            {activeNode.sub}
          </div>
        </div>
      )}

      {/* Infrastructure pipeline badge */}
      <div className="absolute top-4 left-4 liquid-glass px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-slate-400">Pipeline:</span>
        <span className="text-slate-100">App → Gateway → Storage → Delivery</span>
      </div>
    </div>
  );
}
