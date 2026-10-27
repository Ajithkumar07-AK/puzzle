import React, { useState } from 'react';
import { Power, Check, Zap } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function CircuitSwitchesPuzzle({
  level,
  onComplete,
  disabled = false
}) {
  const [switches, setSwitches] = useState({
    A: 0,
    B: 0,
    C: 0
  });
  const [errorMsg, setErrorMsg] = useState(null);

  const toggleSwitch = (key) => {
    if (disabled) return;
    if (key === 'A') {
      sound.playError();
      return; // Locked
    }
    sound.playSelect();
    setErrorMsg(null);
    setSwitches(prev => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1
    }));
  };

  // Evaluate gates
  const gate1 = switches.A & switches.B; // A AND B
  const gate2 = switches.B ^ switches.C; // B XOR C
  const coreOutput = gate1 | gate2; // OR

  const handleSubmit = () => {
    if (disabled) return;
    const isValid = level.validate(switches);
    if (isValid) {
      sound.playSuccess();
      onComplete(switches);
    } else {
      sound.playError();
      setErrorMsg("Core remains unpowered (Output = 0). Check the XOR condition on Gate 2.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '520px' }}>
      {/* Circuit Schematic Card */}
      <div style={{
        background: 'rgba(18, 21, 34, 0.85)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        width: '100%',
        boxShadow: coreOutput ? '0 0 25px rgba(16, 185, 129, 0.25)' : 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Logic Gate Array Circuit
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: coreOutput ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
            border: `1px solid ${coreOutput ? '#34d399' : '#f43f5e'}`,
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: coreOutput ? '#34d399' : '#fb7185'
          }}>
            <Zap size={14} />
            <span>CORE: {coreOutput ? 'POWERED (1)' : 'OFFLINE (0)'}</span>
          </div>
        </div>

        {/* Switches Column */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
          {[
            { id: 'A', label: 'Switch A', locked: true, val: switches.A },
            { id: 'B', label: 'Switch B', locked: false, val: switches.B },
            { id: 'C', label: 'Switch C', locked: false, val: switches.C }
          ].map((sw) => (
            <div
              key={sw.id}
              onClick={() => toggleSwitch(sw.id)}
              style={{
                background: sw.val ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-surface-elevated)',
                border: sw.val ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.8rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: sw.locked ? 'not-allowed' : 'pointer',
                opacity: sw.locked ? 0.6 : 1,
                boxShadow: sw.val ? '0 0 12px rgba(6, 182, 212, 0.3)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Power size={20} color={sw.val ? '#22d3ee' : 'var(--text-muted)'} />
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{sw.label}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 700,
                color: sw.val ? '#22d3ee' : '#94a3b8'
              }}>
                {sw.val ? '1 [ON]' : '0 [OFF]'}
              </div>
              {sw.locked && (
                <span style={{ fontSize: '0.65rem', color: '#f43f5e', textTransform: 'uppercase' }}>
                  Locked
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Intermediate Gate Status */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
          background: 'rgba(0,0,0,0.3)',
          padding: '0.8rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Gate 1 (A AND B): </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: gate1 ? '#34d399' : '#94a3b8' }}>
              {gate1}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Gate 2 (B XOR C): </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: gate2 ? '#34d399' : '#94a3b8' }}>
              {gate2}
            </span>
          </div>
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
        disabled={coreOutput === 0 || disabled}
      >
        Lock In Circuit State
      </Button>
    </div>
  );
}

