import React, { useState } from 'react';
import { Sliders, Check, Activity } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function HarmonicDialsPuzzle({
  level,
  onComplete,
  disabled = false
}) {
  const [dials, setDials] = useState({ d1: 1, d2: 1, d3: 1 });
  const [errorMsg, setErrorMsg] = useState(null);

  const currentHz = 2 * dials.d1 + 3 * dials.d2 + 5 * dials.d3;
  const targetHz = 41;
  const isTargetMet = currentHz === targetHz;
  const hasDuplicates = dials.d1 === dials.d2 || dials.d2 === dials.d3 || dials.d1 === dials.d3;

  const handleChange = (dialKey, val) => {
    if (disabled) return;
    sound.playClick();
    setErrorMsg(null);
    setDials(prev => ({ ...prev, [dialKey]: parseInt(val, 10) }));
  };

  const handleSubmit = () => {
    if (disabled) return;
    const isValid = level.validate(dials);
    if (isValid) {
      sound.playSuccess();
      onComplete(dials);
    } else {
      sound.playError();
      if (hasDuplicates) {
        setErrorMsg("Constraint violation: All three dials must have DIFFERENT values (1 to 7).");
      } else {
        setErrorMsg(`Target frequency mismatch: Current is ${currentHz} Hz, required target is 41 Hz.`);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '520px' }}>
      {/* Frequency Resonator Monitor */}
      <div style={{
        background: 'rgba(18, 21, 34, 0.85)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.4rem',
        width: '100%',
        boxShadow: isTargetMet && !hasDuplicates ? '0 0 25px rgba(34, 211, 238, 0.4)' : 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="#22d3ee" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Harmonic Wave Sensor</span>
          </div>
          <div style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '4px',
            background: isTargetMet ? (hasDuplicates ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)') : 'rgba(255, 255, 255, 0.05)',
            color: isTargetMet ? (hasDuplicates ? '#fb7185' : '#34d399') : 'var(--text-muted)',
            fontWeight: 700
          }}>
            {isTargetMet ? (hasDuplicates ? 'DUPLICATES DETECTED' : 'FREQUENCY HARMONIZED') : 'ALIGNING PHASE...'}
          </div>
        </div>

        {/* Live Equation Readout */}
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          textAlign: 'center',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>
            2({dials.d1}) + 3({dials.d2}) + 5({dials.d3}) = <span style={{ color: isTargetMet ? '#22d3ee' : '#fbbf24' }}>{currentHz} Hz</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Target: 41 Hz • Values must be distinct integers from 1 to 7
          </div>
        </div>

        {/* Three Dial Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { id: 'd1', label: 'Dial 1 (2x Ratio)', val: dials.d1, color: '#06b6d4' },
            { id: 'd2', label: 'Dial 2 (3x Ratio)', val: dials.d2, color: '#8b5cf6' },
            { id: 'd3', label: 'Dial 3 (5x Ratio)', val: dials.d3, color: '#f59e0b' }
          ].map((dial) => (
            <div key={dial.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: dial.color, fontWeight: 600 }}>{dial.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>Val: {dial.val}</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={dial.val}
                onChange={(e) => handleChange(dial.id, e.target.value)}
                style={{ width: '100%', cursor: 'pointer', accentColor: dial.color }}
              />
            </div>
          ))}
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
        disabled={disabled}
      >
        Lock In Frequencies
      </Button>
    </div>
  );
}

