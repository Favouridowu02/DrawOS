# Contributing to DrawOS

First off, thank you for considering contributing to **DrawOS**! Open-source tools thrive on community collaboration, bug reports, feature suggestions, and pull requests.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please treat all contributors with respect and empathy.

---

## 🚀 Getting Started Locally

### 1. Fork & Clone

Fork the repository on GitHub, then clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/DrawOS.git
cd DrawOS
```

### 2. Install Dependencies

DrawOS uses `npm` workspaces to manage packages:

```bash
npm install
```

### 3. Start the Development Server

Run the local Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000` to preview changes live.

---

## 🏗️ Monorepo Package Architecture

When making modifications, be mindful of where code lives within the workspace:

- **`apps/web/`**: Main web entry point, application routing, and environment configuration.
- **`packages/ui/`**: Core React components (`MainEditor.tsx`, `LandingPage.tsx`, modals, menus).
- **`packages/geometry/`**: Pure math, intersection testing, bounding calculations, and snap-to-grid helpers.
- **`packages/history/`**: Immutable Undo/Redo transaction stack logic.
- **`packages/engine/` & `packages/renderer/`**: Data models and rendering pipelines.

---

## 🌿 Branching & Pull Request Workflow

1. **Create a Feature/Fix Branch**:
   Use descriptive branch names prefixed by type:
   - `feat/add-polygon-shape`
   - `fix/layer-selection-drag`
   - `docs/update-api-guide`

2. **Commit Conventions**:
   We recommend Conventional Commits:
   - `feat: add live alignment guides to vector editor`
   - `fix: prevent layer deselection on mouse drag completion`
   - `docs: improve contributing instructions`

3. **Verify Your Changes**:
   Run a production build locally before submitting to ensure TypeScript types and assets compile cleanly:
   ```bash
   npm run build
   ```

4. **Submit your Pull Request**:
   - Provide a clear title and description explaining what your PR changes and why.
   - Attach screenshots or screen recordings for visual UI changes.
   - Reference any related open issues (e.g., `Closes #12`).

---

## 💡 Reporting Bugs & Suggesting Features

- Use the GitHub Issues page to search existing reports before creating a new issue.
- Include reproduction steps, browser version, and screenshots whenever reporting bugs.
