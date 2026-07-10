export interface DocItem {
  id: string;
  title: string;
  category: string;
  readingTime: string;
  content: string;
}

export const DOCS_ITEMS: DocItem[] = [
  {
    id: "introduction",
    title: "Introduction",
    category: "Getting Started",
    readingTime: "2 min read",
    content: `# Introduction to DrawOS

DrawOS is an open-source, local-first vector drawing engine built for the modern web. It provides professional-grade tools, high-precision canvas snapping, an extensible architecture, and seamless file export capabilities (PNG, SVG, and JSON).

## Key Features

- **Local-First Design**: All drawing data is persisted in browser local storage and can be exported as standard JSON schema files.
- **High-Precision Snap & Grid**: Adjustable grid size with optional alignment snap, allowing technical or modular drawing.
- **Modular Monorepo Architecture**: Clean separation of concerns between core geometry calculations, render engine, viewport/camera transformations, and UI components.
- **Premium Drawing Tools**: Supports vector rectangles, circle layers, freehand path lines, text labels, and external image layers.
- **Keyboard-Driven Workflow**: High efficiency keyboard bindings (Ctrl+K for Command Palette, V for Select, R for Rectangle, etc.).
- **Modern UI Shell**: Beautiful responsive Slate-colored visual interface crafted with Tailwind CSS and elegant entry animations.`
  },
  {
    id: "getting-started",
    title: "Getting Started",
    category: "Getting Started",
    readingTime: "3 min read",
    content: `# Getting Started with DrawOS

Welcome to the DrawOS project! Follow this guide to set up the workspace, start development, and compile the application.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

## Installation

To clone and install dependencies for DrawOS:

\`\`\`bash
# Clone the repository
git clone https://github.com/Favouridowu02/DrawOS.git

# Navigate to the workspace
cd DrawOS

# Install workspace dependencies
npm install
\`\`\`

## Running Development Server

To boot up the interactive developer server with Hot Module Replacement (HMR) and real-time asset compiling:

\`\`\`bash
npm run dev
\`\`\`

The web application is hosted locally on [http://localhost:3000](http://localhost:3000).

## Building for Production

To run a production-ready optimization build that bundles, tree-shakes, and minifies files:

\`\`\`bash
npm run build
\`\`\`

The optimized static production output is generated cleanly into the \`/dist\` directory.`
  },
  {
    id: "architecture",
    title: "System Architecture",
    category: "Core Concepts",
    readingTime: "4 min read",
    content: `# DrawOS System Architecture

DrawOS utilizes a decoupled, workspace-compatible monorepo structure. This architecture guarantees strict modularity, high performance, and extreme testability for core modules.

\`\`\`
drawos/
├── apps/
│   └── web/            # Core web client (React 19, Vite, Tailwind CSS)
├── packages/
│   ├── engine/         # Layering, shape creation, and core mutator functions
│   ├── renderer/       # SVG string generation and rendering converters
│   ├── tools/          # Active tool declarations and shortcut listeners
│   ├── camera/         # Zoom, pan, and screen-to-world coordinate transforms
│   ├── geometry/       # Snap to grid, vector distances, and collision hitboxes
│   ├── history/        # Undo/redo stack managers and state timeline snapshots
│   ├── storage/        # LocalStorage persistence and JSON validation helpers
│   ├── ui/             # Beautiful, decoupled React components and modals
│   └── utils/          # Core utilities (Unique ID generators, file downloads)
└── docs/               # System documentation and schemas
\`\`\`

## Package Relationships

1. **\`apps/web\`** serves as the application entry point and main router shell, importing modal windows and views from \`@drawos/ui\`.
2. **\`@drawos/ui\`** contains the visual layout but forwards all functional mathematical operations and vector geometry checks to **\`@drawos/geometry\`**.
3. Shape modifications, ordering (bringing elements to front/back), and property alterations are computed via functional updates in **\`@drawos/engine\`**.
4. The file export engine leverages **\`@drawos/renderer\`** to cleanly serialize the active drawing canvas state into pixel-perfect scalable vectors.`
  },
  {
    id: "api",
    title: "API Specification",
    category: "Development",
    readingTime: "5 min read",
    content: `# DrawOS API Specification

This document details the main export APIs provided by DrawOS packages.

## \`@drawos/geometry\`

### \`snap(val: number, gridSize: number, enabled: boolean): number\`
Snape coordinates to nearest grid lines if snapping is enabled.

### \`isPointInRect(px, py, rx, ry, rw, rh): boolean\`
Performs responsive hit-testing against standard rectangular bounds.

### \`isPointInCircle(px, py, cx, cy, radius): boolean\`
Computes Euclidean distance to test if a click falls inside a circle region.

---

## \`@drawos/engine\`

### \`createRectangle(x, y, w, h, fill, stroke, strokeWidth): DrawingObject\`
Generates a fully qualified rect vector object.

### \`createCircle(x, y, r, fill, stroke, strokeWidth): DrawingObject\`
Creates a standard circle object.

### \`reorderObject(objects, id, direction): DrawingObject[]\`
Reorders list indices to push elements forward, backward, to the front, or to the back.

---

## \`@drawos/history\`

### \`createHistory<T>(initialPresent: T): HistoryState<T>\`
Boots a blank history stack.

### \`pushState<T>(state, nextState): HistoryState<T>\`
Pushes a new state snapshot onto the past stack and clears redos.

### \`undo<T>(state): HistoryState<T>\`
Travels one step back into past states.`
  },
  {
    id: "contributing",
    title: "Contributing Guide",
    category: "Community",
    readingTime: "3 min read",
    content: `# Contributing to DrawOS

First of all, thank you for taking the time to contribute! DrawOS is an open-source community effort, and we welcome improvements of all sizes.

## How Can I Contribute?

### Reporting Bugs
- Search existing issues to verify the problem hasn't been reported yet.
- Open a new issue using our **Bug Report Template** describing steps to reproduce, actual vs expected results, and environment details.

### Suggesting Enhancements
- Create an issue explaining the proposed feature, user benefits, and optional technical designs.

### Pull Requests
1. **Fork** the repository and create your branch from \`main\`.
2. Follow our **Coding Standards** (strict TypeScript typing, clean Tailwind CSS classes, modular packages).
3. Verify your changes build successfully with \`npm run build\` and have no lint/type errors.
4. Issue a PR against the \`main\` branch with our **PR Template** filled out.

## Code Style Guidelines

- **TypeScript**: Always use strict typing. Avoid using \`any\` or loose typings.
- **Components**: Functional React components with descriptive prop interfaces.
- **Styling**: Stick to the Tailwind utility color system (\`primary\`, \`surface-bright\`, \`outline\`). Never hardcode hex values in JSX style properties.
- **Imports**: Place named imports at the very top of files, using absolute mapped aliases (\`@drawos/*\`) when referencing core monorepo packages.`
  },
  {
    id: "roadmap",
    title: "Project Roadmap",
    category: "Community",
    readingTime: "3 min read",
    content: `# DrawOS Project Roadmap

This roadmap outlines the planned development phases, feature milestones, and technological achievements we are striving to integrate into DrawOS.

## Phase 1: Modular Foundation (Completed)
- [x] Full-stack UI/UX drawing prototype with command palette and modals.
- [x] Restructured monorepo setup (\`apps/web\` & \`packages/*\`).
- [x] Setup comprehensive architecture, contributor, and getting started docs.

## Phase 2: Render & Device Support (Active)
- [ ] Implement multi-touch gesture support on canvas viewports for tablets/phones.
- [ ] Add direct high-fidelity SVG path simplifies & curve smoothers.
- [ ] Integrate full keyboard-nudge scaling (Shift+Arrows to resize).

## Phase 3: Collaborative Features (Upcoming)
- [ ] Real-time web sockets multiplayer canvas drawing.
- [ ] Client-side WebRTC direct synchronization.
- [ ] Complete offline sync backup with Conflict-free Replicated Data Types (CRDTs).

## Phase 4: AI Vector Intelligence (Future)
- [ ] Integrate Gemini AI to parse sketched paths and transform rough hand-drawn strokes into perfect vector elements (e.g., automatic flowchart nodes).
- [ ] Support vector style recommendation prompts.`
  }
];
