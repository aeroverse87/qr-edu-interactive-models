
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei';
import { Suspense, useState } from 'react';
import PlaceholderModel from './PlaceholderModel';

interface ModelViewerProps {
  modelPath: string;
  title: string;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-blue-600 font-medium">
          Loading 3D Model... {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}

function Model({ url, modelId }: { url: string; modelId: string }) {
  const [loadError, setLoadError] = useState(false);
  
  console.log(`Attempting to load model from: ${url}`);
  
  try {
    const { scene } = useGLTF(url);
    console.log(`Successfully loaded model: ${modelId}`, scene);
    return <primitive object={scene} scale={1} />;
  } catch (error) {
    console.error(`Failed to load model: ${modelId}`, error);
    console.log(`Using placeholder for model: ${modelId}`);
    return <PlaceholderModel type={modelId} />;
  }
}

function ModelWithFallback({ url, modelId }: { url: string; modelId: string }) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  if (usePlaceholder) {
    console.log(`Using placeholder fallback for: ${modelId}`);
    return <PlaceholderModel type={modelId} />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Model url={url} modelId={modelId} />
    </Suspense>
  );
}

const ModelViewer = ({ modelPath, title }: ModelViewerProps) => {
  const modelId = modelPath.split('/').pop()?.replace('.glb', '') || '';
  
  console.log(`ModelViewer - Title: ${title}, ModelPath: ${modelPath}, ModelId: ${modelId}`);

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}
      >
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <ModelWithFallback url={modelPath} modelId={modelId} />
        <Environment preset="studio" />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      
      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-gray-600 text-xs">Interactive 3D Model</div>
      </div>
    </div>
  );
};

export default ModelViewer;
