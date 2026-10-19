import "server-only";
import { handles } from "./data";

// Every fetch revalidates hourly on Vercel, so the dashboard stays live
// without hammering the public APIs. Each source falls back independently.
const REVALIDATE = 3600;

export type LeetCodeStats = {
  live: boolean;
  solved: number;
  easy: number;
  medium: number;
  hard: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
  ranking: number | null;
  contestRating: number | null;
  contestsAttended: number;
  calendar: Record<string, number>; // unix seconds -> submissions
  streak: number;
  activeDays: number;
};

export type CodeforcesStats = {
  live: boolean;
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  contests: number;
  solved: number;
  history: { name: string; rating: number }[];
};

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  pushedAt: string;
};

export type GitHubStats = {
  live: boolean;
  publicRepos: number;
  followers: number;
  stars: number;
  languages: { name: string; count: number }[];
  repos: Repo[];
};

export type AllStats = {
  leetcode: LeetCodeStats;
  codeforces: CodeforcesStats;
  github: GitHubStats;
  fetchedAt: string;
};

const fallbackLeetCode: LeetCodeStats = {
  live: false,
  solved: 83,
  easy: 34,
  medium: 44,
  hard: 5,
  totalEasy: 900,
  totalMedium: 1900,
  totalHard: 850,
  ranking: null,
  contestRating: null,
  contestsAttended: 0,
  calendar: {},
  streak: 0,
  activeDays: 0,
};

const fallbackCodeforces: CodeforcesStats = {
  live: false,
  rating: null,
  maxRating: null,
  rank: null,
  contests: 0,
  solved: 0,
  history: [],
};

const fallbackGitHub: GitHubStats = {
  live: false,
  publicRepos: 16,
  followers: 0,
  stars: 0,
  languages: [
    { name: "Python", count: 9 },
    { name: "TypeScript", count: 2 },
    { name: "JavaScript", count: 2 },
    { name: "Kotlin", count: 1 },
  ],
  repos: [
    { name: "self-correcting-rag-agent", description: "Agentic RAG built on LangGraph.", language: "Python", stars: 0, url: "https://github.com/sehrawaty/self-correcting-rag-agent", pushedAt: "" },
    { name: "document-text-extraction-pipeline", description: "GPU-accelerated OCR pipeline for image-based PDFs (PaddleOCR).", language: "Python", stars: 0, url: "https://github.com/sehrawaty/document-text-extraction-pipeline", pushedAt: "" },
    { name: "langgraph-flight-agent", description: "LangGraph flight booking agent.", language: "Python", stars: 0, url: "https://github.com/sehrawaty/langgraph-flight-agent", pushedAt: "" },
    { name: "TrustFuse", description: "Multimodal AI security for wearable health sensors.", language: "TypeScript", stars: 0, url: "https://github.com/sehrawaty/TrustFuse", pushedAt: "" },
    { name: "rag-in-the-wild", description: "Benchmarking RAG on noisy documents.", language: "Python", stars: 0, url: "https://github.com/sehrawaty/rag-in-the-wild", pushedAt: "" },
    { name: "PulseGuard", description: null, language: "Python", stars: 0, url: "https://github.com/sehrawaty/PulseGuard", pushedAt: "" },
  ],
};

async function getJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}

function streakFrom(calendar: Record<string, number>) {
  const days = new Set(
    Object.keys(calendar).map((ts) => Math.floor(Number(ts) / 86400)),
  );
  let day = Math.floor(Date.now() / 86400000);
  if (!days.has(day)) day -= 1; // today not yet coded doesn't break the streak
  let streak = 0;
  while (days.has(day)) {
    streak++;
    day--;
  }
  return { streak, activeDays: days.size };
}

export async function getLeetCode(): Promise<LeetCodeStats> {
  const query = `query($u:String!){
    allQuestionsCount{difficulty count}
    matchedUser(username:$u){
      profile{ranking}
      submitStatsGlobal{acSubmissionNum{difficulty count}}
      userCalendar{submissionCalendar}
    }
    userContestRanking(username:$u){rating attendedContestsCount}
  }`;
  try {
    type R = {
      data: {
        allQuestionsCount: { difficulty: string; count: number }[];
        matchedUser: {
          profile: { ranking: number };
          submitStatsGlobal: { acSubmissionNum: { difficulty: string; count: number }[] };
          userCalendar: { submissionCalendar: string };
        } | null;
        userContestRanking: { rating: number; attendedContestsCount: number } | null;
      };
    };
    const { data } = await getJSON<R>("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (yashsehrawat.in dashboard)",
      },
      body: JSON.stringify({ query, variables: { u: handles.leetcode } }),
    });
    const user = data.matchedUser;
    if (!user) throw new Error("leetcode user missing");
    const ac = Object.fromEntries(
      user.submitStatsGlobal.acSubmissionNum.map((d) => [d.difficulty, d.count]),
    );
    const total = Object.fromEntries(data.allQuestionsCount.map((d) => [d.difficulty, d.count]));
    const calendar = JSON.parse(user.userCalendar?.submissionCalendar || "{}");
    return {
      live: true,
      solved: ac.All ?? 0,
      easy: ac.Easy ?? 0,
      medium: ac.Medium ?? 0,
      hard: ac.Hard ?? 0,
      totalEasy: total.Easy ?? fallbackLeetCode.totalEasy,
      totalMedium: total.Medium ?? fallbackLeetCode.totalMedium,
      totalHard: total.Hard ?? fallbackLeetCode.totalHard,
      ranking: user.profile?.ranking ?? null,
      contestRating: data.userContestRanking?.rating
        ? Math.round(data.userContestRanking.rating)
        : null,
      contestsAttended: data.userContestRanking?.attendedContestsCount ?? 0,
      calendar,
      ...streakFrom(calendar),
    };
  } catch (e) {
    console.warn("[stats] leetcode fallback", e);
    return fallbackLeetCode;
  }
}

export async function getCodeforces(): Promise<CodeforcesStats> {
  const h = handles.codeforces;
  try {
    type Info = { result: { rating?: number; maxRating?: number; rank?: string }[] };
    type Rating = { result: { contestName: string; newRating: number }[] };
    type Status = {
      result: { verdict?: string; problem: { contestId?: number; index: string; name: string } }[];
    };
    const [info, rating, status] = await Promise.all([
      getJSON<Info>(`https://codeforces.com/api/user.info?handles=${h}`),
      getJSON<Rating>(`https://codeforces.com/api/user.rating?handle=${h}`),
      getJSON<Status>(`https://codeforces.com/api/user.status?handle=${h}&from=1&count=2000`),
    ]);
    const u = info.result[0] ?? {};
    const solved = new Set(
      status.result
        .filter((s) => s.verdict === "OK")
        .map((s) => `${s.problem.contestId}-${s.problem.index}-${s.problem.name}`),
    ).size;
    return {
      live: true,
      rating: u.rating ?? null,
      maxRating: u.maxRating ?? null,
      rank: u.rank ?? null,
      contests: rating.result.length,
      solved,
      history: rating.result.slice(-20).map((r) => ({ name: r.contestName, rating: r.newRating })),
    };
  } catch (e) {
    console.warn("[stats] codeforces fallback", e);
    return fallbackCodeforces;
  }
}

export async function getGitHub(): Promise<GitHubStats> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    type U = { public_repos: number; followers: number };
    type R = {
      name: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      html_url: string;
      pushed_at: string;
      fork: boolean;
    };
    const [user, repos] = await Promise.all([
      getJSON<U>(`https://api.github.com/users/${handles.github}`, { headers }),
      getJSON<R[]>(
        `https://api.github.com/users/${handles.github}/repos?per_page=100&sort=pushed`,
        { headers },
      ),
    ]);
    const own = repos.filter((r) => !r.fork);
    const langCount = new Map<string, number>();
    for (const r of own) if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
    return {
      live: true,
      publicRepos: user.public_repos,
      followers: user.followers,
      stars: own.reduce((s, r) => s + r.stargazers_count, 0),
      languages: [...langCount.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      repos: own
        .filter((r) => r.name !== handles.github && r.name !== "test-remote-server")
        .slice(0, 6)
        .map((r) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          url: r.html_url,
          pushedAt: r.pushed_at,
        })),
    };
  } catch (e) {
    console.warn("[stats] github fallback", e);
    return fallbackGitHub;
  }
}

export async function getAllStats(): Promise<AllStats> {
  const [leetcode, codeforces, github] = await Promise.all([
    getLeetCode(),
    getCodeforces(),
    getGitHub(),
  ]);
  return { leetcode, codeforces, github, fetchedAt: new Date().toISOString() };
}
