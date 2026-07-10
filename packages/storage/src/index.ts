// packages/storage/src/index.ts

import { Drawing, CanvasSettings } from '../../../src/types';

const STORAGE_KEYS = {
  DRAWINGS: 'drawos-recent-drawings',
  SETTINGS: 'drawos-canvas-settings',
};

export function saveRecentDrawings(drawings: Drawing[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAWINGS, JSON.stringify(drawings));
  } catch (e) {
    console.error('Failed to save drawings to local storage', e);
  }
}

export function loadRecentDrawings(): Drawing[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAWINGS);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load drawings from local storage', e);
    return null;
  }
}

export function saveCanvasSettings(settings: CanvasSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to local storage', e);
  }
}

export function loadCanvasSettings(): CanvasSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load settings from local storage', e);
    return null;
  }
}

export function exportDrawingAsJSON(drawing: Drawing): string {
  return JSON.stringify(drawing, null, 2);
}

export function validateImportedJSON(raw: string): Drawing | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.name && Array.isArray(parsed.objects)) {
      return parsed as Drawing;
    }
  } catch (e) {
    console.error('Failed to validate imported JSON', e);
  }
  return null;
}
