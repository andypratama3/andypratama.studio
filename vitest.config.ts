import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // Default: node — safe for server-side tests (rate-limit, mail, etc.)
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    exclude: ["**/node_modules/**", "**/tests/wiring/**", "**/tests/motion/**/*.spec.ts", "**/e2e/**"],
  },
})
