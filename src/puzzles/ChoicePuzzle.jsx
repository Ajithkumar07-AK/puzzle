import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function ChoicePuzzle({
  level,
  onComplete,
  disabled = false
}) {
  const { options = [], cryptarithm, clues, frames = [] } = level.data || {};
  const [selected, setSelected] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSelect = (opt) => {
    if (disabled) return;
    sound.playSelect();
    setSelected(opt);
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    if (selected === null || disabled) return;
    const valueToValidate = typeof selected === 'object' ? (selected.id || selected.text || selected) : selected;
    const isValid = level.validate(valueToValidate);

    if (isValid) {
      sound.playSuccess();
      onComplete(valueToValidate);
    } else {
      sound.playError();
      setErrorMsg("Incorrect deduction. Consider reviewing the premises or testing alternative assumptions.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.4rem', width: '100%', maxWidth: '560px' }}>
      {/* Optional Context Banner (e.g. Cryptarithm or Clue) */}
      {cryptarithm && (
        <div style={{
          background: 'rgba(18, 21, 34, 0.8)',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          width: '100%',
          textAlign: 'center',
          boxShadow: 'var(--shadow-glow-cyan)'
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: '#22d3ee' }}>
            {cryptarithm}
          </div>
          {clues && (
            <div style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '0.4rem', fontWeight: 600 }}>
              Known Values: {clues}
            </div>
          )}
        </div>
      )}

      {/* Frame cards for Level 17 */}
      {frames.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
          gap: '0.6rem',
          width: '100%'
        }}>
          {frames.map((frame) => (
            <div
              key={frame.id}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem',
                textAlign: 'center',
                fontSize: '0.75rem'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{frame.id}</div>
              <div style={{ color: 'var(--text-secondary)' }}>V: {frame.vertices}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Chords: {frame.chords}</div>
            </div>
          ))}
        </div>
      )}

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
        {options.map((option, idx) => {
          const isObj = typeof option === 'object';
          const optId = isObj ? option.id : option;
          const optLabel = isObj ? (option.text || option.label || option.equation || option.val || option.id) : String(option);
          const isSelected = selected === option || selected === optId;

          return (
            <div
              key={idx}
              onClick={() => handleSelect(isObj ? option.id : option)}
              style={{
                background: isSelected ? 'rgba(139, 92, 246, 0.22)' : 'var(--bg-surface-elevated)',
                border: isSelected ? '2px solid var(--accent-violet-light)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: isSelected ? 'var(--shadow-glow-violet)' : 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--accent-violet)' : 'rgba(255,255,255,0.05)',
                  border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  flexShrink: 0
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div style={{ fontSize: '0.92rem', color: isSelected ? '#ffffff' : 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {optLabel}
                  {isObj && option.desc && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {option.desc}
                    </div>
                  )}
                </div>
              </div>

              {isSelected && <Check size={18} color="#a78bfa" />}
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div style={{ color: '#fb7185', fontSize: '0.85rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      <Button
        size="lg"
        variant="cyan"
        icon={Check}
        onClick={handleSubmit}
        disabled={selected === null || disabled}
      >
        Lock In Deduction
      </Button>
    </div>
  );
}

