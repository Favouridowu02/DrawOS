# DrawOS API Specification

This document details the main export APIs provided by DrawOS packages.

## `@drawos/geometry`

### `snap(val: number, gridSize: number, enabled: boolean): number`
Snape coordinates to nearest grid lines if snapping is enabled.

### `isPointInRect(px, py, rx, ry, rw, rh): boolean`
Performs responsive hit-testing against standard rectangular bounds.

### `isPointInCircle(px, py, cx, cy, radius): boolean`
Computes Euclidean distance to test if a click falls inside a circle region.

---

## `@drawos/engine`

### `createRectangle(x, y, w, h, fill, stroke, strokeWidth): DrawingObject`
Generates a fully qualified rect vector object.

### `createCircle(x, y, r, fill, stroke, strokeWidth): DrawingObject`
Creates a standard circle object.

### `reorderObject(objects, id, direction): DrawingObject[]`
Reorders list indices to push elements forward, backward, to the front, or to the back.

---

## `@drawos/history`

### `createHistory<T>(initialPresent: T): HistoryState<T>`
Boots a blank history stack.

### `pushState<T>(state, nextState): HistoryState<T>`
Pushes a new state snapshot onto the past stack and clears redos.

### `undo<T>(state): HistoryState<T>`
Travels one step back into past states.
