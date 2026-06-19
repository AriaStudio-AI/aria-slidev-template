import { defineConfig } from 'vite';

// Compatibility config for running Slidev inside the in-browser runtime.
export default defineConfig({
  css: {
    // MANDATORY: LightningCSS ships WASI binaries that cannot run in this
    // environment. Force the classic PostCSS transformer instead.
    transformer: 'postcss',
  },
  optimizeDeps: {
    // recordrtc ships a truncated CJS build that crashes Vite's dep optimizer.
    exclude: ['recordrtc'],
  },
});
