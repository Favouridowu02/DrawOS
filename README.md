<div align="center">
  <img src="./apps/web/drawos_no_background.png" alt="DrawOS Logo" width="120" height="120" />
  <h1>DrawOS</h1>
  <p><strong>The Free, Open-Source Vector Drawing Engine for the Web</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture--monorepo-structure">Architecture</a> •
    <a href="#keyboard-shortcuts">Shortcuts</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## Overview

**DrawOS** is a high-performance, open-source vector drawing engine and workspace editor built for modern web browsers. Designed with a local-first philosophy and a clean geometric user experience inspired by professional design tools, DrawOS lets you sketch, design, and diagram without accounts, servers, or cloud dependencies.

---

## ✨ Features

- **🎨 Professional Vector Tools**: Draw shapes (Rectangles, Circles, Paths), add editable Typography, and embed external or uploaded Images.
- **🗂️ Hierarchical Layer Management**: Figma & Grida-inspired hierarchical layer sidebar with live ordering, visibility toggling, layer locking, and instant double-click framing.
- **📐 Grid Snapping & Precision**: Configurable grid alignment (snapping or freeform movement) with live canvas metric overlays.
- **⚡ Infinite Canvas & Camera Control**: Smooth pan and zoom across a high-performance SVG rendering pipeline.
- **💾 Local-First Persistence**: Automatic local workspace saving and recent drawings management stored directly in browser storage.
- **⌨️ Keyboard & Command Workflow**: Built-in Command Palette (`Ctrl+K` / `Cmd+K`) and dedicated keyboard shortcuts for rapid tool switching.
- **📤 Export & Templates**: Start immediately with built-in Flowchart and Wireframe templates or export your work cleanly.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or compatible package manager

### 1. Clone & Install

```bash
git clone https://github.com/Favouridowu02/DrawOS.git
cd DrawOS
npm install
```

### 2. Run Local Development Server

Launch the Vite development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to start designing.

### 3. Build for Production

To create an optimized production build:

```bash
npm run build
```

---

## 🏗️ Architecture & Monorepo Structure

DrawOS is architected as a modular TypeScript workspace with clear separation of concerns across core packages:

```
DrawOS/
├── apps/
│   └── web/                   # Main web application shell & Vite configuration
└── packages/
    ├── ui/                    # Core UI Components (MainEditor, LandingPage, Layer Panel, Inspector)
    ├── geometry/              # Geometric utilities, hit-testing, bounding calculations & snapping
    ├── history/               # Undo/Redo transaction stack & immutable history state
    ├── engine/                # Core drawing engine state definitions
    ├── renderer/              # SVG & Canvas vector rendering pipelines
    ├── storage/               # Local-first persistence adapters
    ├── tools/                 # Tool state handlers & interaction controllers
    └── utils/                 # Shared helper functions
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `V` | Select Tool |
| `R` | Rectangle Tool |
| `O` | Circle Tool |
| `P` | Path / Pen Tool |
| `T` | Text Tool |
| `I` | Image Tool |
| `Delete` / `Backspace` | Delete Selected Layer |
| `Esc` | Deselect Active Element |
| `Ctrl + Z` / `Cmd + Z` | Undo |
| `Ctrl + Y` / `Cmd + Y` | Redo |
| `Ctrl + K` / `Cmd + K` | Open Command Palette |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please check our [Contributing Guide](./CONTRIBUTING.md) and open an issue or pull request on GitHub.

---

## 📄 License

This project is open-source and available under the [MIT License](./LICENSE).
