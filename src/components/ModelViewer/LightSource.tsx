
import React from 'react';
import * as THREE from 'three';

interface LightSourceProps {
  position: [number, number, number];
  visible: boolean;
}

export function LightSource({ position, visible }: LightSourceProps) {
  if (!visible) return null;

  return (
    <group position={position}>
      {/* Main light indicator sphere - much larger and brighter */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 8]} />
        <meshBasicMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Outer glow effect - larger and more visible */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 8]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
      </mesh>
      
      {/* Very outer glow for better visibility */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 8]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.1} />
      </mesh>
      
      {/* Light rays - bigger and more visible */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        const rayLength = 2.0;
        const x = Math.cos(angle) * rayLength;
        const z = Math.sin(angle) * rayLength;
        
        return (
          <group key={i}>
            {/* Inner ray points */}
            <mesh position={[x * 0.3, 0, z * 0.3]}>
              <sphereGeometry args={[0.1, 8, 4]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.8} emissive="#ffff00" emissiveIntensity={0.2} />
            </mesh>
            {/* Outer ray points */}
            <mesh position={[x * 0.6, 0, z * 0.6]}>
              <sphereGeometry args={[0.08, 8, 4]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.6} emissive="#ffff00" emissiveIntensity={0.1} />
            </mesh>
            {/* Furthest ray points */}
            <mesh position={[x * 0.9, 0, z * 0.9]}>
              <sphereGeometry args={[0.06, 8, 4]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.4} emissive="#ffff00" emissiveIntensity={0.1} />
            </mesh>
          </group>
        );
      })}
      
      {/* Vertical rays for 3D effect */}
      {[-1, 1].map((direction) => (
        <mesh key={direction} position={[0, direction * 1.5, 0]}>
          <sphereGeometry args={[0.1, 8, 4]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.6} emissive="#ffff00" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}
