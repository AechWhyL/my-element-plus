// vite.config.ts
import { defineConfig } from "file:///D:/projects/pratice/my-elementplus/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.7/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/projects/pratice/my-elementplus/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_764558a6cb65d37f0cfd1e452fe4da9e/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "file:///D:/projects/pratice/my-elementplus/node_modules/.pnpm/@storybook+addon-vitest@9.0_0befd757d7ccecc42065e7d8f3ddbe92/node_modules/@storybook/addon-vitest/dist/vitest-plugin/index.mjs";
var __vite_injected_original_dirname = "D:\\projects\\pratice\\my-elementplus\\packages\\playground";
var __vite_injected_original_import_meta_url = "file:///D:/projects/pratice/my-elementplus/packages/playground/vite.config.ts";
var dirname = typeof __vite_injected_original_dirname !== "undefined" ? __vite_injected_original_dirname : path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [vue()],
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, ".storybook")
        })
      ],
      test: {
        name: "storybook",
        browser: {
          enabled: true,
          headless: true,
          provider: "playwright",
          instances: [{
            browser: "chromium"
          }]
        },
        setupFiles: [".storybook/vitest.setup.ts"]
      }
    }]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxwcmF0aWNlXFxcXG15LWVsZW1lbnRwbHVzXFxcXHBhY2thZ2VzXFxcXHBsYXlncm91bmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RzXFxcXHByYXRpY2VcXFxcbXktZWxlbWVudHBsdXNcXFxccGFja2FnZXNcXFxccGxheWdyb3VuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdHMvcHJhdGljZS9teS1lbGVtZW50cGx1cy9wYWNrYWdlcy9wbGF5Z3JvdW5kL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3QvY29uZmlnXCIgLz5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xuaW1wb3J0IHsgc3Rvcnlib29rVGVzdCB9IGZyb20gJ0BzdG9yeWJvb2svYWRkb24tdml0ZXN0L3ZpdGVzdC1wbHVnaW4nO1xuY29uc3QgZGlybmFtZSA9IHR5cGVvZiBfX2Rpcm5hbWUgIT09ICd1bmRlZmluZWQnID8gX19kaXJuYW1lIDogcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSk7XG5cbi8vIE1vcmUgaW5mbyBhdDogaHR0cHM6Ly9zdG9yeWJvb2suanMub3JnL2RvY3MvbmV4dC93cml0aW5nLXRlc3RzL2ludGVncmF0aW9ucy92aXRlc3QtYWRkb25cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt2dWUoKV0sXG4gIHRlc3Q6IHtcbiAgICBwcm9qZWN0czogW3tcbiAgICAgIGV4dGVuZHM6IHRydWUsXG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAvLyBUaGUgcGx1Z2luIHdpbGwgcnVuIHRlc3RzIGZvciB0aGUgc3RvcmllcyBkZWZpbmVkIGluIHlvdXIgU3Rvcnlib29rIGNvbmZpZ1xuICAgICAgLy8gU2VlIG9wdGlvbnMgYXQ6IGh0dHBzOi8vc3Rvcnlib29rLmpzLm9yZy9kb2NzL25leHQvd3JpdGluZy10ZXN0cy9pbnRlZ3JhdGlvbnMvdml0ZXN0LWFkZG9uI3N0b3J5Ym9va3Rlc3RcbiAgICAgIHN0b3J5Ym9va1Rlc3Qoe1xuICAgICAgICBjb25maWdEaXI6IHBhdGguam9pbihkaXJuYW1lLCAnLnN0b3J5Ym9vaycpXG4gICAgICB9KV0sXG4gICAgICB0ZXN0OiB7XG4gICAgICAgIG5hbWU6ICdzdG9yeWJvb2snLFxuICAgICAgICBicm93c2VyOiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBoZWFkbGVzczogdHJ1ZSxcbiAgICAgICAgICBwcm92aWRlcjogJ3BsYXl3cmlnaHQnLFxuICAgICAgICAgIGluc3RhbmNlczogW3tcbiAgICAgICAgICAgIGJyb3dzZXI6ICdjaHJvbWl1bSdcbiAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICBzZXR1cEZpbGVzOiBbJy5zdG9yeWJvb2svdml0ZXN0LnNldHVwLnRzJ11cbiAgICAgIH1cbiAgICB9XVxuICB9XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBR2hCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLHFCQUFxQjtBQVA5QixJQUFNLG1DQUFtQztBQUFzTCxJQUFNLDJDQUEyQztBQVFoUixJQUFNLFVBQVUsT0FBTyxxQ0FBYyxjQUFjLG1DQUFZLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFHMUcsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLEVBQ2YsTUFBTTtBQUFBLElBQ0osVUFBVSxDQUFDO0FBQUEsTUFDVCxTQUFTO0FBQUEsTUFDVCxTQUFTO0FBQUE7QUFBQTtBQUFBLFFBR1QsY0FBYztBQUFBLFVBQ1osV0FBVyxLQUFLLEtBQUssU0FBUyxZQUFZO0FBQUEsUUFDNUMsQ0FBQztBQUFBLE1BQUM7QUFBQSxNQUNGLE1BQU07QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLFNBQVM7QUFBQSxVQUNULFVBQVU7QUFBQSxVQUNWLFVBQVU7QUFBQSxVQUNWLFdBQVcsQ0FBQztBQUFBLFlBQ1YsU0FBUztBQUFBLFVBQ1gsQ0FBQztBQUFBLFFBQ0g7QUFBQSxRQUNBLFlBQVksQ0FBQyw0QkFBNEI7QUFBQSxNQUMzQztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
