export interface Certification {
  name: string;
  issuer: string;
  /** What the credential actually covers — rendered as mono chips. */
  skills: string[];
  verify: string;
}

export interface CertificationGroup {
  label: string;
  items: Certification[];
}

export const certifications: CertificationGroup[] = [
  {
    label: "Cloud & infrastructure",
    items: [
      {
        name: "Associate Cloud Engineer (ACE)",
        issuer: "Google Cloud",
        skills: [
          "GCP",
          "Compute Engine",
          "IAM",
          "Kubernetes Engine",
          "Cloud deployment",
        ],
        verify:
          "https://www.credly.com/badges/43d0d920-7e71-41eb-aeed-fea2b5578a1d/public_url",
      },
      {
        name: "OCI 2025 Certified Multicloud Architect Professional",
        issuer: "Oracle",
        skills: [
          "Multicloud architecture",
          "Cross-cloud networking",
          "Workload migration",
          "OCI",
        ],
        verify:
          "https://catalog-education.oracle.com/pls/certview/sharebadge?id=42ED89251468AB5CB99E2041B60432EF50BE8CF18E6F1A3E93E6015D3E355BCC",
      },
    ],
  },
  {
    label: "AI & data",
    items: [
      {
        name: "OCI 2025 Certified Generative AI Professional",
        issuer: "Oracle",
        skills: [
          "LLMs",
          "RAG",
          "Embeddings",
          "Vector search",
          "Prompt engineering",
        ],
        verify:
          "https://catalog-education.oracle.com/pls/certview/sharebadge?id=F872A1B5D35F7D6B2FDA4E6660FAA5A3FDE5C6E2CD691AA3D599B14C5B50953C",
      },
      {
        name: "OCI 2025 Certified Data Science Professional",
        issuer: "Oracle",
        skills: [
          "ML pipelines",
          "Model deployment",
          "Feature engineering",
          "MLOps",
        ],
        verify:
          "https://catalog-education.oracle.com/pls/certview/sharebadge?id=1CC952FA82B9C96BD7C1032B004A91AE3A96829AE81A25C53F6ED2C55CDA7035",
      },
      {
        name: "Agentic AI Certified Foundations Associate",
        issuer: "Oracle",
        skills: ["AI agents", "Tool use", "Agent orchestration"],
        verify:
          "https://catalog-education.oracle.com/pls/certview/sharebadge?id=BC2C127100440E2FFEC5232E1086319C266F01933C4057360038C79921ACC7B4",
      },
      {
        name: "OCI 2025 Certified AI Foundations Associate",
        issuer: "Oracle",
        skills: ["ML fundamentals", "Deep learning", "AI services"],
        verify:
          "https://catalog-education.oracle.com/pls/certview/sharebadge?id=DC0D93911BB1CA67FB6726FA46956D12BB4D4284BCE64533A5AD82E20BD98E4B",
      },
    ],
  },
];
