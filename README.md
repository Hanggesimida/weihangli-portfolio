# Weihang Li — Portfolio

A single-page portfolio site for **Weihang Li** (Full Stack Developer), built with the Next.js App Router. It presents hero, services, selected work, about, and contact sections with scroll-driven layout and motion.

**Other languages:** [简体中文](README.zh-CN.md)

## Features

- Section-based landing page (hero, what I do, selected works, about, contact, footer)
- Project cards with imagery and scroll-linked interactions
- Smooth scrolling (Lenis) and animation (Motion)
- Contact form that posts to a server route and sends email via [Resend](https://resend.com)

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **UI:** Lucide icons, clsx / tailwind-merge; custom Spinner, RollingText, WeChat hover panel
- **Motion:** Motion
- **Scrolling:** Lenis
- **Forms:** react-hook-form
- **Email:** Resend
## Prerequisites

- **Node.js** — use a current **LTS** release (recommended for Next.js 16).
- **pnpm** — recommended package manager. Install via `npm install -g pnpm` or see [pnpm.io](https://pnpm.io/installation).

## Getting started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Edit files under `src/`; the app hot-reloads during development.

### Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start dev server         |
| `pnpm build`   | Production build         |
| `pnpm start`   | Run production server    |
| `pnpm lint`    | Run ESLint               |

## Environment variables

The contact flow in [`src/app/api/send/route.ts`](src/app/api/send/route.ts) uses Resend.

- **`RESEND_API_KEY`** — required for sending mail from the API route. Set it locally (e.g. `.env.local`) and in your hosting provider’s environment settings for production and preview deployments.
- **`CONTACT_FROM_EMAIL`** (optional) — sender, e.g. `Weihang Li <hello@your-domain.com>`; must be on a Resend-verified domain. Defaults to `onboarding@resend.dev`.
- **`CONTACT_TO_EMAIL`** (optional) — recipient. Defaults to `CONTACT_EMAIL` in `src/config/site.ts`.
- **`NEXT_PUBLIC_SITE_URL`** (optional) — canonical site URL used for SEO metadata, sitemap and robots. Defaults to `https://weihangli.dev`.

Verify your sending domain in the Resend dashboard and point `CONTACT_FROM_EMAIL` at it. Do not commit real API keys.

## Deploy

Deploy anywhere that supports Next.js (e.g. [Vercel](https://vercel.com)). Configure `RESEND_API_KEY` in the project’s environment variables.

- [Next.js — Deploying](https://nextjs.org/docs/app/building-your-application/deploying)

## License

Private project (`"private": true` in `package.json`).
