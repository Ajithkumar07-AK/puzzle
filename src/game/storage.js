// Local Storage Persistence Manager for OUT OF THE BOX

const KEYS = {
  CAMPAIGN: 'ootb_campaign_state',
  SETTINGS: 'ootb_settings',
  ACHIEVEMENTS: 'ootb_achievements',
  STATS: 'ootb_player_stats',
  DAILY: 'ootb_daily_challenge'
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  ambientSound: true,
  volume: 0.6,
  reducedMotion: false,
  highContrast: false,
  textSize: 'normal', // 'normal' | 'large'
  showTimerInPractice: true
};

const DEFAULT_CAMPAIGN = {
  currentLevelIndex: 0, // 0 to 29 (Levels 1 to 30)
  unlockedLevelMax: 0,
  completedLevels: {}, // { [levelId]: { score, timeSpent, hintsUsed, solvedAt } }
  campaignTimeRemaining: 45 * 60, // 2700 seconds (45 min)
  campaignTimeElapsed: 0,
  totalScore: 0,
  hintsUsedCount: 0,
  isCompleted: false,
  startedAt: null,
  finishedAt: null,
  mode: 'campaign' // 'campaign' | 'practice'
};

const DEFAULT_STATS = {
  totalAttempts: 0,
  totalSolved: 0,
  perfectLevels: 0, // Solved without hints under target time
  categoryAccuracy: {
    math: { solved: 0, total: 0 },
    dots: { solved: 0, total: 0 },
    spatial: { solved: 0, total: 0 },
    logic: { solved: 0, total: 0 },
    lateral: { solved: 0, total: 0 },
    pattern: { solved: 0, total: 0 },
    memory: { solved: 0, total: 0 },
    experiment: { solved: 0, total: 0 }
  }
};

export const storage = {
  // Campaign state
  getCampaign() {
    try {
      const data = localStorage.getItem(KEYS.CAMPAIGN);
      return data ? { ...DEFAULT_CAMPAIGN, ...JSON.parse(data) } : { ...DEFAULT_CAMPAIGN };
    } catch (e) {
      return { ...DEFAULT_CAMPAIGN };
    }
  },

  saveCampaign(state) {
    try {
      localStorage.setItem(KEYS.CAMPAIGN, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save campaign state:', e);
    }
  },

  resetCampaign() {
    try {
      const fresh = { ...DEFAULT_CAMPAIGN, startedAt: Date.now() };
      localStorage.setItem(KEYS.CAMPAIGN, JSON.stringify(fresh));
      return fresh;
    } catch (e) {
      return { ...DEFAULT_CAMPAIGN };
    }
  },

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      return { ...DEFAULT_SETTINGS };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  },

  // Achievements
  getAchievements() {
    try {
      const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveAchievements(achievements) {
    try {
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (e) {
      console.warn('Failed to save achievements:', e);
    }
  },

  // Player Stats
  getStats() {
    try {
      const data = localStorage.getItem(KEYS.STATS);
      return data ? { ...DEFAULT_STATS, ...JSON.parse(data) } : { ...DEFAULT_STATS };
    } catch (e) {
      return { ...DEFAULT_STATS };
    }
  },

  saveStats(stats) {
    try {
      localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save stats:', e);
    }
  },

  // Daily Challenge
  getDaily() {
    try {
      const data = localStorage.getItem(KEYS.DAILY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  saveDaily(dailyData) {
    try {
      localStorage.setItem(KEYS.DAILY, JSON.stringify(dailyData));
    } catch (e) {
      console.warn('Failed to save daily data:', e);
    }
  }
};

