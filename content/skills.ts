export interface SkillGroup {
  label: string;
  items: string[];
}

/** Plain lists. No proficiency bars, no percentages, no ratings (CLAUDE.md §4). */
export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Java", "Python", "JavaScript", "Kotlin", "C++", "C", "R", "SQL"],
  },
  {
    label: "Backend",
    items: [
      "Spring Boot",
      "Node.js",
      "Express",
      "FastAPI",
      "REST APIs",
      "JWT / RBAC",
    ],
  },
  {
    label: "Data",
    items: ["MySQL", "MongoDB", "Pandas", "Retrieval-augmented generation"],
  },
  {
    label: "Tooling",
    items: [
      "Git",
      "Postman",
      "Google Cloud Platform",
      "Beekeeper Studio",
      "React",
      "Tailwind CSS",
    ],
  },
  {
    label: "Core CS",
    items: [
      "Data structures & algorithms",
      "Object-oriented design",
      "System design",
    ],
  },
];
