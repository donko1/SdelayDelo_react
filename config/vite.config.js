import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(path.resolve(__dirname, "tailwind.config.js")),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "../src"),
      },
      {
        find: "@pages",
        replacement: path.resolve(__dirname, "../src/pages"),
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "../src/components"),
      },
      {
        find: "@utils",
        replacement: path.resolve(__dirname, "../src/utils"),
      },
      {
        find: "@animations",
        replacement: path.resolve(__dirname, "../src/animations"),
      },
      {
        find: "@context",
        replacement: path.resolve(__dirname, "../src/context"),
      },
      {
        find: "@assets",
        replacement: path.resolve(__dirname, "../src/assets"),
      },
      {
        find: "@hooks",
        replacement: path.resolve(__dirname, "../src/utils/hooks"),
      },
    ],
  },
});
