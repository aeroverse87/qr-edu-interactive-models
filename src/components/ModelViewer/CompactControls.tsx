
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Lightbulb, Eye, Grid, RotateCcw, Camera, Palette, Sun, ZoomIn } from 'lucide-react';
import { ViewerSettings } from './types';
import { backgroundOptions, lightPresets, viewpoints } from './constants';

interface CompactControlsProps {
  settings: ViewerSettings;
  updateSetting: <K extends keyof ViewerSettings>(key: K, value: ViewerSettings[K]) => void;
  changeViewpoint: (viewpointId: string) => void;
  resetZoom: () => void;
}

export function CompactControls({ settings, updateSetting, changeViewpoint, resetZoom }: CompactControlsProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border space-y-4">
      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4" />
          <Label htmlFor="background-light">Light</Label>
          <Switch
            id="background-light"
            checked={settings.backgroundLight}
            onCheckedChange={(checked) => updateSetting('backgroundLight', checked)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Sun className="w-4 h-4" />
          <Label htmlFor="show-light-source">Show Light Source</Label>
          <Switch
            id="show-light-source"
            checked={settings.showLightSource}
            onCheckedChange={(checked) => updateSetting('showLightSource', checked)}
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

        <Button onClick={resetZoom} variant="outline" size="sm" className="flex items-center space-x-1">
          <ZoomIn className="w-4 h-4" />
          <span>Reset Zoom</span>
        </Button>
      </div>

      {/* Light Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Label className="flex items-center space-x-1 min-w-[80px]">
            <Eye className="w-4 h-4" />
            <span>Intensity</span>
          </Label>
          <Slider
            value={[settings.environmentLight]}
            onValueChange={([value]) => updateSetting('environmentLight', value)}
            max={3}
            min={0}
            step={0.1}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[30px]">{settings.environmentLight.toFixed(1)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Label className="flex items-center space-x-1 min-w-[80px]">
            <RotateCcw className="w-4 h-4" />
            <span>Rotation</span>
          </Label>
          <Slider
            value={[settings.lightRotation]}
            onValueChange={([value]) => updateSetting('lightRotation', value)}
            max={360}
            min={0}
            step={15}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[30px]">{settings.lightRotation}°</span>
        </div>
      </div>

      {/* Light Color Presets */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <Palette className="w-4 h-4" />
          <span>Light Color</span>
        </Label>
        <ToggleGroup
          type="single"
          value={settings.lightPreset}
          onValueChange={(value) => value && updateSetting('lightPreset', value)}
          className="justify-start flex-wrap"
        >
          {lightPresets.map((preset) => {
            const IconComponent = preset.icon;
            return (
              <ToggleGroupItem key={preset.id} value={preset.id} className="flex items-center space-x-1">
                <IconComponent className="w-4 h-4" style={{ color: preset.color }} />
                <span className="hidden sm:inline">{preset.name}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      {/* Background and Viewpoint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Camera className="w-4 h-4" />
            <span>Viewpoint</span>
          </Label>
          <ToggleGroup
            type="single"
            value={settings.viewpoint}
            onValueChange={(value) => value && changeViewpoint(value)}
            className="justify-start flex-wrap"
          >
            {viewpoints.map((viewpoint) => (
              <ToggleGroupItem key={viewpoint.id} value={viewpoint.id} className="text-xs">
                {viewpoint.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
