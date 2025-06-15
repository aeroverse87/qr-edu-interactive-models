
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

interface PlaceholderModelProps {
  type: string;
}

const PlaceholderModel = ({ type }: PlaceholderModelProps) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'earth-layers':
        return <sphereGeometry args={[1.5, 32, 32]} />;
      case 'prokaryotes-eukaryotes':
      case 'blood-components':
        return <sphereGeometry args={[1, 16, 16]} />;
      case 'root-structure':
        return <coneGeometry args={[0.8, 2, 8]} />;
      case 'harappa-stamp':
      case 'priest-king':
        return <boxGeometry args={[1.5, 2, 0.3]} />;
      case 'varaha':
        return <boxGeometry args={[1.2, 1.8, 1]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'earth-layers':
        return '#4f46e5';
      case 'prokaryotes-eukaryotes':
        return '#059669';
      case 'root-structure':
        return '#16a34a';
      case 'blood-components':
        return '#dc2626';
      case 'harappa-stamp':
        return '#d97706';
      case 'priest-king':
        return '#b45309';
      case 'varaha':
        return '#9333ea';
      default:
        return '#64748b';
    }
  };

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {getGeometry()}
      <meshStandardMaterial color={getColor()} />
    </mesh>
  );
};

export default PlaceholderModel;
