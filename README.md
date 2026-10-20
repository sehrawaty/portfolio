# yashsehrawat.in

"Yash: The Series", a streaming-app style portfolio for Yash Sehrawat with live coding stats.

- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · dark (default) and light themes
- **Experience:** an opening title card, a "Who's watching?" picker that reorders the page for recruiters, developers or explorers, a billboard hero, episode rows, award cards, seasons and a "To be continued" finale
- **Live data:** LeetCode (GraphQL), Codeforces (public API) and GitHub (REST), fetched on the server and revalidated hourly (ISR). Each source falls back to cached values if it is unreachable.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Edit content

All copy lives in `src/lib/data.ts` (profile, links, projects, experience, skills, certifications, education, plus the series copy: viewer profiles, moments, seasons, top picks). Set `portrait` to an image in `public/` to replace the monogram in the hero and About card. Live stats logic is in `src/lib/stats.ts`.

## Deploy

Push to `main`; Vercel builds it automatically. Optional env var `GITHUB_TOKEN` (a read-only token) raises the GitHub API rate limit.
