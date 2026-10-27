import React, { useState, useEffect, useRef } from 'react';
import { Pause, RotateCcw, Lightbulb, Map, Volume2, VolumeX, Shield, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import Button from '../components/Button.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import GameTimer from '../components/GameTimer.jsx';
import HintPanel from '../components/HintPanel.jsx';
import VictoryModal from '../components/VictoryModal.jsx';
import PuzzleEngine from '../components/PuzzleEngine.jsx';
import { LEVELS, getLevelById } from '../data/levels.js';
import { calculateLevelScore } from '../game/scoring.js';
import { sound } from '../game/audio.js';

export default function GamePage({
  levelId,
  campaignState,
  onLevelSolved,
  onPause,
  onOpenMap,
  soundMuted,
  onToggleSound,
  isPractice = false
}) {
  const level = getLevelById(levelId);
  const [levelElapsed, setLevelElapsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [lastScoreDetails, setLastScoreDetails] = useState(null);
  const [puzzleKey, setPuzzleKey] = useState(0); // for forcing clean resets

  // Per-level timer interval
  useEffect(() => {
    setLevelElapsed(0);
    setHintsUsed(0);
    setIsVictoryModalOpen(false);

    const timer = setInterval(() => {
      setLevelElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [levelId, puzzleKey]);

  const handleUnlockHint = () => {
    setHintsUsed(prev => Math.min(2, prev + 1));
  };

  const handleLevelComplete = (answerPayload) => {
    const scoreDetails = calculateLevelScore({
      difficulty: level.difficulty,
      timeSpentSeconds: levelElapsed,
      targetTimeSeconds: level.targetTimeSeconds,
      hintsUsed,
      isPractice
    });

    setLastScoreDetails(scoreDetails);
    setIsVictoryModalOpen(true);
  };

  const handleProceedNext = () => {
    setIsVictoryModalOpen(false);
    onLevelSolved(level.id, {
      scoreDetails: lastScoreDetails,
      timeSpent: levelElapsed,
      hintsUsed
    });
  };

  const handleRestartLevel = () => {
    sound.playClick();
    setPuzzleKey(prev => prev + 1);
  };

  const getDifficultyBadge = () => {
    const d = level.difficulty;
    const colors = {
      easy: { bg: 'rgba(6, 182, 212, 0.15)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
      medium: { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa', border: 'rgba(139, 92, 246, 0.3)' },
      hard: { bg: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', border: 'rgba(244, 63, 94, 0.3)' },
      boss: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' }
    };
    const c = colors[d] || colors.easy;
    return (
      <span style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        {d}
      </span>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '1rem 1.5rem 3rem 1.5rem',
      maxWidth: '960px',
      margin: '0 auto',
      width: '100%',
      position: 'relative',
      zIndex: 1,
      gap: '1.2rem'
    }}>
      {/* Top Navigation & Status Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.8rem',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.8rem'
      }}>
        {/* Left: Level / Zone indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Button size="sm" variant="ghost" icon={Pause} onClick={onPause} title="Pause Game (Esc)">
            Pause
          </Button>
          <Button size="sm" variant="ghost" icon={Map} onClick={onOpenMap} title="View Campaign Map">
            Map
          </Button>
          <Button size="sm" variant="ghost" icon={soundMuted ? VolumeX : Volume2} onClick={onToggleSound} title="Toggle Audio">
            {soundMuted ? 'Muted' : 'Sound'}
          </Button>
        </div>

        {/* Center/Right: Timers & Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <GameTimer
            campaignSecondsRemaining={campaignState.campaignTimeRemaining}
            levelSecondsElapsed={levelElapsed}
            targetLevelSeconds={level.targetTimeSeconds}
            isPractice={isPractice}
          />

          {!isPractice && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campaign Score</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: 'var(--accent-cyan-light)' }}>
                {(campaignState.totalScore || 0).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Progress Ribbon */}
      <ProgressBar
        currentLevelId={level.id}
        completedLevels={campaignState.completedLevels || {}}
        totalLevels={30}
      />

      {/* Main Chamber Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        background: 'rgba(18, 21, 34, 0.7)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.2rem 1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '1rem',
              color: 'var(--accent-cyan)',
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              CHAMBER #{level.id}
            </span>
            {getDifficultyBadge()}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {level.category}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Button size="sm" variant="ghost" icon={RotateCcw} onClick={handleRestartLevel} title="Reset Puzzle">
              Reset
            </Button>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', color: '#ffffff', letterSpacing: '-0.01em' }}>
          {level.title}
        </h2>

        <p style={{
          fontSize: '0.92rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          whiteSpace: 'pre-line'
        }}>
          {level.instructions}
        </p>
      </div>

      {/* Reusable Dynamic Puzzle Engine Canvas */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        margin: '0.5rem 0'
      }}>
        <PuzzleEngine
          key={puzzleKey}
          level={level}
          onComplete={handleLevelComplete}
        />
      </div>

      {/* Contextual Hint Drawer */}
      {!level.isBoss && (
        <HintPanel
          hints={level.hints}
          hintsUsed={hintsUsed}
          onUnlockHint={handleUnlockHint}
          isPractice={isPractice}
        />
      )}

      {/* Level Solve Celebration & Explanation Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        level={level}
        scoreDetails={lastScoreDetails}
        timeSpent={levelElapsed}
        hintsUsed={hintsUsed}
        onNext={handleProceedNext}
        isLastLevel={level.id === 30}
      />
    </div>
  );
}

