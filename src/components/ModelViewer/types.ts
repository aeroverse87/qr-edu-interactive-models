
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
}

export interface ErrorBoundaryState {
  hasError: boolean;
}
