import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3000 },
  preview: { port: 3000 },
  build: {
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // See https://github.com/twbs/bootstrap/issues/40962
        silenceDeprecations: ["color-functions", "global-builtin", "import"],
      },
    },
  },
});
