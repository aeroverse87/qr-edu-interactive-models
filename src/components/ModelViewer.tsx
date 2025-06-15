
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei';
import React, { Suspense, useState, Component, ReactNode } from 'react';
import PlaceholderModel from './PlaceholderModel';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Palette, Lightbulb, Eye, Grid } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import * as THREE from 'three';

interface ModelViewerProps {
  modelPath: string;
  title: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ViewerSettings {
  backgroundLight: boolean;
  environmentLight: number;
  backgroundColor: string;
  showOutline: boolean;
  showWireframe: boolean;
}

const backgroundOptions = [
  { id: 'dark-gradient', name: 'Dark Gradient', value: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' },
  { id: 'blue-gradient', name: 'Blue Gradient', value: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' },
  { id: 'purple-gradient', name: 'Purple Gradient', value: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)' },
  { id: 'green-gradient', name: 'Green Gradient', value: 'linear-gradient(135deg, #166534 0%, #16a34a 100%)' },
  { id: 'red-gradient', name: 'Red Gradient', value: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)' },
  { id: 'orange-gradient', name: 'Orange Gradient', value: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)' },
  { id: 'pink-gradient', name: 'Pink Gradient', value: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)' },
  { id: 'black', name: 'Pure Black', value: '#000000' },
  { id: 'white', name: 'Pure White', value: '#ffffff' },
  { id: 'gray', name: 'Gray', value: '#6b7280' },
];

class ErrorBoundary extends Component<
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

function Model({ url, settings }: { url: string; settings: ViewerSettings }) {
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

  return <primitive object={scene} scale={4} />;
}

function ModelWithFallback({ url, modelId, title, settings }: { url: string; modelId: string; title: string; settings: ViewerSettings }) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);

  if (usePlaceholder) {
    console.log(`Using placeholder fallback for: ${modelId}`);
    return <PlaceholderModel type={modelId} />;
  }

  return (
    <ErrorBoundary onError={() => setUsePlaceholder(true)}>
      <Suspense fallback={<Loader modelTitle={title} />}>
        <Model url={url} settings={settings} />
      </Suspense>
    </ErrorBoundary>
  );
}

const ModelViewer = ({ modelPath, title }: ModelViewerProps) => {
  const modelId = modelPath.split('/').pop()?.replace('.glb', '') || '';
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [settings, setSettings] = useState<ViewerSettings>({
    backgroundLight: true,
    environmentLight: 0.6,
    backgroundColor: backgroundOptions[0].value,
    showOutline: false,
    showWireframe: false,
  });
  
  console.log(`ModelViewer - Title: ${title}, ModelPath: ${modelPath}, ModelId: ${modelId}`);

  const updateSetting = <K extends keyof ViewerSettings>(key: K, value: ViewerSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 0, 1.5], fov: 50 }}
        style={{ background: settings.backgroundColor }}
      >
        {settings.backgroundLight && (
          <>
            <ambientLight intensity={settings.environmentLight} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />
          </>
        )}
        
        <ModelWithFallback url={modelPath} modelId={modelId} title={title} settings={settings} />
        <Environment preset="studio" />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.01}
          maxDistance={50}
          zoomSpeed={2}
        />
      </Canvas>
      
      {/* Controls Panel */}
      <div className="absolute top-4 left-4">
        <Collapsible open={isControlsOpen} onOpenChange={setIsControlsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
              <Settings className="w-4 h-4 mr-2" />
              Controls
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 min-w-[280px] space-y-4">
              {/* Background Light Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <Label htmlFor="background-light">Background Light</Label>
                </div>
                <Switch
                  id="background-light"
                  checked={settings.backgroundLight}
                  onCheckedChange={(checked) => updateSetting('backgroundLight', checked)}
                />
              </div>

              {/* Environment Light Intensity */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Light Intensity: {settings.environmentLight.toFixed(1)}</span>
                </Label>
                <Slider
                  value={[settings.environmentLight]}
                  onValueChange={([value]) => updateSetting('environmentLight', value)}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Background</span>
                </Label>
                <Select
                  value={backgroundOptions.find(bg => bg.value === settings.backgroundColor)?.id || 'dark-gradient'}
                  onValueChange={(value) => {
                    const bg = backgroundOptions.find(bg => bg.id === value);
                    if (bg) updateSetting('backgroundColor', bg.value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {backgroundOptions.map((bg) => (
                      <SelectItem key={bg.id} value={bg.id}>
                        {bg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Wireframe Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Grid className="w-4 h-4" />
                  <Label htmlFor="wireframe">Wireframe</Label>
                </div>
                <Switch
                  id="wireframe"
                  checked={settings.showWireframe}
                  onCheckedChange={(checked) => updateSetting('showWireframe', checked)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

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
