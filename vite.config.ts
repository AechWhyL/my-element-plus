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
    include: ["./**/__test__/**/*.test.tsx","./**/__test__/**/*.test.ts"],
    coverage: {
      provider: 'v8', // or 'v8'
      exclude: [
        'coverage/**',
        'node_modules/**',
        'packages/docs/**',
        'packages/playground/**',
        '**/__test__/**',
        '**/*.stories.ts',
        '**/*.config.*',
        '.prettierrc.js',
        'postcss.config.cjs'
      ]
    }
  },
});

// "test": "vitest --coverage"
