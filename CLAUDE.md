# CLAUDE.md

Project context for Claude Code. Read this fully before writing any code.

---

## 1. Project

Personal portfolio site for **Yash Sehrawat**, final-year CS student at VIT Vellore, backend-leaning (Java / Spring Boot). Deployed at **yashsehrawat.in**.

**Single job of this site:** a technical recruiter or hiring manager lands here from a resume link or LinkedIn, spends 40–90 seconds, and leaves able to answer three questions:
1. What can he build?
2. Is there evidence he actually built it?
3. How do I contact him?

Every design and content decision is subordinate to that. If a feature does not help answer one of those three questions, it does not ship.

**Non-goals:** a blog CMS, a dashboard, a playground of animations, a "creative experience," anything that requires the visitor to explore to find information.

---

## 2. Stack

- **Next.js 15 (App Router) + TypeScript** — static export (`output: 'export'`) unless a server route is genuinely needed for the contact form.
- **Tailwind CSS v4** for styling. No component library (no MUI, no Chakra, no shadcn unless explicitly requested) — the whole point is that this does not look like a template.
- **Framer Motion** for motion, used sparingly (see §5).
- **Lucide React** for icons only. No emoji as UI.
- **Vercel** for hosting, GitHub auto-deploy on push to `main`.

Do not add dependencies without asking. Every package added is a package the visitor's browser has to download.

---

## 3. Design system

The register is Apple product-page: high contrast, generous negative space, precise type, near-zero decoration. Restraint is the point. Boldness is spent in exactly one place (§6).

### Color tokens

Define these as CSS custom properties in the global stylesheet and reference them everywhere. Never hardcode a hex in a component.

```
--bg          #FBFBFD   page background (light)
--surface     #FFFFFF   raised cards
--ink         #1D1D1F   primary text
--muted       #6E6E73   secondary text, labels, captions
--line        #D2D2D7   hairline dividers and borders
--accent      #0071E3   links, focus rings, the one interactive color
--accent-ink  #0058B8   accent hover/active
```

Dark mode (`prefers-color-scheme: dark`), shipped from day one:

```
--bg          #000000
--surface     #1C1C1E
--ink         #F5F5F7
--muted       #86868B
--line        #38383A
--accent      #0A84FF
--accent-ink  #409CFF
```

Rules:
- Exactly one accent color. Nothing else is colored. No gradients on text, no gradient blobs, no glassmorphism.
- Shadows are near-invisible or absent. Separation comes from spacing and hairlines, not drop shadows.
- Border radius: `12px` on cards, `8px` on buttons and inputs. Consistent, never mixed arbitrarily.

### Typography

- **Display / headings:** `Geist` (variable, self-hosted via `next/font`). SF-adjacent without being a knockoff.
- **Body:** `Inter` (variable, self-hosted).
- **Mono:** `JetBrains Mono` — used for code, metrics, tech-stack chips, and the architecture diagram labels. This is the "engineer" signal in the type system; do not use it decoratively elsewhere.

Type scale (rem, 16px root):

```
display   4.5   / 1.05 / -0.03em / weight 600
h1        3.0   / 1.1  / -0.02em / weight 600
h2        2.0   / 1.2  / -0.02em / weight 600
h3        1.375 / 1.3  / -0.01em / weight 600
body      1.0625/ 1.6  /  0      / weight 400
small     0.875 / 1.5  /  0      / weight 400
label     0.75  / 1.4  /  0.06em / weight 500 / uppercase / --muted
```

Clamp display and h1 for mobile. Body copy never exceeds `68ch` measure.

### Layout

- Max content width `1120px`, page gutters `24px` mobile / `48px` desktop.
- Vertical rhythm on an 8px base. Section padding `96px` mobile, `160px` desktop. Be consistent — inconsistent section spacing is the single most common tell of a generated site.
- Section pattern: small uppercase `label` eyebrow → `h2` → content. Never a decorative divider that carries no meaning.
- Do **not** use `01 / 02 / 03` numbered markers. Nothing on this page is a sequence.

---

## 4. Page structure

Single-page scroll with a sticky, translucent, hairline-bottomed header (this is the one Apple borrow that earns its place). Header holds: name mark (left), section anchors + "Resume" (right). Anchors highlight on scroll.

Sections, in this order:

1. **Hero** — name, one-line positioning statement (what he builds, not adjectives), two buttons: primary "View résumé (PDF)", secondary "Get in touch". Right side / below on mobile: the signature architecture diagram (§6).
2. **Selected work** — 3 projects maximum. Quality over count. Each project card carries: title, one-sentence problem statement, the stack as mono chips, 2–3 bullets of *what he actually did and what it measurably achieved*, and links to Live Demo + GitHub. A project without a repo link does not go on this page.
3. **Experience** — internships / roles, reverse chronological. If thin, merge into Selected Work rather than padding it.
4. **Technical skills** — grouped by role (Languages / Backend / Data / Tooling), plain lists. **No proficiency bars, no percentage rings, no star ratings.** "Java 85%" is meaningless and engineers read it as a red flag.
5. **Education** — VIT Vellore, B.Tech CSE, CGPA 9.17, expected graduation. Two lines. Do not list individual coursework.
6. **Contact** — email (`yash.sehrawat.tech@gmail.com`), LinkedIn, GitHub. No form: the site is a static export and the owner chose direct links over a third-party form endpoint.
7. **Footer** — copyright, "Built with Next.js, deployed on Vercel," repo link.

Explicitly excluded unless asked: phone number, physical address, DOB, registration number, photo carousels, testimonials, a hit counter, a "hobbies" section, animated skill clouds, a downloadable vCard.

---

## 5. Motion

Motion budget is deliberately small.

- One orchestrated page-load sequence: hero text and diagram fade+rise in staggered sequence, ~400ms, `cubic-bezier(0.25, 0.1, 0.25, 1)`. Runs once.
- Scroll reveals: opacity 0→1 and 12px rise, triggered once per element at 20% viewport intersection. Nothing re-animates on scroll back up.
- Hover: color/opacity transitions only, 150ms. No scale-bounce, no tilt, no magnetic cursor, no parallax.
- `prefers-reduced-motion: reduce` disables all of the above and renders final states immediately. Non-negotiable.

---

## 6. Signature element

The one memorable thing on this page is the **hero architecture diagram**: a hand-authored SVG showing the real request flow through his strongest backend project — client → API gateway/controller → service layer → cache → database, with async/queue paths if they exist.

Requirements:
- Hand-authored SVG in the codebase. Not an image file, not a chart library, not Mermaid.
- Nodes are labelled in JetBrains Mono. Strokes are `--line`. Exactly one path is drawn in `--accent` — the primary request path.
- Static by default. Optional: a slow ambient pulse traveling the accent path (respects reduced-motion). Nothing clickable, nothing interactive — it is a statement, not a toy.
- It must depict a real system. If the project data is not yet available, ask before inventing one.

Everything else on the page stays quiet so this lands.

---

## 7. Content rules

- Copy is written from the recruiter's side of the screen. Say what was built and what it did. Never "passionate," "enthusiastic," "aspiring," "tech geek," "code ninja," or "I love to learn new technologies."
- Prefer numbers to adjectives: latency reduced, requests handled, records processed, users served, tests written. If a number is not known, ask for it rather than inventing one.
- Never fabricate a project, metric, employer, date, or link. If information is missing, leave a clearly marked `TODO:` and tell the user in chat what is missing.
- Sentence case for all headings and buttons. Button labels are verbs describing the outcome ("Send message", not "Submit").
- Form errors state what went wrong and how to fix it. They do not apologize.

---

## 8. Quality bar

Every change must hold these:

- Lighthouse ≥ 95 across Performance, Accessibility, Best Practices, SEO on mobile.
- Responsive from 320px up. Test at 320 / 768 / 1440.
- Semantic HTML: one `h1`, correct landmark elements, real `button` and `a` elements.
- Visible keyboard focus using `--accent` focus rings. Full tab-through of nav, links, and form.
- All images have alt text; the SVG diagram has a `title` and `role="img"`.
- Metadata complete: title, description, canonical, Open Graph + Twitter card with a custom `og-image`, `robots.txt`, `sitemap.xml`, and JSON-LD `Person` schema.
- No console errors or warnings. No layout shift.
- No `localStorage`-dependent core functionality; theme preference may use it with a safe fallback.

---

## 9. Repo conventions

```
/app            routes, layout, global styles
/components     one component per file, PascalCase
/content        projects.ts, experience.ts, skills.ts — all copy lives here, typed
/public         resume.pdf, og-image.png, favicons
```

- **All content lives in `/content` as typed data.** No copy hardcoded inside JSX. Updating a project must never require touching a component.
- Conventional commits (`feat:`, `fix:`, `style:`, `chore:`).
- Small, reviewable commits. Do not bundle a redesign and a content change into one commit.

---

## 10. Deployment

- GitHub repo → Vercel project → auto-deploy on `main`.
- Domain is registered at GoDaddy. DNS is pointed at Vercel; do not use GoDaddy hosting.
- Verify both `yashsehrawat.in` and `www.yashsehrawat.in` resolve and that HTTPS is active before declaring done.

---

## 11. Working agreement

- Before building any section, state the plan in one short paragraph and wait for approval. Do not generate the entire site in one pass.
- When a decision is ambiguous, ask. Do not guess at content.
- Push back on requests that would hurt the site's single job (§1), including requests from the repo owner.