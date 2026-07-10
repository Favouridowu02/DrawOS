# DrawOS System Architecture

DrawOS utilizes a decoupled, workspace-compatible monorepo structure. This architecture guarantees strict modularity, high performance, and extreme testability for core modules.

```
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
```

## Package Relationships

1. **`apps/web`** serves as the application entry point and main router shell, importing modal windows and views from `@drawos/ui`.
2. **`@drawos/ui`** contains the visual layout but forwards all functional mathematical operations and vector geometry checks to **`@drawos/geometry`**.
3. Shape modifications, ordering (bringing elements to front/back), and property alterations are computed via functional updates in **`@drawos/engine`**.
4. The file export engine leverages **`@drawos/renderer`** to cleanly serialize the active drawing canvas state into pixel-perfect scalable vectors.
