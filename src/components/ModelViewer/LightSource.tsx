
import React from 'react';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface LightSourceProps {
  position: [number, number, number];
  visible: boolean;
}

export function LightSource({ position, visible }: LightSourceProps) {
  if (!visible) return null;

  return (
    <group position={position}>
      {/* Light indicator sphere */}
      <Sphere args={[0.2]}>
        <meshBasicMaterial color="#ffff00" />
      </Sphere>
      
      {/* Light rays visualization */}
      <group>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
            <cylinderGeometry args={[0.02, 0.02, 1]} />
            <meshBasicMaterial color="#ffff00" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
