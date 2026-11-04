import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Same aliases as tsconfig.json. Tests render the real page with react-dom/server,
// so no browser or DOM environment is needed.
export default defineConfig({
  resolve: {
    alias: {
      "@design": fileURLToPath(new URL("../../design", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
