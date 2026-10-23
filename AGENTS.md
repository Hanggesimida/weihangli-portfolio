# AGENTS.md

## Verification
- `pnpm lint` — ESLint (eslint-config-next, includes React Compiler hook rules)
- `npx tsc --noEmit` — type check
- `pnpm build` — production build; all locale pages, OG images, sitemap and robots are statically generated

## Conventions
- Next.js 16: read `node_modules/next/dist/docs/` before using Next APIs (e.g. `Image` uses `preload`, not `priority`; middleware lives in `src/proxy.ts`).
- Site-wide data (email, social links, projects, skills, `SITE_URL`) lives in `src/config/site.ts`; translated copy lives in `messages/*.json` keyed by the same ids.
- Shared easing curves and intro timings live in `src/lib/animations.ts`.
- In `cn()` (tailwind-merge), a `text-<size>` class removes any `leading-*` that comes before it, so put `leading-*` after the font size.
- All 5 locale files (`en`, `zh-CN`, `zh-TW`, `ja`, `ko`) must keep the same key structure.
