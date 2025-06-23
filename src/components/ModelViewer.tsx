
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useState, useRef, useCallback } from 'react';
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
  const [webglError, setWebglError] = useState(false);
  
  const [settings, setSettings] = useState<ViewerSettings>({
    backgroundLight: true,
    environmentLight: 0.6,
    backgroundColor: backgroundOptions[0].value,
    showOutline: false,
    showWireframe: false,
    lightRotation: 0,
    lightPreset: 'white',
    viewpoint: 'front',
    showAxes: false,
    showLightSource: false,
    lightPosition: [10, 10, 10],
  });
  
  console.log(`ModelViewer - Title: ${title}, ModelPath: ${modelPath}, ModelId: ${modelId}`);

  // Different zoom settings for different model types - 20X closer zoom-in capability
  const isSmallArtifact = modelId === 'priest-king' || modelId === 'harappa-stamp';
  const minDistance = isSmallArtifact ? 0.005 : 0.05;
  const defaultCameraPosition = isSmallArtifact ? 3 : 5;

  const updateSetting = <K extends keyof ViewerSettings>(key: K, value: ViewerSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const changeViewpoint = (viewpointId: string) => {
    const viewpoint = viewpoints.find(v => v.id === viewpointId);
    if (viewpoint && cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...viewpoint.position);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
      updateSetting('viewpoint', viewpointId);
    }
  };

  const resetZoom = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, defaultCameraPosition);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleWebGLContextLost = useCallback((event: Event) => {
    console.warn('WebGL context lost, attempting recovery...');
    event.preventDefault();
    setWebglError(true);
  }, []);

  const handleWebGLContextRestored = useCallback(() => {
    console.log('WebGL context restored');
    setWebglError(false);
  }, []);

  const handleCanvasCreated = useCallback(({ camera, gl }) => {
    cameraRef.current = camera;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add WebGL context event listeners
    gl.domElement.addEventListener('webglcontextlost', handleWebGLContextLost);
    gl.domElement.addEventListener('webglcontextrestored', handleWebGLContextRestored);
    
    return () => {
      gl.domElement.removeEventListener('webglcontextlost', handleWebGLContextLost);
      gl.domElement.removeEventListener('webglcontextrestored', handleWebGLContextRestored);
    };
  }, [handleWebGLContextLost, handleWebGLContextRestored]);

  // If WebGL context is lost, show error message
  if (webglError) {
    return (
      <div className="space-y-4">
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-red-500 text-lg mb-4">⚠️ WebGL Context Lost</div>
            <p className="text-gray-600 mb-4">The 3D viewer encountered an error. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="model-viewer-container space-y-4">
        {/* 3D Viewer */}
        <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden relative">
          <Canvas
            camera={{ position: [0, 0, defaultCameraPosition], fov: 50 }}
            style={{ background: settings.backgroundColor }}
            onCreated={handleCanvasCreated}
            gl={{ 
              antialias: true, 
              alpha: true,
              preserveDrawingBuffer: true,
              powerPreference: "high-performance"
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
              minDistance={minDistance}
              maxDistance={200}
              zoomSpeed={2}
              panSpeed={1}
              rotateSpeed={1}
              mouseButtons={{
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.PAN
              }}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
              }}
            />
          </Canvas>
        </div>

        {/* Compact Controls */}
        <CompactControls 
          settings={settings}
          updateSetting={updateSetting}
          changeViewpoint={changeViewpoint}
          resetZoom={resetZoom}
        />
      </div>
    </div>
  );
};

export default ModelViewer;
