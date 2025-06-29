
export interface ModelViewerProps {
  modelPath: string;
  title: string;
}

export interface ViewerSettings {
  backgroundLight: boolean;
  environmentLight: number;
  backgroundColor: string;
  showOutline: boolean;
  showWireframe: boolean;
  lightRotation: number;
  lightPreset: string;
  viewpoint: string;
  showAxes: boolean;
  showLightSource: boolean;
  lightPosition: [number, number, number];
  showGrid: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}
