import { resolve } from "path";
import { defineConfig } from "vite";
import vuePlugin from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import cssBundle from "./vite-plugins/vite-plugin-css-bundle";
import { readdir } from "fs/promises";

const getComponents = async () => {
  const excludeNames = ["coverage", "node_modules", "__test__"];
  const files = await readdir(resolve(__dirname, "../components"), {
    withFileTypes: true,
  });
  return files
    .filter((file) => {
      return file.isDirectory() && !excludeNames.includes(file.name);
    })
    .map((file) => {
      return file.name;
    });
};
const components = await getComponents();
console.log("found components:", components);

export default defineConfig({
  plugins: [
    vuePlugin(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
      outDir: "dist/types",
    }),
    cssBundle({
      name: "main.css",
    }),
  ],
  build: {
    minify: true,
    emptyOutDir: true,
    cssCodeSplit: true,
    outDir: resolve(__dirname, "dist/es"),
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "HylFakeElementPlus",
      formats: ["es"],
      fileName: "index.[format]",
    },
    rollupOptions: {
      external: [
        "vue",
        "@fortawesome/vue-fontawesome",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/fontawesome-svg-core",
        "@popperjs/core",
        "async-validator",
      ],
      output: {
        assetFileNames(chunkInfo) {
          if (chunkInfo.name && /\.css$/.test(chunkInfo.name))
            return `styles/[name][extname]`;
          return chunkInfo.name as string;
        },
        manualChunks(id) {
          // 优先捕获 Vite/Rollup 注入的虚拟模块
          if (id.includes("\0")) {
            return "helpers";
          }

          const resolvedId = resolve(id);
          if (resolvedId.includes("node_modules")) {
            return "vendor";
          }

          if (resolvedId.includes(resolve(__dirname, `../utils`))) {
            return "utils";
          }

          if (resolvedId.includes(resolve(__dirname, `../hooks`))) {
            return "hooks";
          }

          for (const comp of components) {
            if (
              resolvedId.includes(resolve(__dirname, `../components/${comp}`))
            ) {
              return comp;
            }
          }
        },
      },
    },
  },
});
