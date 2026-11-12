#!/usr/bin/env node
import { createRequire } from "node:module"
import { spawnSync } from "node:child_process"

const require = createRequire(import.meta.url)
const mysql = require("mysql2/promise")

const url =
  process.env.DATABASE_URL ??
  "mysql://andy:studio_secret@127.0.0.1:3306/andypratama_studio"

async function ping() {
  try {
    const conn = await mysql.createConnection({ uri: url, connectTimeout: 2000 })
    await conn.query("SELECT 1")
    await conn.end()
    return true
  } catch {
    return false
  }
}

function hasDocker() {
  const result = spawnSync("docker", ["compose", "version"], {
    stdio: "ignore",
  })
  return result.status === 0
}

async function main() {
  if (await ping()) {
    console.log("MySQL sudah berjalan:", url.replace(/:[^:@/]+@/, ":***@"))
    return
  }

  if (!hasDocker()) {
    console.error(
      [
        "MySQL tidak bisa dihubungi dan Docker tidak terpasang.",
        "Nyalakan MySQL lokal (mis. `brew services start mysql`) lalu jalankan ulang `pnpm db:up`.",
        "Atau pasang Docker Desktop untuk memakai docker/docker-compose.yml.",
      ].join("\n")
    )
    process.exit(1)
  }

  console.log("Menyalakan MySQL lewat docker compose...")
  const up = spawnSync(
    "docker",
    ["compose", "-f", "docker/docker-compose.yml", "up", "-d"],
    { stdio: "inherit" }
  )
  if (up.status !== 0) process.exit(up.status ?? 1)

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await ping()) {
      console.log("MySQL siap.")
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.error("MySQL belum siap setelah 30 detik. Cek `docker compose logs mysql`.")
  process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
