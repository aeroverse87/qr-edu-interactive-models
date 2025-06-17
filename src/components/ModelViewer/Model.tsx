
import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ViewerSettings } from './types';

interface ModelProps {
  url: string;
  settings: ViewerSettings;
}

export function Model({ url, settings }: ModelProps) {
  const { scene } = useGLTF(url);
  
  // Apply settings to the model
  React.useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Handle wireframe
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.wireframe = settings.showWireframe;
            });
          } else {
            child.material.wireframe = settings.showWireframe;
          }
        }
      }
    });
  }, [scene, settings.showWireframe]);

  // Add protection against model extraction
  React.useEffect(() => {
    const preventSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Prevent text selection and dragging on the canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('selectstart', preventSelection);
      canvas.addEventListener('dragstart', preventSelection);
      canvas.style.userSelect = 'none';
      canvas.style.webkitUserSelect = 'none';
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('selectstart', preventSelection);
        canvas.removeEventListener('dragstart', preventSelection);
      }
    };
  }, []);

  return <primitive object={scene} scale={4} />;
}
