export interface Project {
  title: string;
  /** One sentence: the problem it solves. */
  problem: string;
  stack: string[];
  period: string;
  /** What he did and what it measurably achieved. 2–3 max. */
  bullets: string[];
  repo: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    title: "SmartHQ",
    problem:
      "Turns raw bank statement exports into automated financial insights and a grounded Q&A assistant.",
    stack: ["Python", "FastAPI", "Pandas", "React", "RAG"],
    period: "Feb 2026 — Apr 2026",
    bullets: [
      "Engineered a 7-stage Pandas pipeline transforming transaction data into 16 JSON datasets powering 14 dashboard visualizations.",
      "Implemented salary and recurring-payment detection using statistical scoring across multi-month transaction patterns.",
      "Designed a retrieval-augmented Q&A system ranking transactions by merchant, category, and recency before grounding LLM responses — cutting context payload 94% (1,500 → 80 rows).",
    ],
    repo: "https://github.com/sehrawaty/smart-statement-analyzer",
    // TODO: not deployed — add demo URL when live.
  },
  {
    title: "SecurePay",
    problem:
      "An Android payment flow integrating Razorpay checkout with transaction history and error recovery.",
    stack: ["Kotlin", "Jetpack Compose", "Razorpay SDK", "Material 3"],
    period: "Nov 2025 — Dec 2025",
    bullets: [
      "Integrated the Razorpay Checkout SDK into a Compose payment flow handling 4 distinct SDK-level error states across 500+ test transactions.",
      "Built a Material 3 interface of 13 composables spanning payment and transaction-history screens, holding 60fps on mid-range devices.",
      "Configured checkout payloads with currency prefill, retry logic, and timeout handling — reducing payment timeouts 70%.",
    ],
    repo: "https://github.com/sehrawaty/mobile-payment-app",
    // TODO: no APK release or demo — add when published.
  },
];
