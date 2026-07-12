# CLAUDE.md — Frontend

Guidance for Claude Code working with code in this repository.

## Stack

- **Framework:** React + Vite
- **Language / markup:** JavaScript (JSX), HTML/CSS (CSS Modules)
- **Data / auth:** Supabase client (Auth + queries from the browser)
- **Testing:** Jest + React Testing Library (unit), Playwright (e2e)
- **Tooling:** pnpm
- **Hosting:** Vercel

Always use `pnpm` (not `npm` or `yarn`). Check `package.json` before adding any dependency.

## General Principles

- Generate concise, short solutions for new modules or code.
- KISS principle: Keep it simple, stupid.
- Watch for over-engineering and oversized files needing refactor.
- Watch for syntax/style mismatching the rest of the codebase.
- Watch for obvious bugs and logical flaws.
- Prioritize concise, precise code and documentation changes.
- No emojis or special characters in comments.
- Write activity-log.md in /docs to refer back if confused.
- Create a to-do list and run major changes by user first.
- Review existing files before refactoring or major changes.
- Markdown files use kebab naming (e.g., some-description-changes.md).
- Don't auto-commit activity logs and docs.

## Code Quality

### General Standards

- Use right data structures and algorithms for the problem.
- Don't expose data needlessly (least privilege principle).
- No external libraries unless absolutely necessary; check package.json for versions.
- Avoid redundancy unless it improves usability or maintainability.
- Comments: one-liner describing what the code does, keep it direct and actionable.
- No `console.log()` in production code; strip debug logs before shipping.

### Component Architecture (React + Vite)

- Organize code: `components/`, `pages/`, `hooks/`, `utils/`, `services/`, `assets/`, `validators/`, `helpers/`.
- One component per file; break large components into smaller, reusable pieces.
- Prefer functional components with hooks over class components.
- Keep components presentational where possible; push data-fetching into `hooks/` or `services/`.
- Memoize expensive computations and callbacks (`useMemo`, `useCallback`).
- Lazy load heavy components using `React.lazy()` and `Suspense`.
- Avoid prop drilling; use Context API for shared state (not Redux unless truly needed).
- Minimize re-renders: use dependency arrays correctly, avoid inline object/function creation in render.
- No unused imports or dead code.

### Styling (CSS Modules)

- Use CSS Modules; avoid inline styles.
- Prefer descriptive, component-scoped class names; avoid short generic names that collide across pages.
- Keep truly shared rules in a single shared stylesheet (`ui.css`/`global.css`/`index.css`), not duplicated per page.
- After changing an element's tag or structure, grep the paired CSS file for now-dead selectors.

### Supabase From the Browser

- Use the Supabase client for auth and data; get the session from it, never hand-roll token parsing.
- Only the anon key belongs in the frontend — the service-role key must never appear in client code or a `VITE_` var.
- Never trust client-side checks for authorization; the security boundary is Supabase RLS. Treat frontend guards as UX, not enforcement.
- Guard protected routes on session state; render an inline auth error when missing.

### HTML & Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<label>`) over generic `<div>` soup.
- Associate labels with inputs; ensure interactive elements are keyboard-reachable.
- Provide `alt` text for meaningful images; empty `alt=""` for decorative ones.
- Maintain visible focus states and sufficient color contrast.

### Error, Empty & Loading States

Reusable error/auth pages. Document the contract here so they get reused, not re-implemented.

For each project record:
- **Import path(s)** and convenience wrappers (`NotFound`, `ServerError`, `AuthError`).
- **Props / API** — prefer a single `code` prop so one component renders any status: `<ErrorPage code={404} />`.
- **Styling approach** — CSS Modules (`ErrorPage.module.css`) vs global CSS (`errors.css`); pick one and stay consistent.
- **Animation** — `motion/react` or `framer-motion` stagger entrance.

Also define shared **empty states** (no data yet) and **loading skeletons** so a given state isn't styled two different ways in two places.

**Status codes to support (8):**

| Code | Name | Use Case |
|------|------|----------|
| 400 | Bad Request | Invalid form input, malformed requests |
| 401 | Unauthorized | Missing/expired session (render inline when auth fails) |
| 403 | Forbidden | User lacks permission (render inline when permission check fails) |
| 404 | Not Found | Route doesn't exist (auto-renders via catch-all route) |
| 500 | Server Error | Unhandled exceptions (catch in error boundary) |
| 502 | Bad Gateway | Upstream service down (API failure handler) |
| 503 | Service Unavailable | Maintenance mode |
| 504 | Gateway Timeout | Request timeout (API response timeout) |

**Rendering patterns:**

404 (auto-routed):
```jsx
// Navigate to any non-existent route -> catch-all renders NotFound
```

401/403 (inline in components):
```jsx
if (!session) return <AuthError code={401} />
if (!permissions.includes('admin')) return <AuthError code={403} />
```

500/502/503/504 (error boundaries or API handlers):
```jsx
catch (error) {
  if (error.status === 503) return <ServerError code={503} />
  return <ServerError code={500} /> // fallback
}
```

## Documentation

### Code Comments

- One-line comments above complex logic explaining the "why," not the "what."
- JSDoc for exported components, hooks, and utilities.
- No documentation for obvious code (e.g., `const user = getUser();`).

### README

- Clear setup instructions (Node version, `pnpm install`, environment variables).
- How to start the dev server and run tests.
- Architecture overview (tech stack, folder structure).
- Main features and key routes.

### Component / Prop Documentation

- Document non-obvious component props (type, required, default, purpose).
- Note any context a component depends on (e.g., must be inside `<AuthProvider>`).

## Frontend Efficiency

### Performance

- Lazy load routes using `React.lazy()` and Vite code splitting.
- Use dynamic imports for heavy libraries.
- Minimize bundle size: audit with `pnpm why <pkg>` / a bundle analyzer, remove unused packages.
- Cache API responses with appropriate headers (e.g., `Cache-Control: max-age=300`).
- Optimize images: compress, use WebP, lazy load with `loading="lazy"`.

### State Management

- Keep state as close as possible to where it's used (local > Context > external store).
- Use Context for global state (auth session, theme, language) only.
- Avoid unnecessary state updates; use immutable updates.

### Network Requests

- Use a single HTTP client instance (Axios or Fetch with interceptors) that attaches the Supabase session token.
- Set request timeouts (default 10-30 seconds).
- Retry failed requests (with exponential backoff) for idempotent operations.
- Cache GET requests; invalidate on mutations.
- Show loading states and error messages to users.

### Rendering Optimization

- Use `React.memo()` for components that receive same props.
- Split large lists into paginated or virtualized components.
- Avoid large inline styles or object creation in render.
- Use `key` prop correctly in lists (never use index).

## Security (Frontend)

- Never hardcode secrets; only non-secret, `VITE_`-prefixed vars reach the browser.
- Treat the anon key as public; keep the service-role key out of the frontend entirely.
- Sanitize any user-controlled HTML; avoid `dangerouslySetInnerHTML` unless sanitized.
- Validate inputs client-side for UX, but never rely on it for security.
- Set secure headers at the host (Vercel): `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`.
- Show generic user-facing error messages; never surface stack traces or internal details.

## Input Validation

- Validate and sanitize user inputs before submitting.
- Use Zod for schema validation in `validators/`.
- Reject missing or malformed data early with clear inline feedback.

## Testing

### Unit (Jest + React Testing Library)

- Unit tests for components and hooks.
- Test user interactions, not implementation details.
- Test error boundaries and fallback UIs.
- Avoid testing third-party library behavior.

### End-to-End (Playwright)

- Cover critical user flows (signup/login, core create-read-update paths, key screens).
- Run against a seeded test environment, not production.
- Keep e2e tests independent and idempotent; reset state between runs.
- Wire Playwright into CI on PRs to main.

### Test File Naming

- Colocate unit tests: `component.test.jsx` next to `component.jsx`.
- Keep Playwright specs in a top-level `e2e/` (or `tests/e2e/`) directory.
- Use descriptive test names: `should render error message when API fails`.

## Environment & Deployment

### Environment Variables

- Define in `.env.example` (without sensitive values).
- Never commit `.env` to Git.
- Use different env files: `.env.local`, `.env.test`, `.env.production`.
- Client vars must be `VITE_`-prefixed and non-secret.
- Required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`.

### Local Development

- Provide setup instructions in README (`pnpm install`, then `pnpm dev`).
- Keep the dev-server port fixed with `strictPort: true` in `vite.config` (avoids monorepo port collisions).

### Production Deployment

- Deploys to Vercel.
- Validate required `VITE_` env vars are set at build time.
- CI/CD via GitHub Actions: run lint, Jest, and Playwright before deploying to main.

## Version Control

### Commits

- Commit after significant changes with clear, atomic messages.
- Use imperative mood: "Add login form" not "Added login form".
- Reference issues: "Fix #42: Resolve login timeout".
- Keep commits focused; one feature or fix per commit.
- No auto-push; always review before pushing.

### Branches

- Use feature branches: `feature/user-auth`, `fix/login-timeout`, `docs/api-guide`.
- Keep branches short-lived (1-3 days).
- Require PR review before merging to main.

## AI Restrictions

### Data Privacy

- No customer personal data: names, emails, phone numbers, account numbers, transactions (unless approved exemption or mock data).
- No authentication credentials: passwords, API keys, tokens, Supabase service-role key.
- No internal documentation or business logic that's confidential.

### Security

- Never hardcode secrets; always use `VITE_` env vars for non-secret config.
- Don't generate code that bypasses security checks.
- Sanitize and validate all user inputs before processing.
- Don't surface error messages that leak system information.

## Lessons Learned (Recurring Pitfalls)

Mined from `/docs/activity-log.md`. Each one already cost real time or a user-visible bug once — check against these before repeating the pattern.

### Third-party animation params don't always mean what they sound like
CountUp's `duration` prop was fed into a `useSpring` damping/stiffness formula — it shapes the physics but does **not** bound wall-clock time (springs are asymptotic, not time-bounded). Cutting the number twice didn't reliably shorten the visible finish time; the user had to report "still too long" twice before the real fix.
- **Recognize:** the user gives a hard numeric constraint ("under 1.5s total", "exactly N", "no more than X") for anything animated.
- **Instead:** before tuning a knob, check what it actually controls (read the type signature / library source). If the user's constraint is a hard bound, use a mechanism with a provable bound (a duration-based tween, e.g. `animate()`) instead of an approximated one (a spring). Do the arithmetic for the worst case (last staggered item, slowest branch) and state the guaranteed number back to the user.

### A "zero matches" search result is not proof of absence
The first emoji sweep used a Unicode-range regex that silently failed to match an astral-plane character (📞, U+1F4DE) in two files. Reported clean, then the user found one anyway.
- **Recognize:** you're about to declare a codebase-wide sweep "clean" (no more emoji, no more instances of X, no remaining references) based on a single regex/grep pass — especially involving Unicode, generated code, or anything the user has already caught you missing once.
- **Instead:** corroborate with a second, differently-shaped check (a broader range, a plain-text keyword search, or just reading the remaining candidate files directly) before reporting completeness. Astral-plane emoji specifically need a range like `\x{1F000}-\x{1FFFF}`, not just the BMP dingbat/symbol blocks.

### CSS Modules leak across pages via shared class names
Lazy-loaded page CSS persists after navigation. A generic class name defined in two different page stylesheets creates a load-order-dependent conflict, not a source-order one. One audit found dual `.badge`, dual `.filter-bar`, and a `.compact { min-width: 900px }` rule leaking onto an unrelated `.toggle-row.compact` because whichever page's CSS chunk loaded last won.
- **Recognize:** about to add or edit a CSS Modules rule with a short/generic class name (`.icon`, `.strip`, `.badge`, `.compact`, `.card`, `.dot`...) in a page-specific stylesheet.
- **Instead:** grep sibling page CSS files for the same class name first. If it's genuinely shared, put the rule in the shared stylesheet (`ui.css`/`global.css`, or `index.css`) instead of letting two page files each define their own version.

### Refactors leave dead CSS and dead controls behind, silently
`.hours-row button` rules kept targeting elements that no longer existed after a refactor to time inputs — CSS doesn't error on a selector that matches nothing, it just quietly stops applying.
- **Recognize:** just changed an element's tag or structure (e.g., `<button>` → `<input>`, removed a wrapper div) in JSX.
- **Instead:** grep the paired CSS file for selectors referencing the old element/class immediately after the JSX change, not as an afterthought during some later unrelated audit.

### Don't auto-install a package whose identity you inferred yourself
Tried `npx ui-ux-pro-max-cli init` for a skill the user named but wasn't installed — the sandbox correctly blocked it because the exact package identity came from my own web search, not from the user.
- **Recognize:** about to run `pnpm dlx`/`npx`/similar for a tool the user referenced by a general name, where you had to search to find the actual package name.
- **Instead:** ask the user to confirm/run it themselves (`! <command>`), or fall back to a read-only equivalent (fetch its published docs) and say plainly that the real thing isn't installed.

### Monorepo dev servers need fixed, non-colliding ports
Two Vite apps both defaulted to port 5173; whichever grabbed it first silently served the other app's requests, producing a confusing "No routes matched" React Router error that looked like a routing bug.
- **Recognize:** debugging a routing/navigation error in a monorepo with multiple Vite/dev-server apps, especially a "route that should obviously exist doesn't match."
- **Instead:** check which app is actually listening on the port before touching routing code. Keep each app's port fixed and `strictPort: true` in its dev config.

### Resuming interrupted parallel subagents
A session-limit hit interrupted 5 of 6 parallel background subagents mid-edit. Resuming each with an explicit "re-check current file state before continuing" instruction (rather than just "continue") avoided duplicate or conflicting edits — every agent correctly detected what it had already applied. Keep doing this on any future multi-agent resume.

## Activity Log

- Record significant changes, decisions, and blockers in `/docs/activity-log.md`.
- Format: date, summary, decision/outcome.
- Reference this when returning to the codebase after gaps.
