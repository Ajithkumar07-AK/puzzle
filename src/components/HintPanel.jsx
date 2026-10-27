import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';
import { sound } from '../game/audio.js';

export default function HintPanel({
  hints = [],
  hintsUsed = 0,
  onUnlockHint,
  isPractice = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmUnlock, setConfirmUnlock] = useState(false);

  const handleRequestHint = () => {
    sound.playSelect();
    if (hintsUsed >= 2) return;
    setConfirmUnlock(true);
  };

  const handleConfirm = () => {
    sound.playHint();
    setConfirmUnlock(false);
    onUnlockHint();
  };

  return (
    <div style={{
      background: 'rgba(18, 21, 34, 0.7)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      transition: 'all var(--transition-normal)'
    }}>
      {/* Header bar */}
      <div
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 1rem',
          cursor: 'pointer',
          background: 'rgba(24, 28, 46, 0.5)',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb
            size={16}
            color={hintsUsed > 0 ? '#fbbf24' : 'var(--text-muted)'}
          />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Cognitive Hints ({hintsUsed}/2 Unlocked)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {!isPractice && hintsUsed === 0 && (
            <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
              +Zero-Hint Bonus
            </span>
          )}
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded panel body */}
      {isOpen && (
        <div style={{ padding: '0.9rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {hintsUsed === 0 && !confirmUnlock && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              alignItems: 'flex-start',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}>
              <p>Stuck on this cognitive challenge? You can unlock up to 2 contextual clues.</p>
              <Button
                size="sm"
                variant="amber"
                icon={Lightbulb}
                onClick={handleRequestHint}
              >
                Reveal Hint 1 (-35 pts)
              </Button>
            </div>
          )}

          {confirmUnlock && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
                <AlertTriangle size={16} />
                <span>Confirm Hint {hintsUsed + 1} Request</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isPractice
                  ? "In Practice Mode, hints incur zero score penalty."
                  : `Revealing Hint ${hintsUsed + 1} will deduct ${hintsUsed === 0 ? 35 : 65} score points from this level. Proceed?`}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button size="sm" variant="amber" onClick={handleConfirm}>
                  Yes, Unlock Hint
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmUnlock(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Hint 1 Display */}
          {hintsUsed >= 1 && hints[0] && (
            <div style={{
              background: 'rgba(24, 28, 46, 0.6)',
              borderLeft: '3px solid var(--accent-amber)',
              padding: '0.6rem 0.8rem',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.85rem',
              color: 'var(--text-primary)'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                Clue 1: Perspective Shift
              </div>
              <div>{hints[0]}</div>
            </div>
          )}

          {/* Hint 2 Request Button if only 1 unlocked */}
          {hintsUsed === 1 && !confirmUnlock && hints[1] && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                size="sm"
                variant="amber"
                icon={Lightbulb}
                onClick={handleRequestHint}
              >
                Reveal Hint 2 (-65 pts)
              </Button>
            </div>
          )}

          {/* Hint 2 Display */}
          {hintsUsed >= 2 && hints[1] && (
            <div style={{
              background: 'rgba(24, 28, 46, 0.6)',
              borderLeft: '3px solid var(--accent-cyan)',
              padding: '0.6rem 0.8rem',
              borderRadius: '0 6px 6px 0',
              fontSize: '0.85rem',
              color: 'var(--text-primary)'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                Clue 2: Deep Analysis
              </div>
              <div>{hints[1]}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

