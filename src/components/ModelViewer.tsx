
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import PlaceholderModel from './PlaceholderModel';
import { Progress } from '@/components/ui/progress';

interface ModelViewerProps {
  modelPath: string;
  title: string;
}

function Loader({ modelTitle }: { modelTitle: string }) {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg min-w-[250px]">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <div className="text-blue-600 font-medium mb-2">
            Loading {modelTitle}
          </div>
          <Progress value={progress} className="w-48 h-2" />
          <div className="text-sm text-gray-500 mt-2">
            {Math.round(progress)}% complete
          </div>
        </div>
      </div>
    </Html>
  );
}

function ErrorDisplay({ error, modelTitle }: { error: string; modelTitle: string }) {
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4 p-6 bg-red-50 border border-red-200 rounded-lg shadow-lg min-w-[300px] max-w-[400px]">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-red-800 font-medium mb-2">
            Failed to load {modelTitle}
          </div>
          <div className="text-sm text-red-600 mb-3">
            {error}
          </div>
          <div className="text-xs text-red-500">
            Using placeholder model instead
          </div>
        </div>
      </div>
    </Html>
  );
}

function Model({ url, modelId, onError }: { url: string; modelId: string; onError: (error: string) => void }) {
  console.log(`Attempting to load model from: ${url}`);
  
  try {
    const { scene } = useGLTF(url);
    console.log(`Successfully rendered model: ${modelId}`, scene);
    return <primitive object={scene} scale={1} />;
  } catch (error) {
    console.error(`Render error for model: ${modelId}`, error);
    onError(`Failed to parse 3D model file`);
    return <PlaceholderModel type={modelId} />;
  }
}

function ModelErrorBoundary({ children, onError }: { children: React.ReactNode; onError: (error: string) => void }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('GLB') || event.message?.includes('GLTF')) {
        console.error('GLB Error caught:', event.error);
        setHasError(true);
        onError('GLB file parsing failed');
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('GLB') || event.reason?.message?.includes('GLTF')) {
        console.error('GLB Promise rejection caught:', event.reason);
        setHasError(true);
        onError('GLB file loading failed');
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  if (hasError) {
    return null;
  }

  return <>{children}</>;
}

function ModelWithFallback({ url, modelId, title }: { url: string; modelId: string; title: string }) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleError = (error: string) => {
    console.log(`Error occurred for ${modelId}: ${error}`);
    setErrorMessage(error);
    setTimeout(() => {
      setUsePlaceholder(true);
    }, 3000);
  };

  if (usePlaceholder) {
    console.log(`Using placeholder fallback for: ${modelId}`);
    return <PlaceholderModel type={modelId} />;
  }

  if (errorMessage) {
    return <ErrorDisplay error={errorMessage} modelTitle={title} />;
  }

  return (
    <ModelErrorBoundary onError={handleError}>
      <Suspense fallback={<Loader modelTitle={title} />}>
        <Model url={url} modelId={modelId} onError={handleError} />
      </Suspense>
    </ModelErrorBoundary>
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
        onError={(error) => {
          console.error(`Canvas error for model ${modelId}:`, error);
        }}
      >
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <ModelWithFallback url={modelPath} modelId={modelId} title={title} />
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

      {/* Help overlay for blocked content */}
      <div className="absolute top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs max-w-[200px]">
        <div className="font-medium text-yellow-800 mb-1">Trouble loading?</div>
        <div className="text-yellow-700">Try disabling ad blockers or browser extensions</div>
      </div>
    </div>
  );
};

export default ModelViewer;
