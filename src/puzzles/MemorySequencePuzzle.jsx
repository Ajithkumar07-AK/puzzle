import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RotateCcw, Check, Sparkles } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function MemorySequencePuzzle({
  level,
  onComplete,
  disabled = false
}) {
  const { sequence = [], symbols = [], displayTimeMs = 3500, type = 'memorySequence' } = level.data || {};
  const isReverse = type === 'memoryReverse';

  const [phase, setPhase] = useState('preview'); // 'preview' | 'input'
  const [userSequence, setUserSequence] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [timerProgress, setTimerProgress] = useState(100);

  // Preview countdown and symbol reveal
  useEffect(() => {
    setPhase('preview');
    setUserSequence([]);
    setErrorMsg(null);
    setTimerProgress(100);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / displayTimeMs) * 100);
      setTimerProgress(remainingPct);
      if (elapsed >= displayTimeMs) {
        clearInterval(interval);
        setPhase('input');
        sound.playSelect();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [level.id, displayTimeMs]);

  const handleInputSymbol = (sym) => {
    if (phase !== 'input' || disabled) return;
    sound.playSelect();
    setErrorMsg(null);
    if (userSequence.length < sequence.length) {
      setUserSequence(prev => [...prev, sym]);
    }
  };

  const handleBackspace = () => {
    sound.playClick();
    setUserSequence(prev => prev.slice(0, -1));
  };

  const handleReplay = () => {
    sound.playClick();
    setPhase('preview');
    setUserSequence([]);
    setErrorMsg(null);
    setTimerProgress(100);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / displayTimeMs) * 100);
      setTimerProgress(remainingPct);
      if (elapsed >= displayTimeMs) {
        clearInterval(interval);
        setPhase('input');
      }
    }, 50);
  };

  const handleSubmit = () => {
    if (phase !== 'input' || disabled) return;
    if (userSequence.length < sequence.length) {
      setErrorMsg(`Please select all ${sequence.length} elements.`);
      return;
    }

    const isValid = level.validate(userSequence);
    if (isValid) {
      sound.playSuccess();
      onComplete(userSequence);
    } else {
      sound.playError();
      setErrorMsg(isReverse ? "Incorrect reverse order. Try replaying the preview." : "Incorrect sequence recall. Try replaying the preview.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '520px' }}>
      {/* Status banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.6rem 1rem',
        background: 'rgba(18, 21, 34, 0.7)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {phase === 'preview' ? <Eye size={16} color="#fbbf24" /> : <EyeOff size={16} color="#22d3ee" />}
          <span style={{ fontWeight: 600 }}>
            {phase === 'preview' ? 'Memorize Resonance Sequence' : (isReverse ? 'Recall in REVERSE Order' : 'Reproduce Sequence')}
          </span>
        </div>
        {phase === 'input' && (
          <Button size="sm" variant="ghost" icon={RotateCcw} onClick={handleReplay}>
            Replay Preview
          </Button>
        )}
      </div>

      {/* Presentation Stage */}
      {phase === 'preview' ? (
        <div style={{
          background: 'rgba(18, 21, 34, 0.85)',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-glow-cyan)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
            {sequence.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '0.8rem 1.2rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-cyan)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#22d3ee',
                  boxShadow: '0 0 12px rgba(34, 211, 238, 0.3)'
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Countdown timer bar */}
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: `${timerProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #22d3ee, #8b5cf6)',
              transition: 'width 50ms linear'
            }} />
          </div>
        </div>
      ) : (
        /* Input Reproduction Stage */
        <div style={{
          background: 'rgba(18, 21, 34, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}>
          {/* User entered slots */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.6rem',
            justifyContent: 'center',
            minHeight: '52px',
            background: 'var(--bg-primary)',
            padding: '0.6rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            {Array.from({ length: sequence.length }).map((_, i) => {
              const sym = userSequence[i];
              return (
                <div
                  key={i}
                  style={{
                    minWidth: '50px',
                    height: '42px',
                    padding: '0 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    background: sym ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.02)',
                    border: sym ? '1px solid var(--accent-violet-light)' : '1px dashed var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: sym ? '#ffffff' : 'var(--text-dim)'
                  }}
                >
                  {sym || (i + 1)}
                </div>
              );
            })}
          </div>

          {/* Interactive input chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
            {(symbols.length > 0 ? symbols : [1, 2, 4, 7, 8, 9]).map((item) => (
              <button
                key={item}
                onClick={() => handleInputSymbol(item)}
                style={{
                  padding: '0.6rem 1.1rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Backspace control */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button size="sm" variant="ghost" onClick={handleBackspace} disabled={userSequence.length === 0}>
              Remove Last Entry
            </Button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div style={{ color: '#fb7185', fontSize: '0.85rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {phase === 'input' && (
        <Button
          size="lg"
          variant="cyan"
          icon={Check}
          onClick={handleSubmit}
          disabled={userSequence.length < sequence.length || disabled}
        >
          Confirm Sequence
        </Button>
      )}
    </div>
  );
}

