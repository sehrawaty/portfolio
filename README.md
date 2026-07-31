# yashsehrawat.in

Personal portfolio — [yashsehrawat.in](https://yashsehrawat.in)

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · static export, no server runtime.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to /out
npm run lint
```

Stop the dev server before running `npm run build` — both write to `.next`, and
running them concurrently corrupts the dev server's webpack chunks.

## Structure

```
app/          routes, layout, global styles, generated og-image
components/   one component per file
content/      all copy, typed — nothing hardcoded in JSX
public/       resume PDF, favicon
```

Content lives in `content/` as typed data. Updating a project, certification,
or role never requires touching a component.

## Design tokens

Defined once in `app/globals.css` and referenced everywhere; no hex values in
components. One accent color, hairline borders, no shadows. Dark mode ships via
`prefers-color-scheme`.

Two tokens exist for accessibility rather than aesthetics:

- `--accent` (`#0066CC`) for text links, separate from `--accent-fill`
  (`#0071E3`) for solid buttons. The single-value original measured 4.58:1,
  passing WCAG AA with almost no margin.
- `--line-input` for form and control boundaries, because `--line` is ~1.3:1
  and fails WCAG 1.4.11's 3:1 minimum for non-text UI.

## Deployment

Push to `main` → Vercel auto-deploys. Domain registered at GoDaddy with DNS
pointed at Vercel.
