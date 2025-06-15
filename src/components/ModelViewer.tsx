
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useState, useRef } from 'react';
import * as THREE from 'three';
import { ModelViewerProps, ViewerSettings } from './ModelViewer/types';
import { CompactControls } from './ModelViewer/CompactControls';
import { Lights } from './ModelViewer/Lights';
import { ModelWithFallback } from './ModelViewer/ModelWithFallback';
import { backgroundOptions, viewpoints } from './ModelViewer/constants';

const ModelViewer = ({ modelPath, title }: ModelViewerProps) => {
  const modelId = modelPath.split('/').pop()?.replace('.glb', '') || '';
  const cameraRef = useRef<THREE.Camera>();
  const controlsRef = useRef<any>();
  
  const [settings, setSettings] = useState<ViewerSettings>({
    backgroundLight: true,
    environmentLight: 0.6,
    backgroundColor: backgroundOptions[0].value,
    showOutline: false,
    showWireframe: false,
    lightRotation: 0,
    lightPreset: 'white',
    viewpoint: 'front',
  });
  
  console.log(`ModelViewer - Title: ${title}, ModelPath: ${modelPath}, ModelId: ${modelId}`);

  const updateSetting = <K extends keyof ViewerSettings>(key: K, value: ViewerSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const changeViewpoint = (viewpointId: string) => {
    const viewpoint = viewpoints.find(v => v.id === viewpointId);
    if (viewpoint && cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...viewpoint.position);
      controlsRef.current.update();
      updateSetting('viewpoint', viewpointId);
    }
  };

  const resetZoom = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.update();
    }
  };

  return (
    <div className="space-y-4">
      {/* 3D Viewer */}
      <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden relative">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: settings.backgroundColor }}
          onCreated={({ camera, gl }) => {
            cameraRef.current = camera;
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          {settings.backgroundLight && <Lights settings={settings} />}
          
          <ModelWithFallback url={modelPath} modelId={modelId} title={title} settings={settings} />
          <Environment preset="studio" />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.01}
            maxDistance={50}
            zoomSpeed={2}
          />
        </Canvas>
        
        {/* Help overlay for blocked content */}
        <div className="absolute top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs max-w-[200px]">
          <div className="font-medium text-yellow-800 mb-1">Trouble loading?</div>
          <div className="text-yellow-700">Try disabling ad blockers or browser extensions</div>
        </div>
      </div>

      {/* Model Info - moved outside viewer */}
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border shadow-sm inline-block">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-gray-600 text-xs">Interactive 3D Model</div>
      </div>

      {/* Compact Controls */}
      <CompactControls 
        settings={settings}
        updateSetting={updateSetting}
        changeViewpoint={changeViewpoint}
        resetZoom={resetZoom}
      />
    </div>
  );
};

export default ModelViewer;
