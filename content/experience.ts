export interface Role {
  company: string;
  title: string;
  period: string;
  location: string;
  bullets: string[];
}

export const experience: Role[] = [
  {
    company: "Ayuka Developers (OPC) Pvt. Ltd.",
    title: "Software Development Intern",
    period: "May 2026 — Jun 2026",
    location: "Remote",
    bullets: [
      "Built backend services for an internal project-management platform using Node.js, Express, and MongoDB, supporting task tracking and team collaboration.",
      "Implemented JWT-based authentication and role-based access control, enabling permission-scoped access across 3 user roles — admin, manager, and member.",
      "Designed RESTful APIs powering interactive dashboards for project and task visualization, integrated with a React frontend.",
    ],
  },
];
