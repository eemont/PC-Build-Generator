import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.js",
    globals: true,
    css: true,
    alias: [
      {
        find: /\.(webp|mp4|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,
        replacement: path.resolve(__dirname, "src/tests/__mocks__/fileMock.js"),
      },
    ],
  },
});