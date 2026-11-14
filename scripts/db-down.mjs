#!/usr/bin/env node
import { spawnSync } from "node:child_process"

const result = spawnSync("docker", ["compose", "version"], { stdio: "ignore" })

if (result.status !== 0) {
  console.log(
    "Docker tidak terpasang — MySQL lokal tidak dimatikan otomatis (mungkin dipakai proyek lain)."
  )
  process.exit(0)
}

const down = spawnSync(
  "docker",
  ["compose", "-f", "docker/docker-compose.yml", "down"],
  { stdio: "inherit" }
)
process.exit(down.status ?? 0)
