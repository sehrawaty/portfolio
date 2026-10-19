# yashsehrawat.in

Personal dashboard for Yash Sehrawat: a 3D, animated single page with live coding stats.

- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber · Framer Motion · light and dark themes
- **3D:** a rotating globe of service nodes with requests travelling between them (hero), paused when off screen
- **Live data:** LeetCode (GraphQL), Codeforces (public API) and GitHub (REST), fetched on the server and revalidated hourly (ISR). Each source falls back to cached values if it is unreachable.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Edit content

All copy lives in `src/lib/data.ts` (profile, links, projects, experience, skills, certifications, education). Live stats logic is in `src/lib/stats.ts`.

## Deploy

Push to `main`; Vercel builds it automatically. Optional env var `GITHUB_TOKEN` (a read-only token) raises the GitHub API rate limit.
