const { defineConfig } = require("@vue/cli-service");
import { resolve } from "path";
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true;@import (reference) "${resolve(
            "src/assets/less/common.less"
          )}"; `,
        },
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@apis": resolve(__dirname, "src/apis"),
      "@utils": resolve(__dirname, "src/utils"),
      "@plugins": resolve(__dirname, "src/plugins"),
      "@assets": resolve(__dirname, "src/assets"),
      "@views": resolve(__dirname, "src/views"),
    },
  },
});
