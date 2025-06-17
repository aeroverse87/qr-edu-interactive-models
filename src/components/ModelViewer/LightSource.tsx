
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
      
      {/* Light rays visualization - simplified approach */}
      <group>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI) / 3;
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * 0.5, 0, Math.sin(angle) * 0.5]}
              rotation={[0, angle, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.01, 0.01, 0.8]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.3} />
            </mesh>
          );
        })}
      </group>
      
      {/* Additional glow effect */}
      <Sphere args={[0.3]}>
        <meshBasicMaterial color="#ffff00" transparent opacity={0.1} />
      </Sphere>
    </group>
  );
}
