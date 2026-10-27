import React, { useState } from 'react';
import { ArrowRight, Delete, Check } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function MathSequencePuzzle({
  level,
  onComplete,
  disabled = false
}) {
  const [value, setValue] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const { sequence = [], quickOptions = [], equations = [] } = level.data || {};

  const handleKeyPress = (num) => {
    if (disabled) return;
    sound.playSelect();
    setErrorMsg(null);
    setValue(prev => (prev.length < 6 ? prev + num : prev));
  };

  const handleBackspace = () => {
    sound.playClick();
    setErrorMsg(null);
    setValue(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    sound.playClick();
    setErrorMsg(null);
    setValue('');
  };

  const handleSubmit = (valToSubmit = value) => {
    if (disabled || !valToSubmit) return;
    setErrorMsg(null);

    const isValid = level.validate(valToSubmit);
    if (isValid) {
      sound.playSuccess();
      onComplete(valToSubmit);
    } else {
      sound.playError();
      setErrorMsg("Incorrect value. Recheck the mathematical difference or symbol balance.");
    }
  };

  const handleQuickSelect = (opt) => {
    sound.playSelect();
    setValue(String(opt));
    handleSubmit(String(opt));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '520px' }}>
      {/* Sequence or Equation Display */}
      {sequence.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          background: 'rgba(18, 21, 34, 0.7)',
          padding: '1.2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-bright)',
          width: '100%'
        }}>
          {sequence.map((term, i) => {
            const isMissing = term === '?';
            return (
              <div
                key={i}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: isMissing ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-surface-elevated)',
                  border: isMissing ? '2px dashed var(--accent-violet-light)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: isMissing ? '#a78bfa' : '#f8fafc',
                  boxShadow: isMissing ? 'var(--shadow-glow-violet)' : 'var(--shadow-sm)'
                }}
              >
                {isMissing ? (value || '?') : term}
              </div>
            );
          })}
        </div>
      )}

      {/* Symbol equations if present (e.g. Level 11) */}
      {equations.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          background: 'rgba(18, 21, 34, 0.7)',
          padding: '1.2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-bright)',
          width: '100%',
          textAlign: 'center'
        }}>
          {equations.map((eq, idx) => (
            <div key={idx} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: idx === equations.length - 1 ? '#fbbf24' : '#f8fafc'
            }}>
              {eq}
            </div>
          ))}
        </div>
      )}

      {/* Quick Option Pills if provided */}
      {quickOptions.length > 0 && (
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {quickOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => handleQuickSelect(opt)}
              style={{
                background: String(opt) === value ? 'var(--accent-violet)' : 'var(--bg-surface-elevated)',
                color: '#ffffff',
                border: '1px solid var(--border-medium)',
                padding: '0.5rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Input / Keypad Container */}
      <div style={{
        background: 'rgba(18, 21, 34, 0.85)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '320px'
      }}>
        {/* Value Display */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.4rem',
          fontWeight: 700,
          color: value ? '#22d3ee' : 'var(--text-muted)'
        }}>
          <span>{value || '0'}</span>
          <button
            onClick={handleBackspace}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Backspace"
          >
            <Delete size={20} />
          </button>
        </div>

        {/* 0-9 Keypad Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              style={{
                padding: '0.8rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.2rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            style={{
              padding: '0.8rem',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: '#fb7185',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            CLR
          </button>
          <button
            onClick={() => handleKeyPress(0)}
            style={{
              padding: '0.8rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            0
          </button>
          <button
            onClick={() => handleSubmit()}
            disabled={!value}
            style={{
              padding: '0.8rem',
              background: value ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              fontWeight: 700,
              cursor: value ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Check size={20} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ color: '#fb7185', fontSize: '0.85rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}

