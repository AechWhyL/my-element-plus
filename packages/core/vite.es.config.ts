import { resolve } from "path";
import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vuePlugin(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
      outDir:"dist/types"
    }),
  ],
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, "dist/es"),
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "HylFakeElementPlus",
      formats: ["es"],
      fileName: "hyl-fake-element-plus",
    },
    rollupOptions: {
      external: [
        "Vue",
        "@fortawesome/vue-fontawesome",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/fontawesome-svg-core",
        "@popperjs/core",
        "async-validator",
      ],
      output: {
        exports: "named",
        assetFileNames(chunkInfo) {
          if (chunkInfo.name === "style.css") return "index.css";
          return chunkInfo.name as string;
        },
      },
    },
  },
});
