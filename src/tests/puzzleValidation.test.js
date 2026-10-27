import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, getLevelById, getLevelsByZone } from '../data/levels.js';
import { calculateLevelScore, getRankFromScore } from '../game/scoring.js';
import { checkNewAchievements } from '../game/achievements.js';

describe('OUT OF THE BOX — All 30 Levels Validation Test Suite', () => {
  it('manifest contains exactly 30 authored levels', () => {
    assert.equal(LEVELS.length, 30);
    const ids = LEVELS.map(l => l.id);
    for (let i = 1; i <= 30; i++) {
      assert.ok(ids.includes(i), `Missing level ID ${i}`);
    }
  });

  it('zone distribution conforms to specifications', () => {
    const zone1 = getLevelsByZone(1);
    const zone2 = getLevelsByZone(2);
    const zone3 = getLevelsByZone(3);

    assert.equal(zone1.length, 10);
    assert.equal(zone2.length, 10);
    assert.equal(zone3.length, 10);

    assert.equal(getLevelById(10).isBoss, true);
    assert.equal(getLevelById(20).isBoss, true);
    assert.equal(getLevelById(30).isBoss, true);
  });

  it('all 30 levels have required fields, instructions, hints, and validators', () => {
    LEVELS.forEach(level => {
      assert.ok(level.id > 0);
      assert.ok(level.title.length > 0);
      assert.ok(level.category.length > 0);
      assert.ok(level.difficulty.length > 0);
      assert.ok(level.targetTimeSeconds > 0);
      assert.ok(level.instructions.length > 10);
      assert.ok(level.hints.length >= 2);
      assert.ok(level.explanation.length > 10);
      assert.equal(typeof level.validate, 'function');
    });
  });

  // Individual Level Verification
  it('Level 1: validates correct mathematical progression (42)', () => {
    const lvl = getLevelById(1);
    assert.equal(lvl.validate(42), true);
    assert.equal(lvl.validate("42"), true);
    assert.equal(lvl.validate(36), false);
    assert.equal(lvl.validate(40), false);
  });

  it('Level 2: validates missing glyph in 3x3 matrix (Option A)', () => {
    const lvl = getLevelById(2);
    assert.equal(lvl.validate("A"), true);
    assert.equal(lvl.validate("a"), true);
    assert.equal(lvl.validate("B"), false);
    assert.equal(lvl.validate("C"), false);
  });

  it('Level 3: validates unfolded cube opposite face (Flame)', () => {
    const lvl = getLevelById(3);
    assert.equal(lvl.validate("Flame"), true);
    assert.equal(lvl.validate("flame"), true);
    assert.equal(lvl.validate("Moon"), false);
  });

  it('Level 4: validates three observers truth-teller deduction (Alpha)', () => {
    const lvl = getLevelById(4);
    assert.equal(lvl.validate("Alpha"), true);
    assert.equal(lvl.validate("alpha"), true);
    assert.equal(lvl.validate("Beta"), false);
    assert.equal(lvl.validate("Gamma"), false);
  });

  it('Level 5: validates classic 9 dots in 4 lines beyond frame', () => {
    const lvl = getLevelById(5);
    const valid4Lines = [
      { visitedPoints: [0, 1, 2] },
      { visitedPoints: [5, 7] },
      { visitedPoints: [6, 3, 0] },
      { visitedPoints: [4, 8] }
    ];
    assert.equal(lvl.validate(valid4Lines), true);
    assert.equal(lvl.validate([{ visitedPoints: [0, 1, 2] }]), false);
    assert.equal(lvl.validate([
      { visitedPoints: [0, 1] }, { visitedPoints: [2, 5] },
      { visitedPoints: [8, 7] }, { visitedPoints: [6, 3] },
      { visitedPoints: [4] }
    ]), false);
  });

  it('Level 6: validates logic switches B XOR C', () => {
    const lvl = getLevelById(6);
    assert.equal(lvl.validate({ B: 1, C: 0 }), true);
    assert.equal(lvl.validate({ B: 0, C: 1 }), true);
    assert.equal(lvl.validate({ B: 0, C: 0 }), false);
    assert.equal(lvl.validate({ B: 1, C: 1 }), false);
  });

  it('Level 7: validates burning fuses lateral puzzle (Option B)', () => {
    const lvl = getLevelById(7);
    assert.equal(lvl.validate("B"), true);
    assert.equal(lvl.validate("b"), true);
    assert.equal(lvl.validate("A"), false);
  });

  it('Level 8: validates neural sequence memory', () => {
    const lvl = getLevelById(8);
    assert.equal(lvl.validate(["Omega", "Alpha", "Delta", "Sigma", "Gamma"]), true);
    assert.equal(lvl.validate(["Alpha", "Omega", "Delta", "Sigma", "Gamma"]), false);
  });

  it('Level 9: validates matchstick equation transforms', () => {
    const lvl = getLevelById(9);
    assert.equal(lvl.validate("A"), true);
    assert.equal(lvl.validate("D"), true);
    assert.equal(lvl.validate("B"), false);
  });

  it('Level 10: BOSS 1 — validates all 3 phases of Pattern Keeper', () => {
    const boss = getLevelById(10);
    assert.equal(boss.validate({ phase1: "65", phase2: "A", phase3: "168" }), true);
    assert.equal(boss.validate(["65", "A", "168"]), true);
    assert.equal(boss.validate({ phase1: "64", phase2: "A", phase3: "168" }), false);
    assert.equal(boss.validate({ phase1: "65", phase2: "B", phase3: "168" }), false);
  });

  it('Level 11: validates symbol balance equation (16)', () => {
    const lvl = getLevelById(11);
    assert.equal(lvl.validate(16), true);
    assert.equal(lvl.validate("16"), true);
    assert.equal(lvl.validate(14), false);
  });

  it('Level 12: validates 10-node constellation web in 5 strokes', () => {
    const lvl = getLevelById(12);
    const validStrokes = [
      { visitedPoints: [0, 1, 3] },
      { visitedPoints: [6, 8] },
      { visitedPoints: [7, 5, 2] },
      { visitedPoints: [0, 9, 4] },
      { visitedPoints: [4, 8] }
    ];
    assert.equal(lvl.validate(validStrokes), true);
  });

  it('Level 13: validates constrained labyrinth min steps (6)', () => {
    const lvl = getLevelById(13);
    assert.equal(lvl.validate(6), true);
    assert.equal(lvl.validate("6"), true);
    assert.equal(lvl.validate(5), false);
  });

  it('Level 14: validates roundtable deduction (Dave)', () => {
    const lvl = getLevelById(14);
    assert.equal(lvl.validate("Dave"), true);
    assert.equal(lvl.validate("dave"), true);
    assert.equal(lvl.validate("Vance"), false);
  });

  it('Level 15: validates elevator paradox lateral deduction (B)', () => {
    const lvl = getLevelById(15);
    assert.equal(lvl.validate("B"), true);
    assert.equal(lvl.validate("A"), false);
  });

  it('Level 16: validates harmonic resonator equation 2(D1)+3(D2)+5(D3)=41', () => {
    const lvl = getLevelById(16);
    assert.equal(lvl.validate({ d1: 2, d2: 4, d3: 5 }), true);
    assert.equal(lvl.validate([2, 4, 5]), true);
    assert.equal(lvl.validate([1, 3, 6]), true);
    assert.equal(lvl.validate([5, 2, 5]), false);
    assert.equal(lvl.validate([1, 2, 3]), false);
  });

  it('Level 17: validates anomalous frame detection (Frame C)', () => {
    const lvl = getLevelById(17);
    assert.equal(lvl.validate("Frame C"), true);
    assert.equal(lvl.validate("C"), true);
    assert.equal(lvl.validate("Frame A"), false);
  });

  it('Level 18: validates reverse working memory span', () => {
    const lvl = getLevelById(18);
    assert.equal(lvl.validate("814927"), true);
    assert.equal(lvl.validate("8, 1, 4, 9, 2, 7"), true);
    assert.equal(lvl.validate("729418"), false);
  });

  it('Level 19: validates magic rosette center cell calculation (4)', () => {
    const lvl = getLevelById(19);
    assert.equal(lvl.validate(4), true);
    assert.equal(lvl.validate("4"), true);
    assert.equal(lvl.validate(3), false);
  });

  it('Level 20: BOSS 2 — validates all 3 phases of Reality Breaker', () => {
    const boss = getLevelById(20);
    assert.equal(boss.validate({ phase1: "6", phase2: "A", phase3: "B" }), true);
    assert.equal(boss.validate(["6", "A", "B"]), true);
    assert.equal(boss.validate({ phase1: "4", phase2: "A", phase3: "B" }), false);
    assert.equal(boss.validate({ phase1: "6", phase2: "C", phase3: "B" }), false);
  });

  it('Level 21: validates cryptarithm leading digit M (1)', () => {
    const lvl = getLevelById(21);
    assert.equal(lvl.validate(1), true);
    assert.equal(lvl.validate("1"), true);
    assert.equal(lvl.validate(2), false);
  });

  it('Level 22: validates non-Euclidean star continuous strokes (5)', () => {
    const lvl = getLevelById(22);
    assert.equal(lvl.validate(5), true);
    assert.equal(lvl.validate(4), false);
  });

  it('Level 23: validates two doors paradox optimal interrogation (B)', () => {
    const lvl = getLevelById(23);
    assert.equal(lvl.validate("B"), true);
    assert.equal(lvl.validate("A"), false);
  });

  it('Level 24: validates hypercube projection cells (8)', () => {
    const lvl = getLevelById(24);
    assert.equal(lvl.validate(8), true);
    assert.equal(lvl.validate(16), false);
  });

  it('Level 25: validates quantum spin state deduction (-1/2)', () => {
    const lvl = getLevelById(25);
    assert.equal(lvl.validate("-1/2"), true);
    assert.equal(lvl.validate("+1/2"), false);
  });

  it('Level 26: validates cellular automaton rule 90 (Option A)', () => {
    const lvl = getLevelById(26);
    assert.equal(lvl.validate("A"), true);
    assert.equal(lvl.validate("B"), false);
  });

  it('Level 27: validates Archimedes lever balance (4 kg)', () => {
    const lvl = getLevelById(27);
    assert.equal(lvl.validate(4), true);
    assert.equal(lvl.validate(3), false);
  });

  it('Level 28: validates Stroop cognitive interference target ink color (Cyan)', () => {
    const lvl = getLevelById(28);
    assert.equal(lvl.validate("Cyan"), true);
    assert.equal(lvl.validate("cyan"), true);
    assert.equal(lvl.validate("Red"), false);
  });

  it('Level 29: validates Möbius strip centerline cut topology (Option C)', () => {
    const lvl = getLevelById(29);
    assert.equal(lvl.validate("C"), true);
    assert.equal(lvl.validate("A"), false);
  });

  it('Level 30: BOSS 3 — validates all 3 phases of Architect of Thought', () => {
    const boss = getLevelById(30);
    assert.equal(boss.validate({ phase1: "144", phase2: "3", phase3: "A" }), true);
    assert.equal(boss.validate(["144", "3", "A"]), true);
    assert.equal(boss.validate({ phase1: "140", phase2: "3", phase3: "A" }), false);
  });
});

describe('Scoring and Achievements System', () => {
  it('correctly calculates base score, time bonus, and hint penalties', () => {
    const scoreFast = calculateLevelScore({
      difficulty: 'easy',
      timeSpentSeconds: 20,
      targetTimeSeconds: 45,
      hintsUsed: 0
    });
    assert.ok(scoreFast.total > scoreFast.base);
    assert.equal(scoreFast.hintPenalty, 0);

    const scoreWithHints = calculateLevelScore({
      difficulty: 'hard',
      timeSpentSeconds: 120,
      targetTimeSeconds: 90,
      hintsUsed: 2
    });
    assert.equal(scoreWithHints.hintPenalty, 100);
    assert.equal(scoreWithHints.timeBonus, 0);
    assert.ok(scoreWithHints.total < scoreWithHints.base);
  });

  it('maps cognitive ranks appropriately', () => {
    assert.equal(getRankFromScore(22000).title, 'OUT OF THE BOX LEGEND');
    assert.equal(getRankFromScore(16000).title, 'Mind Architect');
    assert.equal(getRankFromScore(11000).title, 'Logic Strategist');
    assert.equal(getRankFromScore(6000).title, 'Pattern Seeker');
    assert.equal(getRankFromScore(1000).title, 'Curious Beginner');
  });

  it('triggers First Breakthrough on first solve', () => {
    const campaign = { completedLevels: { 1: { score: 250 } }, totalScore: 250 };
    const unlocked = checkNewAchievements(campaign, { id: 1, category: 'math' }, { timeSpentSeconds: 30 }, []);
    assert.ok(unlocked.includes('first_breakthrough'));
  });

  it('triggers Outside-the-Box Thinker on Level 5', () => {
    const campaign = { completedLevels: { 5: { score: 250 } }, totalScore: 250 };
    const unlocked = checkNewAchievements(campaign, { id: 5, category: 'dots' }, { timeSpentSeconds: 30 }, []);
    assert.ok(unlocked.includes('outside_the_box_thinker'));
  });
});

