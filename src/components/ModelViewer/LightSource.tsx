
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
        <sphereGeometry args={[1.2, 32, 16]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Inner bright core */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={2.0}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Outer glow effect - much larger and more visible */}
      <mesh>
        <sphereGeometry args={[2.0, 16, 8]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.3} />
      </mesh>
      
      {/* Very outer glow for better visibility */}
      <mesh>
        <sphereGeometry args={[3.0, 16, 8]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.15} />
      </mesh>
      
      {/* Light rays - bigger and more visible */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        const rayLength = 4.0;
        const x = Math.cos(angle) * rayLength;
        const z = Math.sin(angle) * rayLength;
        
        return (
          <group key={i}>
            {/* Ray lines */}
            <mesh position={[x * 0.5, 0, z * 0.5]}>
              <sphereGeometry args={[0.2, 8, 4]} />
              <meshStandardMaterial 
                color="#ffff00" 
                transparent 
                opacity={0.9} 
                emissive="#ffff00" 
                emissiveIntensity={0.8} 
              />
            </mesh>
            <mesh position={[x * 0.8, 0, z * 0.8]}>
              <sphereGeometry args={[0.15, 8, 4]} />
              <meshStandardMaterial 
                color="#ffff00" 
                transparent 
                opacity={0.7} 
                emissive="#ffff00" 
                emissiveIntensity={0.6} 
              />
            </mesh>
            <mesh position={[x * 1.2, 0, z * 1.2]}>
              <sphereGeometry args={[0.1, 8, 4]} />
              <meshStandardMaterial 
                color="#ffff00" 
                transparent 
                opacity={0.5} 
                emissive="#ffff00" 
                emissiveIntensity={0.4} 
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Vertical rays for 3D effect */}
      {[-1, 1].map((direction) => (
        <mesh key={direction} position={[0, direction * 2.5, 0]}>
          <sphereGeometry args={[0.2, 8, 4]} />
          <meshStandardMaterial 
            color="#ffff00" 
            transparent 
            opacity={0.8} 
            emissive="#ffff00" 
            emissiveIntensity={0.8} 
          />
        </mesh>
      ))}
      
      {/* Pulsing animation ring */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.1, 8, 32]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={1.0}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
