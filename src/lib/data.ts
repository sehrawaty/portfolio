export const profile = {
  name: "Yash Sehrawat",
  role: "Backend Engineer",
  tagline: "I build backend services — APIs, authentication systems, and applied-AI pipelines.",
  intro:
    "Final-year CS student at VIT Vellore. Java, Spring Boot, Node.js, FastAPI, and retrieval systems.",
  location: "Vellore, India",
  email: "yash.sehrawat.tech@gmail.com",
  status: "Open to backend & applied-AI roles",
};

export const links = {
  github: "https://github.com/sehrawaty",
  linkedin: "https://linkedin.com/in/sehrawatyash",
  leetcode: "https://leetcode.com/u/YashSehrawat01/",
  codeforces: "https://codeforces.com/profile/YashSehrawat01",
  email: `mailto:${"yash.sehrawat.tech@gmail.com"}`,
};

export const handles = {
  github: "sehrawaty",
  leetcode: "YashSehrawat01",
  codeforces: "YashSehrawat01",
};

export type Project = {
  name: string;
  period: string;
  summary: string;
  tech: string[];
  highlights: string[];
  metric: { value: string; label: string };
  url: string;
  accent: string;
};

export const projects: Project[] = [
  {
    name: "SmartHQ",
    period: "Feb 2026 — Apr 2026",
    summary:
      "Turns raw bank statement exports into automated financial insights and a grounded Q&A assistant.",
    tech: ["Python", "FastAPI", "Pandas", "React", "RAG"],
    highlights: [
      "7-stage Pandas pipeline producing 16 JSON datasets for 14 dashboard visualizations",
      "Salary and recurring-payment detection via statistical scoring",
      "RAG Q&A cutting context payload by 94% (1,500 → 80 rows)",
    ],
    metric: { value: "94%", label: "smaller RAG context" },
    url: "https://github.com/sehrawaty/smart-statement-analyzer",
    accent: "var(--accent)",
  },
  {
    name: "SecurePay",
    period: "Nov 2025 — Dec 2025",
    summary:
      "An Android payment flow integrating Razorpay checkout with transaction history and error recovery.",
    tech: ["Kotlin", "Jetpack Compose", "Razorpay SDK", "Material 3"],
    highlights: [
      "Handled 4 SDK-level error states across 500+ test transactions",
      "13 composables rendering at 60fps on mid-range devices",
      "Reduced payment timeouts by 70%",
    ],
    metric: { value: "70%", label: "fewer payment timeouts" },
    url: "https://github.com/sehrawaty/mobile-payment-app",
    accent: "var(--accent-2)",
  },
];

export const experience = [
  {
    company: "Ayuka Developers (OPC) Pvt. Ltd.",
    role: "Software Development Intern",
    period: "May 2026 — Jun 2026",
    mode: "Remote",
    points: [
      "Built backend services for an internal project-management platform using Node.js, Express, and MongoDB, supporting task tracking and team collaboration.",
      "Implemented JWT-based authentication and role-based access control across 3 user roles: admin, manager, member.",
      "Designed RESTful APIs powering interactive dashboards for project and task visualization, integrated with a React frontend.",
    ],
    stack: ["Node.js", "Express", "MongoDB", "JWT", "RBAC", "React"],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Java", "Python", "JavaScript", "Kotlin", "C++", "C", "R", "SQL"] },
  { group: "Backend", items: ["Spring Boot", "Node.js", "Express", "FastAPI", "REST APIs", "JWT / RBAC"] },
  { group: "Data & AI", items: ["MySQL", "MongoDB", "Pandas", "RAG"] },
  { group: "Tooling", items: ["Git", "Postman", "GCP", "Beekeeper Studio", "React", "Tailwind CSS"] },
  { group: "Core CS", items: ["DSA", "OOP Design", "System Design"] },
];

export const certifications = [
  {
    name: "Associate Cloud Engineer",
    issuer: "Google Cloud",
    group: "Cloud",
    url: "https://www.credly.com/badges/43d0d920-7e71-41eb-aeed-fea2b5578a1d/public_url",
  },
  {
    name: "OCI 2025 Multicloud Architect Professional",
    issuer: "Oracle",
    group: "Cloud",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=42ED89251468AB5CB99E2041B60432EF50BE8CF18E6F1A3E93E6015D3E355BCC",
  },
  {
    name: "OCI 2025 Generative AI Professional",
    issuer: "Oracle",
    group: "AI & Data",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=F872A1B5D35F7D6B2FDA4E6660FAA5A3FDE5C6E2CD691AA3D599B14C5B50953C",
  },
  {
    name: "OCI 2025 Data Science Professional",
    issuer: "Oracle",
    group: "AI & Data",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=1CC952FA82B9C96BD7C1032B004A91AE3A96829AE81A25C53F6ED2C55CDA7035",
  },
  {
    name: "Agentic AI Foundations Associate",
    issuer: "Oracle",
    group: "AI & Data",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=BC2C127100440E2FFEC5232E1086319C266F01933C4057360038C79921ACC7B4",
  },
  {
    name: "OCI 2025 AI Foundations Associate",
    issuer: "Oracle",
    group: "AI & Data",
    url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=DC0D93911BB1CA67FB6726FA46956D12BB4D4284BCE64533A5AD82E20BD98E4B",
  },
];

export const education = [
  {
    school: "Vellore Institute of Technology",
    place: "Vellore",
    period: "Aug 2023 — May 2027",
    detail: "B.Tech, Computer Science & Engineering",
    score: "9.17",
    scoreLabel: "CGPA",
  },
  {
    school: "Om Public School",
    place: "Gohana, Haryana",
    period: "2022",
    detail: "Senior Secondary (XII), CBSE",
    score: "90.7%",
    scoreLabel: "Score",
  },
  {
    school: "Dewan Public School",
    place: "Meerut, Uttar Pradesh",
    period: "2020",
    detail: "Secondary (X), CBSE",
    score: "86%",
    scoreLabel: "Score",
  },
];

export const beyond = [
  { title: "Head Boy", text: "Led the student council and represented the student body in school-wide decision-making.", icon: "crown" },
  { title: "NCC Cadet", text: "Two years of drills and district-level events. Third place, district debate competition.", icon: "shield" },
  { title: "Archery", text: "District-level gold medalist, Ferozepur, Punjab.", icon: "target" },
  { title: "UDDESHYA NGO", text: "Community outreach drives and public awareness campaigns.", icon: "heart" },
] as const;

/* ---------------------------------------------------------------------------
 * "Yash — The Series": copy for the streaming-style layout.
 * Everything below is drawn from the facts above; nothing new is claimed.
 * ------------------------------------------------------------------------- */

// TODO: ask Yash for a portrait (transparent or dark background, ~1200px tall) and set this to "/yash.png".
export const portrait: string | null = null;

export const series = {
  title: "Yash",
  badge: "Backend",
  years: "2023 — Present",
  degree: "B.Tech CSE · VIT",
  roleLine: ["Backend Engineer", "APIs", "Auth", "Applied AI"],
  quote:
    "A final-year CS student at VIT Vellore who builds backend services: APIs, authentication systems and applied-AI pipelines, mostly in Java, Spring Boot, Node.js and FastAPI.",
};

/** Section keys, in the default ("full series") order. */
export type SectionKey = "stats" | "moments" | "skills" | "originals" | "about" | "journey" | "picks";

export type ViewerProfile = {
  id: "yash" | "recruiter" | "developer" | "explorer";
  name: string;
  blurb: string;
  watching: string;
  order: SectionKey[];
  tile: string; // token name for the tile colour
  glyph: string;
};

export const viewerProfiles: ViewerProfile[] = [
  {
    id: "yash",
    name: "Yash",
    blurb: "The full series, in order",
    watching: "the full series, in order",
    order: ["stats", "moments", "skills", "originals", "about", "journey", "picks"],
    tile: "var(--poster-red)",
    glyph: "Y",
  },
  {
    id: "recruiter",
    name: "Recruiter",
    blurb: "Experience, wins & skills first",
    watching: "experience, wins and skills first",
    order: ["about", "journey", "moments", "skills", "originals", "stats", "picks"],
    tile: "var(--poster-teal)",
    glyph: "R",
  },
  {
    id: "developer",
    name: "Developer",
    blurb: "Projects, live stats & GitHub first",
    watching: "projects, live stats and GitHub first",
    order: ["originals", "stats", "skills", "journey", "moments", "about", "picks"],
    tile: "var(--poster-green)",
    glyph: "</>",
  },
  {
    id: "explorer",
    name: "Explorer",
    blurb: "The story arc & highlights first",
    watching: "the story arc and highlights first",
    order: ["journey", "picks", "about", "moments", "originals", "skills", "stats"],
    tile: "var(--poster-amber)",
    glyph: "✦",
  },
];

export const episodes: Record<SectionKey, { title: string; meta: string; poster: string; mark: string }> = {
  stats: { title: "Box Office", meta: "Live LeetCode, Codeforces & GitHub", poster: "var(--poster-violet)", mark: "{ }" },
  moments: { title: "Top Moments", meta: "Wins & 6 certifications", poster: "var(--poster-red)", mark: "★" },
  skills: { title: "My Skills", meta: "6 genres · 31 titles", poster: "var(--poster-teal)", mark: "</>" },
  originals: { title: "Originals", meta: "SmartHQ · SecurePay", poster: "var(--poster-crimson)", mark: "▶" },
  about: { title: "About Me", meta: "The pilot", poster: "var(--poster-violet)", mark: "Y" },
  journey: { title: "My Journey", meta: "5 seasons", poster: "var(--poster-amber)", mark: "S5" },
  picks: { title: "Top Picks", meta: "Top 5 this season", poster: "var(--poster-green)", mark: "10" },
};

export const moments = [
  {
    category: "Academic honours",
    title: "9.17 CGPA",
    sub: "VIT Vellore",
    text: "B.Tech in Computer Science & Engineering, Aug 2023 — May 2027.",
  },
  {
    category: "Certified",
    title: "Associate Cloud Engineer",
    sub: "Google Cloud",
    text: "Deploying, monitoring and operating workloads on Google Cloud.",
    url: certifications[0].url,
  },
  {
    category: "District champion",
    title: "Archery Gold",
    sub: "Ferozepur, Punjab",
    text: "District-level gold medal in archery.",
  },
  {
    category: "Leadership",
    title: "Head Boy",
    sub: "Student council",
    text: "Led the student council and represented the student body in school-wide decisions.",
  },
  {
    category: "NCC cadet",
    title: "Debate · 3rd Place",
    sub: "District level",
    text: "Two years of NCC drills and district events, including third place in the district debate.",
  },
];

export const skillGenres: { genre: string; note: string; items: string[] }[] = [
  ...skills.map((s) => ({
    genre: s.group,
    note:
      {
        Languages: "What I write in",
        Backend: "Server-side logic",
        "Data & AI": "Storage & retrieval",
        Tooling: "Shipping & workflow",
        "Core CS": "The foundations",
      }[s.group] ?? "",
    items: s.items,
  })),
  { genre: "Off-screen", note: "Away from the keyboard", items: ["Archery", "NCC", "Debate", "Community outreach"] },
];

export const originalsMeta: Record<string, { poster: string; icon: "chart" | "card"; codename: string }> = {
  SmartHQ: { poster: "var(--poster-crimson)", icon: "chart", codename: "The Analyst" },
  SecurePay: { poster: "var(--poster-amber)", icon: "card", codename: "The Gatekeeper" },
};

export type Episode = { code: string; title: string; when: string; text: string; tags: string[]; poster: string };
export type Season = { code: string; title: string; span: string; logline: string; episodes: Episode[] };

export const seasons: Season[] = [
  {
    code: "S01",
    title: "The Beginning",
    span: "School years · 2020 — 2022",
    logline: "Boards, a student council, a parade ground and a bow.",
    episodes: [
      { code: "E01", title: "Class X", when: "2020", text: "Dewan Public School, Meerut. CBSE Secondary, 86%.", tags: ["CBSE"], poster: "var(--poster-violet)" },
      { code: "E02", title: "Class XII", when: "2022", text: "Om Public School, Gohana. CBSE Senior Secondary, 90.7%.", tags: ["CBSE"], poster: "var(--poster-teal)" },
      { code: "E03", title: "The Head Boy", when: "School years", text: "Led the student council, then two years as an NCC cadet with a district debate podium.", tags: ["Leadership", "NCC"], poster: "var(--poster-red)" },
      { code: "E04", title: "The Archer", when: "School years", text: "District-level gold in archery at Ferozepur, Punjab. Outreach drives with UDDESHYA NGO.", tags: ["Archery", "NGO"], poster: "var(--poster-green)" },
    ],
  },
  {
    code: "S02",
    title: "Enter: VIT",
    span: "Aug 2023 — present",
    logline: "Computer Science at VIT Vellore, and a stack of cloud and AI certifications.",
    episodes: [
      { code: "E01", title: "The Freshman", when: "Aug 2023", text: "B.Tech, Computer Science & Engineering at VIT Vellore. CGPA 9.17.", tags: ["VIT", "CSE"], poster: "var(--poster-violet)" },
      { code: "E02", title: "Cloud Certified", when: "VIT years", text: "Google Cloud Associate Cloud Engineer and OCI 2025 Multicloud Architect Professional.", tags: ["GCP", "OCI"], poster: "var(--poster-teal)" },
      { code: "E03", title: "The AI Track", when: "VIT years", text: "Oracle Generative AI, Data Science, Agentic AI and AI Foundations certifications.", tags: ["GenAI", "Data Science"], poster: "var(--poster-amber)" },
    ],
  },
  {
    code: "S03",
    title: "Learning to Build",
    span: "Nov — Dec 2025",
    logline: "The first production-grade build: real payments on Android.",
    episodes: [
      { code: "E01", title: "The Gatekeeper", when: "Nov — Dec 2025", text: "SecurePay: Razorpay checkout on Android with 4 SDK error states handled and 70% fewer timeouts.", tags: ["Kotlin", "Compose", "Razorpay"], poster: "var(--poster-amber)" },
    ],
  },
  {
    code: "S04",
    title: "Building Real Products",
    span: "2026",
    logline: "A finance insight engine with RAG, then backend work in a real team.",
    episodes: [
      { code: "E01", title: "The Analyst", when: "Feb — Apr 2026", text: "SmartHQ: a 7-stage Pandas pipeline and a RAG assistant that cut context by 94%.", tags: ["Python", "FastAPI", "RAG"], poster: "var(--poster-crimson)" },
      { code: "E02", title: "The Intern", when: "May — Jun 2026", text: "Software Development Intern at Ayuka Developers: Node.js services, JWT auth and RBAC for 3 roles.", tags: ["Node.js", "MongoDB", "JWT"], poster: "var(--poster-teal)" },
    ],
  },
  {
    code: "S05",
    title: "What's Next",
    span: "2027",
    logline: "Final year, and the next team to build backends with.",
    episodes: [
      { code: "E01", title: "The Finale", when: "May 2027", text: "Graduating with a B.Tech in Computer Science & Engineering from VIT Vellore.", tags: ["VIT"], poster: "var(--poster-violet)" },
      { code: "E02", title: "Now Casting", when: "Open", text: "Open to backend and applied-AI roles. If you're building something, let's talk.", tags: ["Backend", "Applied AI"], poster: "var(--poster-red)" },
    ],
  },
];

export const topPicks = [
  { title: "SmartHQ", note: "RAG over bank statements", href: "#originals", poster: "var(--poster-crimson)" },
  { title: "Ayuka Internship", note: "Node.js, JWT & RBAC", href: "#journey", poster: "var(--poster-teal)" },
  { title: "Google Cloud ACE", note: "Associate Cloud Engineer", href: "#moments", poster: "var(--poster-violet)" },
  { title: "SecurePay", note: "Razorpay on Android", href: "#originals", poster: "var(--poster-amber)" },
  { title: "Archery Gold", note: "District champion", href: "#moments", poster: "var(--poster-green)" },
];
