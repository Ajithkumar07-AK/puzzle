// Achievement Definitions and Trigger Evaluators

export const ACHIEVEMENTS = [
  {
    id: 'first_breakthrough',
    title: 'First Breakthrough',
    desc: 'Solve your very first puzzle in the cognitive laboratory.',
    icon: 'Sparkles',
    color: '#22d3ee'
  },
  {
    id: 'pattern_hunter',
    title: 'Pattern Hunter',
    desc: 'Solve 5 pattern or sequence recognition challenges.',
    icon: 'Search',
    color: '#8b5cf6'
  },
  {
    id: 'dot_master',
    title: 'Dot Master',
    desc: 'Complete all connect-the-dots challenges without exceeding allowed lines.',
    icon: 'Spline',
    color: '#34d399'
  },
  {
    id: 'zero_hints',
    title: 'Zero Hints',
    desc: 'Complete 5 consecutive levels without requesting a single hint.',
    icon: 'ShieldCheck',
    color: '#f59e0b'
  },
  {
    id: 'boss_conqueror',
    title: 'Boss Conqueror',
    desc: 'Overcome a multi-phase guardian encounter in the facility.',
    icon: 'Crown',
    color: '#ec4899'
  },
  {
    id: 'outside_the_box_thinker',
    title: 'Outside-the-Box Thinker',
    desc: 'Solve a puzzle whose solution extends strictly outside the visible frame.',
    icon: 'Compass',
    color: '#38bdf8'
  },
  {
    id: 'the_unconventional_mind',
    title: 'The Unconventional Mind',
    desc: 'Crack a lateral-thinking paradox that defies traditional linear logic.',
    icon: 'Zap',
    color: '#a78bfa'
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    desc: 'Solve any challenge in less than 20% of its target duration.',
    icon: 'Flame',
    color: '#fb7185'
  },
  {
    id: 'cognitive_architect',
    title: 'Mind Architect',
    desc: 'Reach a campaign total score exceeding 15,000 points.',
    icon: 'Award',
    color: '#fbbf24'
  },
  {
    id: 'perfect_campaign',
    title: 'Perfect Campaign',
    desc: 'Complete all 30 levels and defeat The Architect of Thought.',
    icon: 'Trophy',
    color: '#f59e0b'
  }
];

export function checkNewAchievements(campaignState, lastSolvedLevel, lastResult, unlockedIds) {
  const newUnlocked = [];
  const completedCount = Object.keys(campaignState.completedLevels || {}).length;

  // 1. First Breakthrough
  if (completedCount >= 1 && !unlockedIds.includes('first_breakthrough')) {
    newUnlocked.push('first_breakthrough');
  }

  // 2. Pattern Hunter
  let patternCount = 0;
  Object.values(campaignState.completedLevels || {}).forEach(item => {
    if (item.category === 'pattern' || item.category === 'math') patternCount++;
  });
  if (patternCount >= 5 && !unlockedIds.includes('pattern_hunter')) {
    newUnlocked.push('pattern_hunter');
  }

  // 3. Dot Master
  if (lastSolvedLevel?.category === 'dots' && !unlockedIds.includes('dot_master')) {
    newUnlocked.push('dot_master');
  }

  // 4. Boss Conqueror
  if (lastSolvedLevel?.isBoss && !unlockedIds.includes('boss_conqueror')) {
    newUnlocked.push('boss_conqueror');
  }

  // 5. Outside the box thinker (Level 5 dot puzzle or Level 20 boss)
  if ((lastSolvedLevel?.id === 5 || lastSolvedLevel?.id === 20) && !unlockedIds.includes('outside_the_box_thinker')) {
    newUnlocked.push('outside_the_box_thinker');
  }

  // 6. The Unconventional Mind (Level 7, 15, 23 lateral)
  if (lastSolvedLevel?.category === 'lateral' && !unlockedIds.includes('the_unconventional_mind')) {
    newUnlocked.push('the_unconventional_mind');
  }

  // 7. Speed Demon
  if (lastResult?.timeSpentSeconds && lastSolvedLevel?.targetTimeSeconds &&
      lastResult.timeSpentSeconds <= lastSolvedLevel.targetTimeSeconds * 0.25 &&
      !unlockedIds.includes('speed_demon')) {
    newUnlocked.push('speed_demon');
  }

  // 8. Cognitive Architect
  if ((campaignState.totalScore || 0) >= 15000 && !unlockedIds.includes('cognitive_architect')) {
    newUnlocked.push('cognitive_architect');
  }

  // 9. Perfect Campaign
  if (completedCount >= 30 && !unlockedIds.includes('perfect_campaign')) {
    newUnlocked.push('perfect_campaign');
  }

  // 10. Zero Hints (check last 5 levels)
  const completedList = Object.values(campaignState.completedLevels || {});
  if (completedList.length >= 5 && !unlockedIds.includes('zero_hints')) {
    const lastFive = completedList.slice(-5);
    const zeroHintRun = lastFive.every(lvl => (lvl.hintsUsed || 0) === 0);
    if (zeroHintRun) {
      newUnlocked.push('zero_hints');
    }
  }

  return newUnlocked;
}

