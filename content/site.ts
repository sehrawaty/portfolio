export interface SiteConfig {
  name: string;
  /** What he builds — not adjectives (CLAUDE.md §7). */
  positioning: string;
  /** Supporting line under the h1. Stack signal, no claims. */
  subline: string;
  email: string;
  linkedin: string;
  github: string;
  resumePath: string;
  domain: string;
}

export const site: SiteConfig = {
  name: "Yash Sehrawat",
  positioning:
    "I build backend services — APIs, authentication systems, and applied-AI pipelines.",
  subline:
    "Final-year CS student at VIT Vellore. Java, Spring Boot, Node.js, FastAPI, and retrieval systems.",
  email: "yash.sehrawat.tech@gmail.com",
  linkedin: "https://linkedin.com/in/sehrawatyash",
  github: "https://github.com/sehrawaty",
  resumePath: "/Yash_Sehrawat_Resume.pdf",
  domain: "https://yashsehrawat.in",
};

export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];
