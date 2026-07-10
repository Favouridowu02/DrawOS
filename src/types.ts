export type ToolType = 'select' | 'rectangle' | 'circle' | 'path' | 'text' | 'image';

export interface DrawingObject {
  id: string;
  type: 'rectangle' | 'circle' | 'path' | 'text' | 'image';
  x: number;
  y: number;
  width?: number; // for rectangle, image
  height?: number; // for rectangle, image
  radius?: number; // for circle
  points?: string; // path SVG description "M x y L x y"
  text?: string; // for text
  imageUrl?: string; // for image
  fill: string; // hex
  stroke: string; // hex
  strokeWidth: number;
  visible?: boolean; // Grida inspiration: toggle visibility
  locked?: boolean;  // Grida inspiration: lock position/selection
  name?: string;     // Grida inspiration: custom layer naming
}

export interface Drawing {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  objects: DrawingObject[];
}

export interface CanvasSettings {
  gridSize: number;
  snapToGrid: boolean;
  autosave: boolean;
  exportQuality: number; // 1, 2, 3, 4
  showGrid: boolean;
  transparentBackground: boolean;
  includeMetadata: boolean;
  filename: string;
}
