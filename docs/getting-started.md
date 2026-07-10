# Getting Started with DrawOS

Welcome to the DrawOS project! Follow this guide to set up the workspace, start development, and compile the application.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

## Installation

To clone and install dependencies for DrawOS:

```bash
# Clone the repository
git clone https://github.com/drawos/drawos.git

# Navigate to the workspace
cd drawos

# Install workspace dependencies
npm install
```

## Running Development Server

To boot up the interactive developer server with Hot Module Replacement (HMR) and real-time asset compiling:

```bash
npm run dev
```

The web application is hosted locally on [http://localhost:3000](http://localhost:3000).

## Building for Production

To run a production-ready optimization build that bundles, tree-shakes, and minifies files:

```bash
npm run build
```

The optimized static production output is generated cleanly into the `/dist` directory.
