import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function MatrixPuzzle({
  level,
  onComplete,
  disabled = false
}) {
  const { grid = [], options = [] } = level.data || {};
  const [selectedId, setSelectedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const renderShapeGlyph = (item, isLarge = false) => {
    const size = isLarge ? 54 : 42;
    const { shape, dots } = item;

    if (shape === 'empty') {
      return (
        <div style={{
          width: size,
          height: size,
          border: '2px dashed #fbbf24',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24'
        }}>
          <HelpCircle size={24} />
        </div>
      );
    }

    return (
      <svg width={size} height={size} viewBox="0 0 60 60">
        {shape === 'circle' && (
          <circle cx="30" cy="30" r="24" fill="none" stroke="#22d3ee" strokeWidth="3" />
        )}
        {shape === 'square' && (
          <rect x="8" y="8" width="44" height="44" rx="4" fill="none" stroke="#a78bfa" strokeWidth="3" />
        )}
        {shape === 'triangle' && (
          <polygon points="30,8 54,50 6,50" fill="none" stroke="#34d399" strokeWidth="3" />
        )}
        {/* Render internal dots */}
        {dots === 1 && (
          <circle cx="30" cy="30" r="4" fill="#fbbf24" />
        )}
        {dots === 2 && (
          <>
            <circle cx="23" cy="30" r="3.5" fill="#fbbf24" />
            <circle cx="37" cy="30" r="3.5" fill="#fbbf24" />
          </>
        )}
        {dots === 3 && (
          <>
            <circle cx="20" cy="34" r="3" fill="#fbbf24" />
            <circle cx="40" cy="34" r="3" fill="#fbbf24" />
            <circle cx="30" cy="22" r="3" fill="#fbbf24" />
          </>
        )}
      </svg>
    );
  };

  const handleSelectOption = (optId) => {
    if (disabled) return;
    sound.playSelect();
    setSelectedId(optId);
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    if (!selectedId || disabled) return;
    const isValid = level.validate(selectedId);
    if (isValid) {
      sound.playSuccess();
      onComplete(selectedId);
    } else {
      sound.playError();
      setErrorMsg("Pattern mismatch. Each row and column must contain every shape and dot count.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '520px' }}>
      {/* 3x3 Matrix Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.8rem',
        background: 'rgba(18, 21, 34, 0.8)',
        border: '1px solid var(--border-bright)',
        padding: '1.2rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-glow-cyan)'
      }}>
        {grid.map((cell, idx) => (
          <div
            key={idx}
            style={{
              width: '80px',
              height: '80px',
              background: cell.shape === 'empty' ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-surface-elevated)',
              border: cell.shape === 'empty' ? '1px dashed #fbbf24' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {renderShapeGlyph(cell)}
          </div>
        ))}
      </div>

      {/* Candidate Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
          Select the Missing Glyph
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                style={{
                  background: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'var(--bg-surface-elevated)',
                  border: isSelected ? '2px solid var(--accent-violet-light)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? 'var(--shadow-glow-violet)' : 'none'
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: isSelected ? '#a78bfa' : 'var(--text-muted)',
                  width: '24px'
                }}>
                  {opt.id}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {renderShapeGlyph(opt, true)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {opt.label}
                </div>
              </div>
            );
          })}
        </div>
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
        disabled={!selectedId || disabled}
      >
        Confirm Selection
      </Button>
    </div>
  );
}

