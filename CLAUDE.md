# CLAUDE.md

Personal dashboard for **Yash Sehrawat** at **yashsehrawat.in**. This replaced the earlier minimal portfolio in Oct 2026. There is no résumé section.

Design direction (owner request, Oct 20 2026): "Yash: The Series", a streaming-app portfolio rebuilt from a reference video Yash sent. Opening title card with a Play button, a "Who's watching?" picker (Yash / Recruiter / Developer / Explorer) that reorders the sections, a billboard hero, a "Continue Exploring" episode row, then Box Office (live stats), Top Moments, Skill Universe, Originals, About (The Pilot), Journey (seasons), Top Picks and a "To be continued" contact finale. Palette: near-black stage, signal red, award gold, saturated poster gradients. Dark is the default; a toggle switches to light. The earlier R3F 3D scenes were removed for this design.

## Stack
- Next.js 15 (App Router) + TypeScript, Tailwind CSS v4
- Framer Motion for all motion. Display font Bebas Neue and serif Instrument Serif come from `@fontsource` packages (no runtime Google Fonts fetch).
- Theme: tokens in `src/app/globals.css` (`:root`/`[data-theme=dark]`, `[data-theme=light]`), toggled by `ThemeToggle` in the nav, set before paint by `src/lib/theme.ts` (dark unless the visitor picked light). The same script sets `data-intro` when no viewer profile is stored in sessionStorage, which shows the opening overlay; without JS there is no overlay.
- Hosted on Vercel; auto-deploys from `main`. Not a static export: the home page uses ISR (`revalidate = 3600`) to refresh stats.

## Layout
- `src/lib/data.ts`: all copy and links, typed. Change content here, never inside components. The "series" block at the bottom (viewer profiles, episodes, moments, seasons, top picks) is derived from the facts above it. `portrait` is null until Yash provides a photo; the hero and About card show a monogram until then.
- `src/lib/stats.ts`: server-only fetchers for LeetCode (GraphQL), Codeforces and GitHub. Each source has its own fallback so one failing API never breaks the page.
- `src/components/`: Series (profile context, opening splash, Who's watching, section ordering, toast), Billboard (hero + Continue Exploring row), Sections (Box Office, Top Moments, Skill Universe, Originals, Pilot, Journey, Top Picks, Finale), Chrome (nav, theme toggle, play cursor, logo), ui (Reveal, SeriesHeading, Counter, brand icons).

## Rules
- Never fabricate projects, metrics, dates or links. Missing info gets a `TODO:` and a question to the owner.
- Keep the page fully readable without JavaScript (the overlay only appears when the head script runs).
- Respect `prefers-reduced-motion`. Avoid `backdrop-filter` and `filter: blur` (use radial gradients for soft glows); they caused scroll jank.
- Colors only via tokens (`bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent`, `var(--poster-*)`…), never hardcoded hex in components.
- Test at 390px and 1440px; no horizontal scroll.
- Conventional commits (`feat:`, `fix:`, `style:`, `chore:`).
