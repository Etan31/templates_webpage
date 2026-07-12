# Monarch Barber Shop

Marketing site for Monarch Barber Shop — a React + Vite reimplementation of the imported
Claude Design. Warm off-white / matte-black / metallic-gold theme.

## Stack

- React 19 + Vite 8 (JavaScript / JSX)
- CSS Modules (component styles) + one shared global stylesheet (`src/styles/global.css`)
- `react-router-dom` 7
- pnpm, deploys to Vercel

## Setup

```bash
pnpm install
pnpm dev        # http://localhost:5174 (fixed, strictPort)
```

Other scripts: `pnpm build`, `pnpm preview`, `pnpm lint`.

Copy `.env.example` to `.env.local` if/when the booking flow needs Supabase; the marketing
pages read no environment variables today.

## Architecture

```
src/
  components/
    layout/     Navbar, Footer, Brand, Layout (Outlet + scroll-to-top)
    ui/         Button, Icon, Chip, Reveal, Img, SectionHead, CtaBand, PageHeader
    cards/      ServiceCard, TeamCard, FeatureCard, PackageCard, BranchCard, StatsBar
    sections/   WhyChoose (shared Home/About block)
  pages/        Home, About, Services, Packages, Contact, NotFound
  data/         site, services, team, packages, branches, features, stats
  hooks/        useScrolled, useBodyScrollLock, useDocumentTitle
  utils/        fallbackImage
  styles/       global.css (tokens, reset, shared primitives)
```

### Conventions

- Truly shared rules (design tokens, `.container`, section scaffolding, typography helpers,
  grids, reveal) live in `global.css`. Everything component-specific is a colocated CSS Module.
- Page content lives in `src/data/*`; components stay presentational.
- Scroll reveal is a native IntersectionObserver (`Reveal`), no animation library.
- Photos are placeholder Unsplash URLs; `Img` swaps to an on-brand SVG if one fails to load.

## Routes

`/` Home · `/about` · `/services` · `/packages` · `/contact` · `*` NotFound (404).

## Deferred follow-ups

- Supabase client + a real Book Now booking flow (Book Now currently links to `/contact`).
- Full 8-status error-page system described in `frontend-claude.md` (only a 404 exists today).
- Jest + Playwright tests.
- Vercel security headers, including a CSP `img-src` allowance for `images.unsplash.com`.
