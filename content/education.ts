export interface EducationEntry {
  institution: string;
  qualification: string;
  /** CGPA or percentage — set in mono. */
  result: string;
  period: string;
  /** The degree leads; schooling is secondary and renders lighter. */
  primary?: boolean;
}

export const education: EducationEntry[] = [
  {
    institution: "Vellore Institute of Technology, Vellore",
    qualification: "B.Tech, Computer Science and Engineering",
    result: "CGPA 9.17",
    period: "Aug 2023 — May 2027",
    primary: true,
  },
  {
    institution: "Om Public School, Gohana, Haryana",
    qualification: "Senior Secondary (Class XII), CBSE",
    result: "90.7%",
    period: "2022",
  },
  {
    institution: "Dewan Public School, Meerut, Uttar Pradesh",
    qualification: "Secondary (Class X), CBSE",
    result: "86%",
    period: "2020",
  },
];
