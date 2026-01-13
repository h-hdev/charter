export default {
  build: {
    assetsDir: "",
    rollupOptions: {
      output: {
        // 入口文件命名
        entryFileNames: "[name].js",
        // 代码分割块命名
        chunkFileNames: "[name].js",
        // 资源文件命名（如图片、字体等）
        assetFileNames: "[name].[ext]",
      },
    },
  },
};
