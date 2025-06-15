
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Lightbulb, Eye, Grid, RotateCcw, Camera, Palette } from 'lucide-react';
import { ViewerSettings } from './types';
import { backgroundOptions, lightPresets, viewpoints } from './constants';

interface ModelViewerControlsProps {
  settings: ViewerSettings;
  updateSetting: <K extends keyof ViewerSettings>(key: K, value: ViewerSettings[K]) => void;
  changeViewpoint: (viewpointId: string) => void;
}

export function ModelViewerControls({ settings, updateSetting, changeViewpoint }: ModelViewerControlsProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border space-y-4">
      {/* Lighting Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <Label htmlFor="background-light">Background Light</Label>
            <Switch
              id="background-light"
              checked={settings.backgroundLight}
              onCheckedChange={(checked) => updateSetting('backgroundLight', checked)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Grid className="w-4 h-4" />
            <Label htmlFor="wireframe">Wireframe</Label>
            <Switch
              id="wireframe"
              checked={settings.showWireframe}
              onCheckedChange={(checked) => updateSetting('showWireframe', checked)}
            />
          </div>
        </div>

        {/* Light Intensity */}
        <div className="flex items-center space-x-4">
          <Label className="flex items-center space-x-2 min-w-[120px]">
            <Eye className="w-4 h-4" />
            <span>Light: {settings.environmentLight.toFixed(1)}</span>
          </Label>
          <Slider
            value={[settings.environmentLight]}
            onValueChange={([value]) => updateSetting('environmentLight', value)}
            max={10}
            min={0}
            step={0.1}
            className="flex-1"
          />
        </div>

        {/* Light Rotation */}
        <div className="flex items-center space-x-4">
          <Label className="flex items-center space-x-2 min-w-[120px]">
            <RotateCcw className="w-4 h-4" />
            <span>Rotation: {settings.lightRotation}°</span>
          </Label>
          <Slider
            value={[settings.lightRotation]}
            onValueChange={([value]) => updateSetting('lightRotation', value)}
            max={360}
            min={0}
            step={15}
            className="flex-1"
          />
        </div>
      </div>

      {/* Light Presets */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <Palette className="w-4 h-4" />
          <span>Light Color</span>
        </Label>
        <ToggleGroup
          type="single"
          value={settings.lightPreset}
          onValueChange={(value) => value && updateSetting('lightPreset', value)}
          className="justify-start"
        >
          {lightPresets.map((preset) => {
            const IconComponent = preset.icon;
            return (
              <ToggleGroupItem key={preset.id} value={preset.id} className="flex items-center space-x-1">
                <IconComponent className="w-4 h-4" style={{ color: preset.color }} />
                <span>{preset.name}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      {/* Background Selection */}
      <div className="flex items-center space-x-4">
        <Label className="flex items-center space-x-2 min-w-[120px]">
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
          <SelectTrigger className="flex-1">
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

      {/* Viewpoint Controls */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <Camera className="w-4 h-4" />
          <span>Viewpoint</span>
        </Label>
        <ToggleGroup
          type="single"
          value={settings.viewpoint}
          onValueChange={(value) => value && changeViewpoint(value)}
          className="justify-start"
        >
          {viewpoints.map((viewpoint) => (
            <ToggleGroupItem key={viewpoint.id} value={viewpoint.id}>
              {viewpoint.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
