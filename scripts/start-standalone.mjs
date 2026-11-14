#!/usr/bin/env node
/**
 * Runs the Next.js standalone server locally (same build output as Docker).
 * `next start` prints a warning for standalone builds, so we copy the static
 * assets the standalone server expects and launch it directly.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs"
import { spawn } from "node:child_process"
import path from "node:path"

const root = process.cwd()
const standalone = path.join(root, ".next", "standalone")
const server = path.join(standalone, "server.js")

if (!existsSync(server)) {
  console.error("Standalone build not found. Run `pnpm build` first.")
  process.exit(1)
}

cpSync(path.join(root, "public"), path.join(standalone, "public"), {
  recursive: true,
})
mkdirSync(path.join(standalone, ".next"), { recursive: true })
cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), {
  recursive: true,
})

const envFile = path.join(root, ".env.local")
const args = [
  ...(existsSync(envFile) ? [`--env-file-if-exists=${envFile}`] : []),
  "server.js",
]

const child = spawn(process.execPath, args, {
  cwd: standalone,
  stdio: "inherit",
  env: { ...process.env, PORT: process.env.PORT ?? "3000" },
})

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal))
}

child.on("exit", (code) => process.exit(code ?? 0))
