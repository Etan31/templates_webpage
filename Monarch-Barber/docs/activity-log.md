# Activity Log — Monarch Barber

## 2026-07-12 — Initial build from imported Claude Design

**Summary:** Imported the "Monarch" design from claude.ai/design (project
`21bb878a-b5fc-4883-8573-85059c63e9c5`) via the claude_design MCP and reimplemented all 5 pages
as a React + Vite + CSS Modules app per `frontend-claude.md`.

**Decisions:**
- Rebranded the design's "SharpCuts" content to "Monarch" (centralized in `src/data/site.js`).
- Implemented all 5 pages (Home, About, Services, Packages, Contact) plus a 404 NotFound.
- CSS strategy: shared tokens/reset/primitives in `src/styles/global.css`; everything else in
  colocated CSS Modules.
- Ported vanilla `app.js` behaviors to hooks/components: `useScrolled` (sticky-nav shadow),
  `Reveal` (IntersectionObserver), Navbar mobile menu + `useBodyScrollLock`, `Img` fallback.
- No animation library, no Supabase — marketing pages have no data/auth. Icons are hand-authored
  SVG components (`Icon.jsx`).
- Fixed dev port to 5174 (`strictPort`) to avoid colliding with sibling `casa-barbero` (5173).

**Fixes vs. the source design:**
- The design's global `h1-h4 { color: var(--black) }` overrode the intended white headings on the
  dark `.phead` and `.ctaband` bands (the author only re-declared white inside `.dark`). Set the
  page-header `h1` and CTA `h2` to white explicitly.

**Verification:** `pnpm build` (77 modules, routes code-split), `pnpm lint` clean, `pnpm dev`
boots on 5174 and serves. Visual/interaction click-through in a browser still pending.

**Deferred:** Supabase booking flow, full 8-status error pages, Jest/Playwright tests, Vercel CSP.
