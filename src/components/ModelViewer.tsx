
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei';
import { Suspense, useState, Component, ReactNode } from 'react';
import PlaceholderModel from './PlaceholderModel';
import { Progress } from '@/components/ui/progress';

interface ModelViewerProps {
  modelPath: string;
  title: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Model loading error:', error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
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

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} />;
}

function ModelWithFallback({ url, modelId, title }: { url: string; modelId: string; title: string }) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  if (usePlaceholder) {
    console.log(`Using placeholder fallback for: ${modelId}`);
    return <PlaceholderModel type={modelId} />;
  }

  return (
    <ModelErrorBoundary onError={() => setUsePlaceholder(true)}>
      <Suspense fallback={<Loader modelTitle={title} />}>
        <Model url={url} />
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
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}
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
          minDistance={1}
          maxDistance={8}
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
