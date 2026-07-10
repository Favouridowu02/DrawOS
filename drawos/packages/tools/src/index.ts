// packages/tools/src/index.ts

import { ToolType } from '../../../src/types';

export interface ToolDefinition {
  type: ToolType;
  name: string;
  key: string;
  description: string;
}

export const TOOLS_LIST: ToolDefinition[] = [
  {
    type: 'select',
    name: 'Select & Move',
    key: 'V',
    description: 'Select elements, drag to move, delete or edit properties'
  },
  {
    type: 'rectangle',
    name: 'Rectangle',
    key: 'R',
    description: 'Click and drag to draw rectangular frames'
  },
  {
    type: 'circle',
    name: 'Circle',
    key: 'O',
    description: 'Click and drag to sketch circles from a origin'
  },
  {
    type: 'path',
    name: 'Path / Freehand',
    key: 'P',
    description: 'Drag on canvas to build complex path vectors'
  },
  {
    type: 'text',
    name: 'Text Label',
    key: 'T',
    description: 'Click anywhere to place a editable monospace label'
  },
  {
    type: 'image',
    name: 'Image Layer',
    key: 'I',
    description: 'Add a premium graphical asset card to the drawing'
  }
];

export function getToolByShortcut(key: string): ToolType | null {
  const normalized = key.toLowerCase();
  const tool = TOOLS_LIST.find(t => t.key.toLowerCase() === normalized);
  return tool ? tool.type : null;
}
