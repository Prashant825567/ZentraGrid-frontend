'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GridMesh() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    gridRef.current.position.z = (state.clock.elapsedTime * 0.4) % 1;
  });

  return (
    <group ref={gridRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -1, 0]}>
      <gridHelper 
        args={[30, 30, '#FF4FD8', '#8B5CF6']} 
        material-transparent 
        material-opacity={0.15} 
      />
    </group>
  );
}

export default function CtaGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <Canvas 
        camera={{ position: [0, 2, 5], fov: 60 }} 
        dpr={[1, 1]} 
        gl={{ antialias: false }}
      >
        <GridMesh />
      </Canvas>
    </div>
  );
}
