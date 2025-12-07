import tagScoreData from "./movies.json";

// movies.json is assumed to have:
// { tags: string[], ratings: { title: string; scores: number[] }[] }

const TAGS: string[] = (tagScoreData as any).tags ?? [];
const MOVIE_SCORES: { title: string; scores: number[] }[] =
  (tagScoreData as any).ratings ?? [];

export function hasVectorData() {
  return TAGS.length > 0 && MOVIE_SCORES.length > 0;
}

export function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);

  for (let i = 0; i < n; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }

  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// Method A: build user vector from explicitly selected genres
export function buildUserVecFromSelectedTags(selected: string[]) {
  const selectedSet = new Set(selected.map((s) => s.toLowerCase()));
  return TAGS.map((t) => (selectedSet.has(String(t).toLowerCase()) ? 1 : 0));
}

// Method B: build user vector from watched titles by averaging their vectors
export function buildUserVecFromWatchedTitles(watchedTitles: string[]) {
  const normalized = new Set(watchedTitles.map((t) => t.toLowerCase()));

  const vectors = MOVIE_SCORES
    .filter((m) => normalized.has(String(m.title).toLowerCase()))
    .map((m) => m.scores);

  if (vectors.length === 0) return Array(TAGS.length).fill(0);

  const sum = Array(TAGS.length).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < TAGS.length; i++) {
      sum[i] += v[i] ?? 0;
    }
  }

  return sum.map((x) => x / vectors.length);
}

export function rankTitlesByUserVec(userVec: number[]) {
  return [...MOVIE_SCORES]
    .map((m) => ({
      title: m.title,
      score: cosineSimilarity(userVec, m.scores),
    }))
    .sort((a, b) => b.score - a.score);
}
