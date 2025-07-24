// vitest.config.ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages')
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["./**/__test__/**/*.test.tsx"],
  },
});

// "test": "vitest --coverage"
