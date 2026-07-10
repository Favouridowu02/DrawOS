// packages/camera/src/index.ts

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export function screenToWorld(sx: number, sy: number, viewport: Viewport) {
  return {
    x: (sx - viewport.x) / viewport.zoom,
    y: (sy - viewport.y) / viewport.zoom
  };
}

export function worldToScreen(wx: number, wy: number, viewport: Viewport) {
  return {
    x: wx * viewport.zoom + viewport.x,
    y: wy * viewport.zoom + viewport.y
  };
}

export function zoomAtScreenPoint(
  sx: number,
  sy: number,
  viewport: Viewport,
  zoomFactor: number,
  minZoom = 0.1,
  maxZoom = 10
): Viewport {
  const newZoom = Math.max(minZoom, Math.min(maxZoom, viewport.zoom * zoomFactor));
  const worldPoint = screenToWorld(sx, sy, viewport);
  return {
    zoom: newZoom,
    x: sx - worldPoint.x * newZoom,
    y: sy - worldPoint.y * newZoom
  };
}
