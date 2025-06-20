
import { lightPresets } from './constants';
import { ViewerSettings } from './types';
import { LightSource } from './LightSource';

interface LightsProps {
  settings: ViewerSettings;
}

export function Lights({ settings }: LightsProps) {
  const lightColor = lightPresets.find(p => p.id === settings.lightPreset)?.color || '#ffffff';
  const rotationRad = (settings.lightRotation * Math.PI) / 180;

  // Use custom light position or calculate from rotation
  const lightPosition: [number, number, number] = settings.lightPosition || [
    Math.cos(rotationRad) * 10,
    10,
    Math.sin(rotationRad) * 10
  ];

  return (
    <>
      <ambientLight intensity={settings.environmentLight * 0.3} color={lightColor} />
      <directionalLight
        position={lightPosition}
        intensity={settings.environmentLight * 0.8}
        color={lightColor}
        castShadow
      />
      <pointLight
        position={[
          Math.cos(rotationRad + Math.PI / 3) * 5,
          5,
          Math.sin(rotationRad + Math.PI / 3) * 5
        ]}
        intensity={settings.environmentLight * 0.5}
        color={lightColor}
      />
      <spotLight
        position={[
          Math.cos(rotationRad - Math.PI / 3) * 8,
          8,
          Math.sin(rotationRad - Math.PI / 3) * 8
        ]}
        angle={0.3}
        penumbra={0.5}
        intensity={settings.environmentLight * 0.6}
        color={lightColor}
        castShadow
      />
      
      {/* Light source visualization */}
      <LightSource 
        position={lightPosition}
        visible={settings.showLightSource}
      />
    </>
  );
}
