# AGENTS.md — andypratama.studio

Bahasa laporan: Indonesia. Kode: Inggris. Klaim selesai hanya dengan output perintah nyata.

## Aturan
- Fakta hanya dari src/content/facts.ts. Dilarang mengarang angka, testimoni, logo klien.
- Jangan tampilkan data siswa, VA, kredensial. Jangan commit secret.
- Warna lewat token CSS (globals.css). Jangan hard-code hex di komponen.
- Satu font: Inter. Satu aksen: --brand.
- Tidak ada any, @ts-ignore, atau ignoreBuildErrors.
- Dependency baru: sebut alasan dan ukuran dulu.
- Tindakan di gerbang persetujuan (publish, kirim pesan, ubah harga, deploy, hapus data, ubah facts.ts) berhenti di status butuh_persetujuan.

## Perintah
pnpm dev | pnpm typecheck | pnpm lint | pnpm test | pnpm exec playwright test | pnpm build
pnpm db:up | pnpm db:generate | pnpm db:migrate | pnpm db:seed | pnpm db:import-csv

## Pembagian Peran
- **executive-assistant**: dokumentasi keputusan, ringkasan, orkestrasinya
- **engineering-lead**: src/, drizzle/, tests/, docker/, next.config.ts, proxy.ts
- **creative-director**: src/styles/, src/components/brand/, tokens, visual
- **content-strategist**: src/content/, src/messages/, facts, faq, mdx
- **business-operations**: data produk, lead, lamaran, tautan (usulan)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
