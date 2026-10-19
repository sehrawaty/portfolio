# CLAUDE.md

Personal dashboard for **Yash Sehrawat** at **yashsehrawat.in**. This replaced the earlier minimal portfolio in Oct 2026. There is no résumé section.

Design direction (owner feedback, Oct 2026): keep the animated, 3D look (liquid orb, particle galaxy, skills sphere, tilt cards, counters, request-flow diagram). The owner rejected a plain minimal redesign. What changed was the palette: graphite + ember orange, with steel blue and gold as supporting accents, instead of the earlier purple/cyan/pink neon. Dark is the default; a toggle switches to light.

## Stack
- Next.js 15 (App Router) + TypeScript, Tailwind CSS v4
- React Three Fiber + drei for 3D (`src/components/three/`); scenes read theme colors from CSS tokens via `three/palette.ts`. Framer Motion for UI motion.
- Theme: tokens in `src/app/globals.css` (`:root` light, `[data-theme=dark]`), toggled by `ThemeToggle` in the nav, set before paint by `src/lib/theme.ts` (dark unless the visitor picked light).
- Hosted on Vercel; auto-deploys from `main`. Not a static export: the home page uses ISR (`revalidate = 3600`) to refresh stats.

## Layout
- `src/lib/data.ts`: all copy and links, typed. Change content here, never inside components.
- `src/lib/stats.ts`: server-only fetchers for LeetCode (GraphQL), Codeforces and GitHub. Each source has its own fallback so one failing API never breaks the page.
- `src/components/`: Hero, Dashboard (live stats bento), Projects, Architecture (animated request-flow SVG), Sections (experience, skills sphere, credentials, background, contact), Chrome (nav, theme toggle, 3D backdrop, cursor glow, intro), ui (Reveal, TiltCard, Counter, Magnetic, brand icons).

## Rules
- Never fabricate projects, metrics, dates or links. Missing info gets a `TODO:` and a question to the owner.
- Keep 3D heavy pieces client-only (`dynamic(..., { ssr: false })`) and keep the page usable without WebGL.
- Respect `prefers-reduced-motion`. Avoid `backdrop-filter` and `filter: blur` (use radial gradients for soft glows); they caused scroll jank.
- Colors only via tokens (`bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent`…), never hardcoded hex in components.
- Test at 390px and 1440px; no horizontal scroll.
- Conventional commits (`feat:`, `fix:`, `style:`, `chore:`).
