import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const entry = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis"
  },
  server: {
    port: 3001
  },
  build: {
    rollupOptions: {
      input: {
        home: entry("./index.html"),
        kanban: entry("./kanban/index.html"),
        collections: entry("./collections/index.html"),
        playground: entry("./playground/index.html")
      }
    }
  }
});
