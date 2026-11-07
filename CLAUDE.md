# CLAUDE.md

Personal dashboard for **Yash Sehrawat** at **yashsehrawat.in**. There is no résumé section.

Design direction (Nov 2026): rebuilt on Apple's fluid-interface principles (the `apple-design` skill from emilkowalski/skills). The site stays lively, but the life comes from things you can touch, not ambient effects: a flickable highlight deck in the hero, project sheets you drag to dismiss, a momentum carousel of repos, a tappable request-flow diagram. The earlier full-screen 3D backdrop, cursor glow, boot screen and tilt cards were removed (latency, full-viewport motion, hover-only effects). The owner previously rejected a plain minimal redesign, so don't strip the interactions out. Palette is unchanged in spirit: graphite neutrals (Apple system greys) + ember orange, with steel blue and gold as supporting accents. Dark is the default; a toggle switches to light.

## Stack
- Next.js 15 (App Router) + TypeScript, Tailwind CSS v4, Framer Motion. No WebGL.
- Theme: tokens in `src/app/globals.css` (`[data-theme=dark]` default, `[data-theme=light]`), toggled by `ThemeToggle` in the nav (eases the swap via the `theme-easing` class), set before paint by `src/lib/theme.ts`.
- Hosted on Vercel; auto-deploys from `main`. Not a static export: the home page uses ISR (`revalidate = 3600`) to refresh stats.

## Layout
- `src/lib/data.ts`: all copy and links, typed. Change content here, never inside components.
- `src/lib/stats.ts`: server-only fetchers for LeetCode (GraphQL), Codeforces and GitHub. Each source has its own fallback so one failing API never breaks the page.
- `src/lib/motion.ts`: the only source of springs and gesture math (`spring`, `springMomentum`, `springSheet`, `project()`, `rubberband()`, `VelocityTracker`, `DRAG_SLOP`).
- `src/components/`: Chrome (nav, theme toggle, mobile menu), Hero + FlickStack, Dashboard (live stats bento), Projects + Sheet + Carousel, Architecture (tappable request-flow SVG), Sections (experience, skills, credentials, about, contact), ui (Reveal, SectionHeader, Counter, Chip, brand icons).

## Motion rules
- Springs, not fixed-duration easing, for anything a person can touch. Default is critically damped (`spring`); bounce (`springMomentum`) only after a gesture that carried momentum.
- Gestures track 1:1 from the grab point, hand release velocity to the spring, choose the landing point with `project()`, and rubber-band at edges. Never lock input during a transition; interrupt from the live value.
- Press feedback on pointer-down (`pressable` utility or `active:` styles).
- Things leave the way they came (sheets down, menus back into their button).
- Reduced motion: cross-fade instead of slide/scale, no flowing packets, counters show final values. Also honour `prefers-reduced-transparency` and `prefers-contrast`.

## Rules
- Never fabricate projects, metrics, dates or links. Missing info gets a `TODO:` and a question to the owner.
- `backdrop-filter` only on the small fixed nav bar (`material` utility). Never full-screen and never `filter: blur`; use radial gradients for soft glows. Larger blur surfaces caused scroll jank before.
- Colors only via tokens (`bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `text-faint`, `border-line`, `bg-accent-fill`/`text-on-accent`, `text-accent-ink`…), never hardcoded hex in components.
- Type uses the `t-*` utilities in `globals.css`; tracking is size-specific (tight on display, ~0 on body). Don't set a global letter-spacing.
- Test at 390px and 1440px, dark and light; no horizontal scroll.
- Conventional commits (`feat:`, `fix:`, `style:`, `chore:`).
