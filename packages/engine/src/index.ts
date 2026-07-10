// packages/engine/src/index.ts

import { DrawingObject } from '../../../src/types';
import { generateId } from '@drawos/utils';

export function createRectangle(x: number, y: number, width: number, height: number, fill: string, stroke: string, strokeWidth: number): DrawingObject {
  return {
    id: generateId('rect'),
    type: 'rectangle',
    x,
    y,
    width,
    height,
    fill,
    stroke,
    strokeWidth
  };
}

export function createCircle(x: number, y: number, radius: number, fill: string, stroke: string, strokeWidth: number): DrawingObject {
  return {
    id: generateId('circle'),
    type: 'circle',
    x,
    y,
    radius,
    fill,
    stroke,
    strokeWidth
  };
}

export function createPath(x: number, y: number, points: string, stroke: string, strokeWidth: number): DrawingObject {
  return {
    id: generateId('path'),
    type: 'path',
    x,
    y,
    points,
    fill: 'transparent',
    stroke,
    strokeWidth
  };
}

export function createText(x: number, y: number, text: string, stroke: string): DrawingObject {
  return {
    id: generateId('text'),
    type: 'text',
    x,
    y,
    text,
    fill: 'transparent',
    stroke,
    strokeWidth: 1
  };
}

export function createImage(x: number, y: number, imageUrl: string, width = 140, height = 100): DrawingObject {
  return {
    id: generateId('image'),
    type: 'image',
    x,
    y,
    width,
    height,
    imageUrl,
    fill: 'transparent',
    stroke: '#004ac6',
    strokeWidth: 1
  };
}

export function updateObjectProperty<K extends keyof DrawingObject>(
  objects: DrawingObject[],
  id: string,
  key: K,
  value: DrawingObject[K]
): DrawingObject[] {
  return objects.map(obj => {
    if (obj.id === id) {
      return { ...obj, [key]: value };
    }
    return obj;
  });
}

export function nudgeObject(obj: DrawingObject, dx: number, dy: number): DrawingObject {
  return {
    ...obj,
    x: obj.x + dx,
    y: obj.y + dy
  };
}

export function deleteObject(objects: DrawingObject[], id: string): DrawingObject[] {
  return objects.filter(obj => obj.id !== id);
}

export function reorderObject(objects: DrawingObject[], id: string, direction: 'forward' | 'backward' | 'front' | 'back'): DrawingObject[] {
  const index = objects.findIndex(o => o.id === id);
  if (index === -1) return objects;

  const result = [...objects];
  const [target] = result.splice(index, 1);

  if (direction === 'back') {
    result.unshift(target);
  } else if (direction === 'front') {
    result.push(target);
  } else if (direction === 'backward') {
    const newIndex = Math.max(0, index - 1);
    result.splice(newIndex, 0, target);
  } else if (direction === 'forward') {
    const newIndex = Math.min(result.length, index + 1);
    result.splice(newIndex, 0, target);
  }

  return result;
}
