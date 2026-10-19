# CLAUDE.md

Personal dashboard for **Yash Sehrawat** at **yashsehrawat.in**. This replaced the earlier minimal portfolio in Oct 2026 at the owner's request: the site is now deliberately animated and 3D, with live coding stats. There is no résumé section.

## Stack
- Next.js 15 (App Router) + TypeScript, Tailwind CSS v4
- React Three Fiber + drei for 3D (`src/components/three/`), Framer Motion for UI motion
- Hosted on Vercel; auto-deploys from `main`. Not a static export: the home page uses ISR (`revalidate = 3600`) to refresh stats.

## Layout
- `src/lib/data.ts`: all copy and links, typed. Change content here, never inside components.
- `src/lib/stats.ts`: server-only fetchers for LeetCode (GraphQL), Codeforces and GitHub. Each source has its own fallback so one failing API never breaks the page.
- `src/components/`: Hero, Dashboard (live stats bento), Projects, Architecture (animated request-flow SVG), Sections (experience, skills sphere, credentials, background, contact), Chrome (nav, 3D backdrop, cursor glow, intro), ui (Reveal, TiltCard, Counter, Magnetic, brand icons).

## Rules
- Never fabricate projects, metrics, dates or links. Missing info gets a `TODO:` and a question to the owner.
- Keep 3D heavy pieces client-only (`dynamic(..., { ssr: false })`) and keep the page usable without WebGL.
- Respect `prefers-reduced-motion`.
- Test at 390px and 1440px; no horizontal scroll.
- Conventional commits (`feat:`, `fix:`, `style:`, `chore:`).
