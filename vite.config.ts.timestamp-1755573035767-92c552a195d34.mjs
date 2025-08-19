// vite.config.ts
import { defineConfig } from "file:///D:/projects/pratice/my-elementplus/node_modules/.pnpm/vite@6.3.5_@types+node@20.19.11_jiti@2.5.1_sass@1.90.0/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/projects/pratice/my-elementplus/node_modules/.pnpm/@vitejs+plugin-vue@6.0.1_vi_7aa550e5f969116acfd1c8e4fdb978fc/node_modules/@vitejs/plugin-vue/dist/index.js";
import vueJsx from "file:///D:/projects/pratice/my-elementplus/node_modules/.pnpm/@vitejs+plugin-vue-jsx@5.0._3effe00f41911e2746579b295846ec8d/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\projects\\pratice\\my-elementplus";
var vite_config_default = defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "packages")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["./**/__test__/**/*.test.tsx", "./**/__test__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // or 'v8'
      exclude: [
        "coverage/**",
        "node_modules/**",
        "packages/docs/**",
        "packages/playground/**",
        "**/__test__/**",
        "**/*.stories.ts",
        "**/*.config.*",
        ".prettierrc.js",
        "postcss.config.cjs"
      ]
    },
    setupFiles: [resolve(__vite_injected_original_dirname, "vite.test.setup.ts")]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxwcmF0aWNlXFxcXG15LWVsZW1lbnRwbHVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxwcmF0aWNlXFxcXG15LWVsZW1lbnRwbHVzXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9wcm9qZWN0cy9wcmF0aWNlL215LWVsZW1lbnRwbHVzL3ZpdGUuY29uZmlnLnRzXCI7Ly8gdml0ZXN0LmNvbmZpZy50c1xyXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbdnVlKCksIHZ1ZUpzeCgpXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAncGFja2FnZXMnKVxyXG4gICAgfSxcclxuICB9LFxyXG4gIHRlc3Q6IHtcclxuICAgIGdsb2JhbHM6IHRydWUsXHJcbiAgICBlbnZpcm9ubWVudDogXCJqc2RvbVwiLFxyXG4gICAgaW5jbHVkZTogW1wiLi8qKi9fX3Rlc3RfXy8qKi8qLnRlc3QudHN4XCIsXCIuLyoqL19fdGVzdF9fLyoqLyoudGVzdC50c1wiXSxcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIHByb3ZpZGVyOiAndjgnLCAvLyBvciAndjgnXHJcbiAgICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgICAnY292ZXJhZ2UvKionLFxyXG4gICAgICAgICdub2RlX21vZHVsZXMvKionLFxyXG4gICAgICAgICdwYWNrYWdlcy9kb2NzLyoqJyxcclxuICAgICAgICAncGFja2FnZXMvcGxheWdyb3VuZC8qKicsXHJcbiAgICAgICAgJyoqL19fdGVzdF9fLyoqJyxcclxuICAgICAgICAnKiovKi5zdG9yaWVzLnRzJyxcclxuICAgICAgICAnKiovKi5jb25maWcuKicsXHJcbiAgICAgICAgJy5wcmV0dGllcnJjLmpzJyxcclxuICAgICAgICAncG9zdGNzcy5jb25maWcuY2pzJ1xyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgc2V0dXBGaWxlczogW3Jlc29sdmUoX19kaXJuYW1lLCAndml0ZS50ZXN0LnNldHVwLnRzJyldXHJcbiAgfSxcclxufSk7XHJcblxyXG4vLyBcInRlc3RcIjogXCJ2aXRlc3QgLS1jb3ZlcmFnZVwiXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFFQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsZUFBZTtBQUx4QixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUFBLEVBQ3pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxVQUFVO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixTQUFTLENBQUMsK0JBQThCLDRCQUE0QjtBQUFBLElBQ3BFLFVBQVU7QUFBQSxNQUNSLFVBQVU7QUFBQTtBQUFBLE1BQ1YsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxZQUFZLENBQUMsUUFBUSxrQ0FBVyxvQkFBb0IsQ0FBQztBQUFBLEVBQ3ZEO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
