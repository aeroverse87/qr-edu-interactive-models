
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lightbulb, Eye, Grid3x3, RotateCcw, Camera, Palette, Sun, ZoomIn, Grid2x2 } from 'lucide-react';
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
    <TooltipProvider>
      <div className="bg-white rounded-lg p-3 shadow-sm border">
        {/* Single compact row with all controls */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Toggle Switches with Tooltips */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Lightbulb className="w-3 h-3" />
                <Switch
                  checked={settings.backgroundLight}
                  onCheckedChange={(checked) => updateSetting('backgroundLight', checked)}
                  className="scale-75"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle background lighting on/off</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Sun className="w-3 h-3" />
                <Switch
                  checked={settings.showLightSource}
                  onCheckedChange={(checked) => updateSetting('showLightSource', checked)}
                  className="scale-75"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show/hide light source indicator</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Grid3x3 className="w-3 h-3" />
                <Switch
                  checked={settings.showWireframe}
                  onCheckedChange={(checked) => updateSetting('showWireframe', checked)}
                  className="scale-75"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle wireframe view</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Grid2x2 className="w-3 h-3" />
                <Switch
                  checked={settings.showGrid}
                  onCheckedChange={(checked) => updateSetting('showGrid', checked)}
                  className="scale-75"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Show/hide floor grid</p>
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="h-4 w-px bg-gray-300"></div>

          {/* Light Intensity with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust environment light intensity (0.0 - 3.0)</p>
            </TooltipContent>
          </Tooltip>

          {/* Light Rotation with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Rotate light source (0° - 360°)</p>
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="h-4 w-px bg-gray-300"></div>

          {/* Light Color Dropdown with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Palette className="w-3 h-3" />
                <Select
                  value={settings.lightPreset}
                  onValueChange={(value) => updateSetting('lightPreset', value)}
                >
                  <SelectTrigger className="h-6 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lightPresets.map((preset) => {
                      const IconComponent = preset.icon;
                      return (
                        <SelectItem key={preset.id} value={preset.id} className="text-xs">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-3 h-3" style={{ color: preset.color }} />
                            <span>{preset.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose light color preset (warm, cool, natural, etc.)</p>
            </TooltipContent>
          </Tooltip>

          {/* Divider */}
          <div className="h-4 w-px bg-gray-300"></div>

          {/* Background with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Change the background color/gradient</p>
            </TooltipContent>
          </Tooltip>

          {/* 3D Viewport Controls */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Camera className="w-3 h-3" />
                <Select
                  value={settings.viewpoint}
                  onValueChange={(value) => changeViewpoint(value)}
                >
                  <SelectTrigger className="h-6 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {viewpoints.map((viewpoint) => (
                      <SelectItem key={viewpoint.id} value={viewpoint.id} className="text-xs">
                        {viewpoint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>3D Viewport: Change camera viewpoint (front, back, side views)</p>
            </TooltipContent>
          </Tooltip>

          {/* Reset Zoom with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={resetZoom} variant="outline" size="sm" className="h-6 px-2 text-xs">
                <ZoomIn className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset camera zoom to default position</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
