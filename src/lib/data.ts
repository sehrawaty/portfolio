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
