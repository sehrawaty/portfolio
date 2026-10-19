# CLAUDE.md

Personal dashboard for **Yash Sehrawat** at **yashsehrawat.in**. This replaced the earlier minimal portfolio in Oct 2026. There is no résumé section.

Design direction (owner feedback, Oct 2026): it must not look "vibe coded". That means no neon gradients, glow, glassmorphism, tilt/magnetic effects, cursor followers, intro loaders or animated word clouds. Use warm neutral tokens, hairline borders, one accent (orange), Geist type, and motion limited to short fade-and-rise reveals. Both light and dark themes must look deliberate.

## Stack
- Next.js 15 (App Router) + TypeScript, Tailwind CSS v4
- React Three Fiber for the one 3D piece: the hero globe (`src/components/three/Globe.tsx`), which reads theme tokens from CSS and stops rendering when off screen. Framer Motion for reveals.
- Theme: tokens in `src/app/globals.css` (`:root` light, `[data-theme=dark]`), toggled by `ThemeToggle`, set before paint by `src/lib/theme.ts`.
- Hosted on Vercel; auto-deploys from `main`. Not a static export: the home page uses ISR (`revalidate = 3600`) to refresh stats.

## Layout
- `src/lib/data.ts`: all copy and links, typed. Change content here, never inside components.
- `src/lib/stats.ts`: server-only fetchers for LeetCode (GraphQL), Codeforces and GitHub. Each source has its own fallback so one failing API never breaks the page.
- `src/components/`: Hero, Dashboard (live stats), Projects, Architecture (request-flow SVG), Sections (experience, skills, credentials, background, contact), Chrome (nav, theme toggle), ui (Reveal, SectionHeading, Card, Counter, brand icons).

## Rules
- Never fabricate projects, metrics, dates or links. Missing info gets a `TODO:` and a question to the owner.
- Keep 3D heavy pieces client-only (`dynamic(..., { ssr: false })`) and keep the page usable without WebGL.
- Respect `prefers-reduced-motion`. Never add `backdrop-filter`/`filter: blur` animations or fixed full-screen canvases: they caused the scroll jank in the first version.
- Colors only via tokens (`bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent`…), never hardcoded hex in components.
- Test at 390px and 1440px; no horizontal scroll.
- Conventional commits (`feat:`, `fix:`, `style:`, `chore:`).
