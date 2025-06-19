
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
    <div className="bg-white rounded-lg p-3 shadow-sm border">
      {/* Single compact row with all controls */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {/* Toggle Switches */}
        <div className="flex items-center space-x-1">
          <Lightbulb className="w-3 h-3" />
          <Switch
            checked={settings.backgroundLight}
            onCheckedChange={(checked) => updateSetting('backgroundLight', checked)}
            className="scale-75"
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <Sun className="w-3 h-3" />
          <Switch
            checked={settings.showLightSource}
            onCheckedChange={(checked) => updateSetting('showLightSource', checked)}
            className="scale-75"
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <Grid className="w-3 h-3" />
          <Switch
            checked={settings.showWireframe}
            onCheckedChange={(checked) => updateSetting('showWireframe', checked)}
            className="scale-75"
          />
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-300"></div>

        {/* Light Intensity */}
        <div className="flex items-center space-x-2 min-w-[120px]">
          <Eye className="w-3 h-3" />
          <Slider
            value={[settings.environmentLight]}
            onValueChange={([value]) => updateSetting('environmentLight', value)}
            max={3}
            min={0}
            step={0.1}
            className="flex-1 h-1"
          />
          <span className="text-xs text-gray-600 w-6">{settings.environmentLight.toFixed(1)}</span>
        </div>

        {/* Light Rotation */}
        <div className="flex items-center space-x-2 min-w-[120px]">
          <RotateCcw className="w-3 h-3" />
          <Slider
            value={[settings.lightRotation]}
            onValueChange={([value]) => updateSetting('lightRotation', value)}
            max={360}
            min={0}
            step={15}
            className="flex-1 h-1"
          />
          <span className="text-xs text-gray-600 w-8">{settings.lightRotation}°</span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-300"></div>

        {/* Light Color Presets */}
        <div className="flex items-center space-x-1">
          <Palette className="w-3 h-3" />
          <ToggleGroup
            type="single"
            value={settings.lightPreset}
            onValueChange={(value) => value && updateSetting('lightPreset', value)}
            className="h-6"
          >
            {lightPresets.map((preset) => {
              const IconComponent = preset.icon;
              return (
                <ToggleGroupItem key={preset.id} value={preset.id} className="h-6 w-6 p-1">
                  <IconComponent className="w-3 h-3" style={{ color: preset.color }} />
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-gray-300"></div>

        {/* Background */}
        <div className="flex items-center space-x-1">
          <Label className="text-xs">BG:</Label>
          <Select
            value={backgroundOptions.find(bg => bg.value === settings.backgroundColor)?.id || 'dark-gradient'}
            onValueChange={(value) => {
              const bg = backgroundOptions.find(bg => bg.id === value);
              if (bg) updateSetting('backgroundColor', bg.value);
            }}
          >
            <SelectTrigger className="h-6 w-20 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {backgroundOptions.map((bg) => (
                <SelectItem key={bg.id} value={bg.id} className="text-xs">
                  {bg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Viewpoint */}
        <div className="flex items-center space-x-1">
          <Camera className="w-3 h-3" />
          <ToggleGroup
            type="single"
            value={settings.viewpoint}
            onValueChange={(value) => value && changeViewpoint(value)}
            className="h-6"
          >
            {viewpoints.map((viewpoint) => (
              <ToggleGroupItem key={viewpoint.id} value={viewpoint.id} className="h-6 px-2 text-xs">
                {viewpoint.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Reset Zoom */}
        <Button onClick={resetZoom} variant="outline" size="sm" className="h-6 px-2 text-xs">
          <ZoomIn className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
}
