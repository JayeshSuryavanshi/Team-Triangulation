import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Relative base (`./`) mirrors the old CRA `homepage: "."` — asset URLs are
// emitted relative so the build can be served from any static host or subpath.
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
