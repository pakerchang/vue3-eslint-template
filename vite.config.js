import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// eslint-disable-next-line import/no-extraneous-dependencies
import eslintPlugin from "vite-plugin-eslint";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ["src/**/*.{js,vue,html}"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
