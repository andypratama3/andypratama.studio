# Products strip, journal, about (media-kit rhythm)

## Goal
1. Replace plain tech marquee with 5 product cards (image + text). DualBrand live; four coming-soon placeholders — no fake prices or testimonials.
2. Journal page: win/problem layout ready, honest empty state.
3. About page: media-kit structure using only `facts.ts` + existing copy.

## Files
- `src/content/product-catalog.ts` — ids, images, href, live/soon
- `src/messages/{en,id}.json` — product/journal/about copy
- `src/components/brand/product-strip.tsx` — edge-fade marquee cards
- `src/app/[locale]/(site)/page.tsx` — use ProductStrip
- `src/app/[locale]/(site)/products/page.tsx` — 5-card grid + DualBrand feature
- `src/app/[locale]/(site)/journal/page.tsx` — win/problem shells
- `src/app/[locale]/(site)/about/page.tsx` — media-kit sections

## Verify
`pnpm typecheck && pnpm lint && pnpm test`
