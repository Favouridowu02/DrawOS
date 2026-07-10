# Changelog

All notable changes to **DrawOS** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- **Cloud & Real-time Collaboration**: Optional end-to-end encrypted multi-user syncing via WebSockets / CRDTs.
- **Boolean Operations**: Union, difference, intersection, and exclusion for vector shapes.
- **Custom Components Registry**: Reusable symbol libraries and custom template sharing across local workspaces.

---

## [1.0.0] - 2026-07-10

### Added
- **Core Vector Drawing Engine**:
  - High-performance SVG interactive canvas (`MainEditor`).
  - Shape creation tools: Rectangle, Circle, Freeform Path/Pen.
  - Interactive Text tool with inline editing (`foreignObject`) and live font styling.
  - Image embed tool for external URLs or uploaded local image assets.
- **Hierarchical Layers & Property Inspector**:
  - Left sidebar (`LAYERS HIERARCHY`) inspired by Figma and Grida for ordering, locking, visibility toggling, and double-click camera framing.
  - Right sidebar (`DOCUMENT SPECIFICATIONS`) for live adjustment of fills, strokes, opacity, dimensions, coordinates, and corner radius.
- **Grid Snapping & Canvas Navigation**:
  - Adjustable grid spacing (`12px`, `24px`, `48px`) with snap-to-grid toggle.
  - Infinite canvas pan (`Space + Drag` or middle-click) and mouse-wheel zoom (`10%` to `500%`).
- **Command Palette & Keyboard Workflow**:
  - Instant command search modal via `Ctrl + K` / `Cmd + K`.
  - Comprehensive keyboard shortcuts (`V`, `R`, `O`, `P`, `T`, `I`, `Delete`, `Esc`, `Ctrl+Z`, `Ctrl+Y`).
- **Local-First Persistence**:
  - Automatic saving to browser local storage.
  - Recent drawings gallery and project management on the Welcome screen.
- **Exporting & Templates**:
  - Export drawings clean to SVG/PNG workflows.
  - Pre-built templates for Flowcharts, Wireframes, and System Architecture diagrams.
