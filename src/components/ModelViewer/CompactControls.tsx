
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Lightbulb, Eye, Grid, RotateCcw, Camera, Palette, ZoomIn, Maximize, Minimize } from 'lucide-react';
import { ViewerSettings } from './types';
import { backgroundOptions, lightPresets, viewpoints } from './constants';

interface CompactControlsProps {
  settings: ViewerSettings;
  updateSetting: <K extends keyof ViewerSettings>(key: K, value: ViewerSettings[K]) => void;
  changeViewpoint: (viewpointId: string) => void;
  resetZoom: () => void;
}

export function CompactControls({ settings, updateSetting, changeViewpoint, resetZoom }: CompactControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const viewerElement = document.querySelector('.model-viewer-container') as HTMLElement;
    if (!viewerElement) return;

    if (!isFullscreen) {
      // Enter fullscreen
      viewerElement.style.position = 'fixed';
      viewerElement.style.top = '0';
      viewerElement.style.left = '0';
      viewerElement.style.width = '100vw';
      viewerElement.style.height = '100vh';
      viewerElement.style.zIndex = '9999';
      viewerElement.style.backgroundColor = 'white';
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      viewerElement.style.position = '';
      viewerElement.style.top = '';
      viewerElement.style.left = '';
      viewerElement.style.width = '';
      viewerElement.style.height = '';
      viewerElement.style.zIndex = '';
      viewerElement.style.backgroundColor = '';
      setIsFullscreen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Lighting Controls */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              Lighting
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="background-light"
                  checked={settings.backgroundLight}
                  onCheckedChange={(checked) => updateSetting('backgroundLight', checked)}
                />
                <Label htmlFor="background-light">Background Light</Label>
              </div>

              <div className="flex items-center space-x-4">
                <Label className="flex items-center space-x-2 min-w-[120px]">
                  <Eye className="w-4 h-4" />
                  <span>Intensity: {settings.environmentLight.toFixed(1)}</span>
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
          </PopoverContent>
        </Popover>

        {/* Light Presets */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              Colors
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <Label>Light Color</Label>
              <ToggleGroup
                type="single"
                value={settings.lightPreset}
                onValueChange={(value) => value && updateSetting('lightPreset', value)}
                className="grid grid-cols-2 gap-1"
              >
                {lightPresets.map((preset) => {
                  const IconComponent = preset.icon;
                  return (
                    <ToggleGroupItem key={preset.id} value={preset.id} className="flex items-center space-x-1 text-xs">
                      <IconComponent className="w-3 h-3" style={{ color: preset.color }} />
                      <span>{preset.name}</span>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>
          </PopoverContent>
        </Popover>

        {/* Background */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Palette className="w-4 h-4" />
              Background
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label>Background</Label>
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
          </PopoverContent>
        </Popover>

        {/* Viewpoints */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Camera className="w-4 h-4" />
              View
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Label>Viewpoint</Label>
              <ToggleGroup
                type="single"
                value={settings.viewpoint}
                onValueChange={(value) => value && changeViewpoint(value)}
                className="grid grid-cols-2 gap-1"
              >
                {viewpoints.map((viewpoint) => (
                  <ToggleGroupItem key={viewpoint.id} value={viewpoint.id} className="text-xs">
                    {viewpoint.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </PopoverContent>
        </Popover>

        {/* Wireframe Toggle */}
        <Button
          variant={settings.showWireframe ? "default" : "outline"}
          size="sm"
          onClick={() => updateSetting('showWireframe', !settings.showWireframe)}
          className="flex items-center gap-1"
        >
          <Grid className="w-4 h-4" />
          Wireframe
        </Button>

        {/* Reset Zoom */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetZoom}
          className="flex items-center gap-1"
        >
          <ZoomIn className="w-4 h-4" />
          Reset Zoom
        </Button>

        {/* Fullscreen Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="flex items-center gap-1"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </Button>
      </div>
    </div>
  );
}
