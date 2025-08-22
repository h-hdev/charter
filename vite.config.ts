import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
// import tailwindcss from "tailwindcss";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./lib/index.ts"),
      name: "componets",
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./lib"),
    },
  },
  //dts({ include: ['lib'] }),
  plugins: [
    dts({
      rollupTypes: true,
      include: ["lib"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],

  publicDir: "./public",
});
