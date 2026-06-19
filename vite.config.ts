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
    //
    // monaco-editor is the critical one: Slidev enables Monaco in dev by
    // default (monaco: true). Its enormous dependency graph stalls Vite's
    // esbuild prebundle inside the constrained in-browser runtime BEFORE the
    // dev server can bind a port — so the preview never appears. Excluding it
    // here skips the prebundle entirely (slides don't use the <Monaco> editor),
    // which keeps the server booting even if a generated slides.md forgets the
    // `monaco: false` headmatter flag.
    exclude: ['recordrtc', 'monaco-editor', 'monaco-editor-core'],
  },
});
