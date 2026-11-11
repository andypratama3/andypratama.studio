# Public UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make every public page feel finished without inventing prices, testimonials, screenshots, or unverified checkout URLs.

**Architecture:** Keep the existing Section / Container / Reveal system. Replace stub-only DualBrand docs with content already in messages. Tighten empty states and page shells so unfinished content reads intentional.

**Tech Stack:** Next.js App Router, next-intl, existing brand components, CSS tokens in globals.css.

## Tasks

1. DualBrand page — replace docs stub with package facts from messages; keep license link; no buy/demo until verified.
2. Products list — clearer layout and honest “coming when ready” for checkout.
3. Journal / about / links / contact empty states — same finished empty rhythm.
4. Work, services, start, faq, legal — spacing, heading rhythm, CTA consistency.
5. Verify with `pnpm typecheck`, `pnpm lint`, and browser checks on home + key routes.
