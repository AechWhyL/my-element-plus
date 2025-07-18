import { resolve } from "path";
import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vuePlugin()],
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, "dist/umd"),
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "HylFakeElementPlus",
      formats: ["umd"],
      fileName: "index.[format]",
    },
    rollupOptions: {
      external: ["Vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
        assetFileNames(chunkInfo) {
          if (chunkInfo.name === "style.css") return "index.css";
          return chunkInfo.name as string;
        },
      },
    },
  },
});
