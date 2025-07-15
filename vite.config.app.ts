import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  // plugins: [vue()],
  build: {
    outDir: "dist/app",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // 应用入口HTML
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./lib"),
    },
  },
  // 其他应用特有配置...
});
