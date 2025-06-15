
import { Sun, Moon, Flame, Lightbulb, Zap, Eye } from 'lucide-react';

export const backgroundOptions = [
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

export const lightPresets = [
  { id: 'white', name: 'White', color: '#ffffff', icon: Sun },
  { id: 'warm', name: 'Warm', color: '#ffd700', icon: Lightbulb },
  { id: 'cool', name: 'Cool', color: '#87ceeb', icon: Moon },
  { id: 'red', name: 'Red', color: '#ff4444', icon: Flame },
  { id: 'blue', name: 'Blue', color: '#4444ff', icon: Zap },
  { id: 'green', name: 'Green', color: '#44ff44', icon: Eye },
];

export const viewpoints = [
  { id: 'front', name: 'Front', position: [0, 0, 5] as [number, number, number] },
  { id: 'back', name: 'Back', position: [0, 0, -5] as [number, number, number] },
  { id: 'left', name: 'Left', position: [-5, 0, 0] as [number, number, number] },
  { id: 'right', name: 'Right', position: [5, 0, 0] as [number, number, number] },
  { id: 'top', name: 'Top', position: [0, 5, 0] as [number, number, number] },
  { id: 'bottom', name: 'Bottom', position: [0, -5, 0] as [number, number, number] },
];
