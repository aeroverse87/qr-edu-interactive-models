
import React from 'react';
import { Sphere } from '@react-three/drei';

interface LightSourceProps {
  position: [number, number, number];
  visible: boolean;
}

export function LightSource({ position, visible }: LightSourceProps) {
  if (!visible) return null;

  return (
    <group position={position}>
      {/* Main light indicator sphere */}
      <Sphere args={[0.2]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffff00" />
      </Sphere>
      
      {/* Simplified glow effect */}
      <Sphere args={[0.4]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffff00" transparent opacity={0.1} />
      </Sphere>
      
      {/* Simple light rays using Sphere components from drei */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI) / 3;
        const rayLength = 1.0;
        const x = Math.cos(angle) * rayLength;
        const z = Math.sin(angle) * rayLength;
        
        return (
          <group key={i}>
            <Sphere args={[0.05]} position={[x * 0.25, 0, z * 0.25]}>
              <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
            </Sphere>
            <Sphere args={[0.03]} position={[x * 0.5, 0, z * 0.5]}>
              <meshBasicMaterial color="#ffff00" transparent opacity={0.4} />
            </Sphere>
          </group>
        );
      })}
    </group>
  );
}
