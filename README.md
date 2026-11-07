# yashsehrawat.in

Personal dashboard for Yash Sehrawat: a single page with live coding stats, built on Apple's fluid-interface principles.

- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · dark (default) and light themes
- **Interactions:** a highlight deck you can flick (momentum projection + velocity handoff), project sheets that drag to dismiss, a momentum carousel of recent repos, and a tappable request-flow diagram. Springs throughout, rubber-banded edges, press feedback on pointer-down.
- **Accessibility:** honours `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`; every gesture has a button or keyboard equivalent.
- **Live data:** LeetCode (GraphQL), Codeforces (public API) and GitHub (REST), fetched on the server and revalidated hourly (ISR). Each source falls back to cached values if it is unreachable.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Edit content

All copy lives in `src/lib/data.ts` (profile, links, projects, experience, skills, certifications, education). Live stats logic is in `src/lib/stats.ts`. Spring presets and gesture math are in `src/lib/motion.ts`.

## Deploy

Push to `main`; Vercel builds it automatically. Optional env var `GITHUB_TOKEN` (a read-only token) raises the GitHub API rate limit.
