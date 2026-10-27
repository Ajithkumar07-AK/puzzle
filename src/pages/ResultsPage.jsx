import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, CheckCircle2, Award, RotateCcw, Compass, Crown, Lightbulb, Sparkles } from 'lucide-react';
import Button from '../components/Button.jsx';
import { getRankFromScore } from '../game/scoring.js';
import { ACHIEVEMENTS } from '../game/achievements.js';
import { sound } from '../game/audio.js';

export default function ResultsPage({
  campaignState,
  unlockedAchievements = [],
  onReplayCampaign,
  onOpenPractice,
  onOpenMap
}) {
  const { totalScore = 0, campaignTimeElapsed = 0, completedLevels = {}, hintsUsedCount = 0 } = campaignState;
  const completedCount = Object.keys(completedLevels).length;
  const rank = getRankFromScore(totalScore);

  const bossesDefeated = [10, 20, 30].filter(id => !!completedLevels[id]).length;

  useEffect(() => {
    sound.playBossVictory();
    try {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2.5rem 1.5rem',
      maxWidth: '860px',
      margin: '0 auto',
      width: '100%',
      position: 'relative',
      zIndex: 1,
      gap: '2rem'
    }}>
      {/* Grand Title Banner */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '0.3rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#fbbf24',
          textTransform: 'uppercase'
        }}>
          <Sparkles size={14} />
          <span>Evaluation Complete</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          COGNITIVE ASSESSMENT DOSSIER
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
          Your performance across all 30 cognitive testing chambers has been compiled and analyzed by the facility.
        </p>
      </div>

      {/* Rank Showcase Card */}
      <div style={{
        background: 'linear-gradient(180deg, #1c1834 0%, #121526 100%)',
        border: '2px solid var(--accent-violet)',
        boxShadow: '0 0 35px rgba(139, 92, 246, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem'
      }}>
        <div style={{ fontSize: '3.5rem', lineHeight: '1' }}>
          {rank.badge}
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            Conferred Cognitive Rank
          </span>
          <h2 style={{ fontSize: '2rem', color: '#ffffff', letterSpacing: '0.02em', marginTop: '0.2rem' }}>
            {rank.title}
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', lineHeight: '1.4' }}>
          {rank.desc}
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(24, 28, 46, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
            <Trophy size={18} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Final Score</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
            {totalScore.toLocaleString()}
          </span>
        </div>

        <div style={{
          background: 'rgba(24, 28, 46, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Chambers Solved</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
            {completedCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 30</span>
          </span>
        </div>

        <div style={{
          background: 'rgba(24, 28, 46, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
            <Crown size={18} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Guardians Defeated</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
            {bossesDefeated} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 3</span>
          </span>
        </div>

        <div style={{
          background: 'rgba(24, 28, 46, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-violet-light)' }}>
            <Clock size={18} />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Elapsed Time</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {formatTime(campaignTimeElapsed)}
          </span>
        </div>
      </div>

      {/* Unlocked Achievements Showcase */}
      <div style={{
        background: 'rgba(18, 21, 34, 0.8)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Award size={20} color="#fbbf24" />
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>
            Facility Commendations ({unlockedAchievements.length} Unlocked)
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.8rem'
        }}>
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                style={{
                  background: isUnlocked ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                  border: isUnlocked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  opacity: isUnlocked ? 1 : 0.35
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isUnlocked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Award size={16} color={isUnlocked ? '#fbbf24' : 'var(--text-dim)'} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isUnlocked ? '#ffffff' : 'var(--text-muted)' }}>
                    {ach.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.2', marginTop: '2px' }}>
                    {ach.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <Button size="xl" variant="cyan" icon={RotateCcw} onClick={onReplayCampaign}>
          Replay Campaign
        </Button>
        <Button size="xl" variant="secondary" icon={Compass} onClick={onOpenPractice}>
          Practice Missed Chambers
        </Button>
        <Button size="xl" variant="secondary" icon={Trophy} onClick={onOpenMap}>
          Review Map
        </Button>
      </div>
    </div>
  );
}

