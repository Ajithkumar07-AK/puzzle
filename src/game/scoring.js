// Scoring, Evaluation, and Cognitive Rank Calculations

export const BASE_SCORES = {
  easy: 250,
  medium: 500,
  hard: 850,
  boss: 1200
};

export const HINT_PENALTIES = {
  0: 0,
  1: 35,
  2: 100 // Cumulative penalty if both hints used
};

export function calculateLevelScore({ difficulty, timeSpentSeconds, targetTimeSeconds, hintsUsed = 0, isPractice = false }) {
  if (isPractice) {
    // In practice mode, score is unpenalized practice points
    return 100;
  }

  const base = BASE_SCORES[difficulty] || 300;
  const hintPenalty = HINT_PENALTIES[hintsUsed] || 0;

  // Time bonus: up to 25% extra if completed under target time
  let timeBonus = 0;
  if (timeSpentSeconds < targetTimeSeconds) {
    const savingsRatio = (targetTimeSeconds - timeSpentSeconds) / targetTimeSeconds;
    timeBonus = Math.round(base * 0.25 * savingsRatio);
  }

  // Ensure reasonable minimum floor (at least 40% of base)
  const minScore = Math.round(base * 0.4);
  const total = Math.max(minScore, base + timeBonus - hintPenalty);

  return {
    total,
    base,
    timeBonus,
    hintPenalty
  };
}

export const COGNITIVE_RANKS = [
  { minScore: 20000, title: 'OUT OF THE BOX LEGEND', badge: '👑', desc: 'Transcendent cognitive agility. Master of the unconventional.' },
  { minScore: 15000, title: 'Mind Architect', badge: '🔮', desc: 'Exceptional synthesis of spatial, deductive, and lateral reasoning.' },
  { minScore: 10000, title: 'Logic Strategist', badge: '⚡', desc: 'Formidable analytical rigor and rapid constraint resolution.' },
  { minScore: 5000,  title: 'Pattern Seeker', badge: '🔍', desc: 'Keen eye for non-obvious symmetries, sequences, and structures.' },
  { minScore: 0,     title: 'Curious Beginner', badge: '🌱', desc: 'Stepping beyond the conventional boundaries of thought.' }
];

export function getRankFromScore(totalScore) {
  for (const rank of COGNITIVE_RANKS) {
    if (totalScore >= rank.minScore) {
      return rank;
    }
  }
  return COGNITIVE_RANKS[COGNITIVE_RANKS.length - 1];
}

