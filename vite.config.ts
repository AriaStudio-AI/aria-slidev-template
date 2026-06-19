import { defineConfig } from 'vite';

// Compatibility config for running Slidev inside the in-browser runtime.
export default defineConfig(({ command }) => ({
  css: {
    // MANDATORY: LightningCSS ships WASI/native binaries that cannot run in
    // this environment. Force the classic PostCSS transformer instead.
    transformer: 'postcss',
  },
  build: {
    // CRITICAL: Vite 8 defaults cssMinify to "lightningcss" for the SSR/server
    // environment. Slidev renders slides via SSR, so it loads LightningCSS to
    // minify CSS — which crashes here ("Package lightningcss-wasm32-wasi does
    // not exist in the registry"). css.transformer above only controls the
    // transform, NOT the minifier, so it does not prevent this. Force esbuild
    // for builds and skip CSS minification entirely in dev, so no LightningCSS
    // binary is ever loaded.
    cssMinify: command === 'build' ? 'esbuild' : false,
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
}));
