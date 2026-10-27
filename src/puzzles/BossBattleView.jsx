import React, { useState } from 'react';
import { Skull, Shield, CheckCircle2, ChevronRight, AlertTriangle, Sparkles, Crown } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function BossBattleView({
  level,
  onComplete,
  disabled = false
}) {
  const { bossPhases = [] } = level;
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0); // 0, 1, 2
  const [phaseAnswers, setPhaseAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const phaseData = bossPhases[currentPhaseIndex] || {};

  const handleNextPhase = () => {
    // Validate current phase
    const ans = selectedOption !== null ? selectedOption : currentInput;
    if (!ans) {
      setErrorMsg("Please provide an answer before locking in.");
      return;
    }

    const expected = phaseData.expected;
    const isPhaseValid = String(ans).trim().toUpperCase() === String(expected).trim().toUpperCase();

    if (!isPhaseValid) {
      sound.playError();
      setErrorMsg(`Incorrect response for ${phaseData.title}. Review the guardian's condition.`);
      return;
    }

    sound.playBossPhase();
    setErrorMsg(null);
    const updatedAnswers = { ...phaseAnswers, [`phase${currentPhaseIndex + 1}`]: ans };
    setPhaseAnswers(updatedAnswers);

    if (currentPhaseIndex < bossPhases.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPhaseIndex(prev => prev + 1);
        setCurrentInput('');
        setSelectedOption(null);
        setIsTransitioning(false);
      }, 600);
    } else {
      // All 3 phases cleared!
      sound.playBossVictory();
      onComplete(updatedAnswers);
    }
  };

  const getBossTheme = () => {
    if (level.id === 10) {
      return {
        title: "THE PATTERN KEEPER",
        tagline: "Guardian of Sequences and Invariants",
        accent: "#06b6d4",
        glow: "rgba(6, 182, 212, 0.4)"
      };
    }
    if (level.id === 20) {
      return {
        title: "THE REALITY BREAKER",
        tagline: "Subverter of Unchecked Assumptions",
        accent: "#8b5cf6",
        glow: "rgba(139, 92, 246, 0.4)"
      };
    }
    return {
      title: "THE ARCHITECT OF THOUGHT",
      tagline: "The Core Cognitive Super-Intelligence",
      accent: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.4)"
    };
  };

  const theme = getBossTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '640px' }}>
      {/* Boss Identity Arena Card */}
      <div style={{
        background: 'linear-gradient(180deg, #181428 0%, #0d0e19 100%)',
        border: `1px solid ${theme.accent}`,
        boxShadow: `0 0 30px ${theme.glow}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.4rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Boss Header Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${theme.accent}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 16px ${theme.glow}`
            }}>
              <Crown size={24} color={theme.accent} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                Apex Guardian Encounter
              </span>
              <h2 style={{ fontSize: '1.4rem', color: '#ffffff', letterSpacing: '0.02em' }}>
                {theme.title}
              </h2>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            {theme.tagline}
          </div>
        </div>

        {/* 3-Phase Stepper Tracker */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '0.6rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {bossPhases.map((phase, idx) => {
            const isCompleted = idx < currentPhaseIndex;
            const isCurrent = idx === currentPhaseIndex;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isCurrent ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: isCurrent ? `1px solid ${theme.accent}` : '1px solid transparent'
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} color="#34d399" />
                ) : (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isCurrent ? theme.accent : 'rgba(255, 255, 255, 0.1)',
                    color: isCurrent ? '#000000' : 'var(--text-dim)',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {idx + 1}
                  </div>
                )}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? '#ffffff' : isCompleted ? '#34d399' : 'var(--text-muted)'
                }}>
                  Phase {idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current Active Phase Challenge Box */}
        <div style={{
          background: 'rgba(18, 21, 34, 0.75)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          opacity: isTransitioning ? 0.3 : 1,
          transition: 'opacity 300ms ease'
        }}>
          <div style={{
            fontSize: '0.85rem',
            color: theme.accent,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            {phaseData.title}
          </div>

          <div style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: '1.5' }}>
            {phaseData.prompt}
          </div>

          {/* If phase has multiple choice options */}
          {phaseData.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {phaseData.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      sound.playSelect();
                      setSelectedOption(opt.id);
                      setErrorMsg(null);
                    }}
                    style={{
                      background: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'var(--bg-surface-elevated)',
                      border: isSelected ? `2px solid ${theme.accent}` : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isSelected ? theme.accent : 'rgba(255,255,255,0.05)',
                      color: isSelected ? '#000000' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {opt.id}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: isSelected ? '#ffffff' : 'var(--text-secondary)' }}>
                      {opt.label || opt.text}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* If phase has numeric input */}
          {phaseData.inputType === 'number' && (
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <input
                type="text"
                value={currentInput}
                onChange={(e) => {
                  setCurrentInput(e.target.value);
                  setErrorMsg(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNextPhase();
                }}
                placeholder="Enter computed value"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.7rem 1rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  outline: 'none',
                  flex: 1
                }}
              />
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <div style={{ color: '#fb7185', fontSize: '0.85rem', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {/* Advance button */}
      <Button
        size="lg"
        variant="amber"
        icon={currentPhaseIndex === bossPhases.length - 1 ? Sparkles : ChevronRight}
        onClick={handleNextPhase}
        disabled={disabled || isTransitioning}
      >
        {currentPhaseIndex === bossPhases.length - 1 ? "Disengage Final Guardian Core" : `Submit Phase ${currentPhaseIndex + 1}`}
      </Button>
    </div>
  );
}

