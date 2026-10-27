import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Zap, Trophy, Lightbulb, Clock } from 'lucide-react';
import Button from './Button.jsx';
import { sound } from '../game/audio.js';

export default function VictoryModal({
  isOpen,
  level,
  scoreDetails,
  timeSpent,
  hintsUsed,
  onNext,
  isLastLevel = false
}) {
  useEffect(() => {
    if (isOpen) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: level.isBoss ? 120 : 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#8b5cf6', '#f59e0b', '#34d399']
        });
      } catch (e) {}
    }
  }, [isOpen, level]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 8, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #181c2e 0%, #121522 100%)',
        border: '1px solid var(--border-bright)',
        boxShadow: 'var(--shadow-glow-violet)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '560px',
        width: '100%',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.4rem',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={24} color="#34d399" />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Chamber Resolved
            </span>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>
              Level {level.id}: {level.title}
            </h2>
          </div>
        </div>

        {/* Score Breakdown Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.6rem',
          background: 'rgba(11, 13, 22, 0.6)',
          padding: '0.8rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Base Score</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              +{scoreDetails?.base || 250}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Speed Bonus</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#34d399' }}>
              +{scoreDetails?.timeBonus || 0}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hint Penalty</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: (scoreDetails?.hintPenalty || 0) > 0 ? '#f43f5e' : 'var(--text-muted)' }}>
              -{(scoreDetails?.hintPenalty || 0)}
            </span>
          </div>
        </div>

        {/* Total Earned Highlight */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          padding: '0.7rem 1.2rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={18} color="#fbbf24" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>Total Chamber Yield</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 800, color: '#22d3ee' }}>
            +{scoreDetails?.total || 250} pts
          </span>
        </div>

        {/* Cognitive Explanation */}
        <div style={{
          background: 'rgba(24, 28, 46, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          fontSize: '0.85rem',
          lineHeight: '1.5',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
            Cognitive Principle & Solution Breakdown
          </div>
          <div>{level.explanation}</div>
        </div>

        {/* Next button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.4rem' }}>
          <Button
            size="lg"
            variant="cyan"
            icon={ArrowRight}
            onClick={onNext}
          >
            {isLastLevel ? "Proceed to Final Evaluation" : "Next Chamber"}
          </Button>
        </div>
      </div>
    </div>
  );
}

