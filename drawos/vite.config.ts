import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@drawos/engine': path.resolve(__dirname, './packages/engine/src'),
        '@drawos/renderer': path.resolve(__dirname, './packages/renderer/src'),
        '@drawos/tools': path.resolve(__dirname, './packages/tools/src'),
        '@drawos/camera': path.resolve(__dirname, './packages/camera/src'),
        '@drawos/geometry': path.resolve(__dirname, './packages/geometry/src'),
        '@drawos/history': path.resolve(__dirname, './packages/history/src'),
        '@drawos/storage': path.resolve(__dirname, './packages/storage/src'),
        '@drawos/ui': path.resolve(__dirname, './packages/ui/src'),
        '@drawos/utils': path.resolve(__dirname, './packages/utils/src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
