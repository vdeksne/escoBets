# EscoBets

Elite Telegram Betting Insights — high-confidence picks, proven data, and real results.

## Stack

- **React** + **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel** (deploy as-is)
- **Supabase** (auth & database)
- **shadcn-style UI** (Button, Accordion, `cn` utility)
- **Storybook** (component development & docs)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.local.example` to `.env.local` and set your Supabase keys:

   ```bash
   cp .env.local.example .env.local
   ```

   Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from [Supabase Dashboard](https://supabase.com/dashboard) → your project → Settings → API.

3. **Run dev**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

4. **Storybook**

   ```bash
   npm run storybook
   ```

   Open [http://localhost:6006](http://localhost:6006).

## Deploy on Vercel

- Push to GitHub and import the repo in [Vercel](https://vercel.com).
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Project → Settings → Environment Variables.
- Deploy.

## Project structure

- `src/app/` — Next.js App Router (layout, page, globals)
- `src/components/ui/` — reusable UI (Button, Accordion)
- `src/components/landing/` — landing sections (Header, Hero, Pricing, FAQ, etc.)
- `src/lib/` — `utils.ts` (cn), Supabase client/server
- `.storybook/` — Storybook config
- `*.stories.tsx` — component stories

## Design

Landing page follows the [EscoBets Figma design](https://www.figma.com/design/aiXmRBzoB4v6tNvFzlkgHa/EscoBets): dark theme, yellow (`#DFFF00`) accents, sections for hero, promo, tweets, pricing, deals, FAQ, and footer.
