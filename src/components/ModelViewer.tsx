
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
  const [modelLoaded, setModelLoaded] = useState(false);
  
  console.log(`Attempting to load model from: ${url}`);
  
  useEffect(() => {
    // Preload and validate the GLB file
    const loadAndValidateModel = async () => {
      try {
        const response = await fetch(url);
        console.log(`Model file response status for ${modelId}:`, response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            onError(`Model file not found (404)`);
          } else if (response.status === 403) {
            onError(`Access denied (403) - check file permissions`);
          } else {
            onError(`Server error (${response.status})`);
          }
          return;
        }

        // Check content type
        const contentType = response.headers.get('content-type');
        console.log(`Content type for ${modelId}:`, contentType);
        
        // Try to preload with useGLTF to catch parsing errors early
        try {
          await new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            loader.load(
              url,
              (gltf) => {
                console.log(`Successfully preloaded model: ${modelId}`, gltf);
                setModelLoaded(true);
                resolve(gltf);
              },
              (progress) => {
                console.log(`Loading progress for ${modelId}:`, progress);
              },
              (error) => {
                console.error(`GLB parsing error for model: ${modelId}`, error);
                onError(`GLB file corrupted or invalid`);
                reject(error);
              }
            );
          });
        } catch (parseError) {
          console.error(`Failed to parse GLB for ${modelId}:`, parseError);
          onError(`GLB file corrupted or invalid`);
        }
        
      } catch (networkError) {
        console.error(`Network error loading model ${modelId}:`, networkError);
        if (networkError.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          onError(`Blocked by ad blocker or browser extension`);
        } else if (networkError.message.includes('CORS')) {
          onError(`CORS error - check file permissions`);
        } else {
          onError(`Network error: ${networkError.message}`);
        }
      }
    };

    loadAndValidateModel();
  }, [url, modelId, onError]);

  if (!modelLoaded) {
    return null; // Let the Suspense fallback handle loading state
  }
  
  try {
    const { scene } = useGLTF(url);
    console.log(`Successfully rendered model: ${modelId}`, scene);
    return <primitive object={scene} scale={1} />;
  } catch (error) {
    console.error(`Render error for model: ${modelId}`, error);
    return <PlaceholderModel type={modelId} />;
  }
}

function ModelWithFallback({ url, modelId, title }: { url: string; modelId: string; title: string }) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleError = (error: string) => {
    console.log(`Error occurred for ${modelId}: ${error}`);
    setErrorMessage(error);
    setTimeout(() => {
      setUsePlaceholder(true);
    }, 3000); // Show error for 3 seconds before switching to placeholder
  };

  if (usePlaceholder) {
    console.log(`Using placeholder fallback for: ${modelId}`);
    return <PlaceholderModel type={modelId} />;
  }

  if (errorMessage) {
    return <ErrorDisplay error={errorMessage} modelTitle={title} />;
  }

  return (
    <Suspense fallback={<Loader modelTitle={title} />}>
      <Model url={url} modelId={modelId} onError={handleError} />
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
