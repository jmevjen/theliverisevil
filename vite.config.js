import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'boardgame.io/react': path.resolve(__dirname, 'node_modules/boardgame.io/dist/esm/react.js'),
      'boardgame.io/client': path.resolve(__dirname, 'node_modules/boardgame.io/dist/esm/client.js'),
      'boardgame.io/core': path.resolve(__dirname, 'node_modules/boardgame.io/dist/esm/core.js'),
      'boardgame.io/ai': path.resolve(__dirname, 'node_modules/boardgame.io/dist/esm/ai.js'),
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 3000,
    open: true,
    host: true
  }
});
