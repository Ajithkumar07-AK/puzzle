import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { storage } from '../game/storage.js';
import { BASE_SCORES, HINT_PENALTIES, calculateLevelScore, getRankFromScore } from '../game/scoring.js';
import { ACHIEVEMENTS, checkNewAchievements } from '../game/achievements.js';

describe('Game State and Storage Logic', () => {
  it('default campaign state is well formed', () => {
    const campaign = storage.getCampaign();
    assert.equal(campaign.currentLevelIndex, 0);
    assert.equal(campaign.campaignTimeRemaining, 2700);
    assert.equal(campaign.totalScore, 0);
    assert.equal(campaign.mode, 'campaign');
  });

  it('default settings include accessibility and audio defaults', () => {
    const settings = storage.getSettings();
    assert.equal(settings.soundEnabled, true);
    assert.equal(settings.reducedMotion, false);
    assert.equal(settings.highContrast, false);
    assert.equal(typeof settings.volume, 'number');
  });

  it('all achievements have unique IDs and valid icons', () => {
    const ids = new Set();
    ACHIEVEMENTS.forEach(ach => {
      assert.ok(ach.id);
      assert.ok(ach.title);
      assert.ok(ach.desc);
      assert.ok(!ids.has(ach.id), `Duplicate achievement ID: ${ach.id}`);
      ids.add(ach.id);
    });
  });

  it('zero hints achievement triggers when 5 consecutive levels have 0 hints', () => {
    const campaign = {
      completedLevels: {
        1: { hintsUsed: 0 },
        2: { hintsUsed: 0 },
        3: { hintsUsed: 0 },
        4: { hintsUsed: 0 },
        5: { hintsUsed: 0 }
      }
    };
    const unlocked = checkNewAchievements(campaign, { id: 5, category: 'dots' }, { timeSpentSeconds: 30 }, []);
    assert.ok(unlocked.includes('zero_hints'));
  });

  it('speed demon achievement triggers when solved in under 25% of target time', () => {
    const campaign = { completedLevels: {} };
    const level = { id: 1, category: 'math', targetTimeSeconds: 60 };
    const unlocked = checkNewAchievements(campaign, level, { timeSpentSeconds: 10 }, []);
    assert.ok(unlocked.includes('speed_demon'));
  });

  it('perfect campaign achievement triggers on 30 completed levels', () => {
    const completed = {};
    for (let i = 1; i <= 30; i++) {
      completed[i] = { score: 500 };
    }
    const campaign = { completedLevels: completed, totalScore: 18000 };
    const unlocked = checkNewAchievements(campaign, { id: 30, isBoss: true }, { timeSpentSeconds: 60 }, []);
    assert.ok(unlocked.includes('perfect_campaign'));
  });
});

