import React from 'react';
import { X, Volume2, VolumeX, Eye, Zap, Type, HelpCircle, Keyboard } from 'lucide-react';
import Button from './Button.jsx';
import { sound } from '../game/audio.js';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    sound.playClick();
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);

    if (key === 'soundEnabled') {
      sound.setMuted(!value);
    }
    if (key === 'volume') {
      sound.setVolume(value);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 6, 12, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #181c2e 0%, #10121d 100%)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-glow-cyan)',
        maxWidth: '520px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.8rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.4rem',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Facility Calibration
            </span>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>System Settings</h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            style={{ color: 'var(--text-muted)', padding: '0.4rem', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Audio Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-violet-light)', textTransform: 'uppercase' }}>
            Acoustic Synthesis
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)',
            padding: '0.7rem 1rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {settings.soundEnabled ? <Volume2 size={18} color="#22d3ee" /> : <VolumeX size={18} color="#f43f5e" />}
              <span style={{ fontSize: '0.9rem' }}>Master Procedural Audio</span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleChange('soundEnabled', e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            background: 'rgba(255,255,255,0.03)',
            padding: '0.7rem 1rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Volume Level</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-violet)' }}
            />
          </div>
        </div>

        {/* Visual & Accessibility */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
            Visual & Accessibility
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)',
            padding: '0.7rem 1rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Zap size={18} color="#fbbf24" />
              <div>
                <div style={{ fontSize: '0.9rem' }}>Reduced Motion</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Disable background pulses and float effects</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => handleChange('reducedMotion', e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)',
            padding: '0.7rem 1rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Eye size={18} color="#34d399" />
              <div>
                <div style={{ fontSize: '0.9rem' }}>High Contrast Mode</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sharper borders and ultra-crisp monochrome texts</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => handleChange('highContrast', e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
            />
          </div>
        </div>

        {/* Keyboard navigation quick guide */}
        <div style={{
          background: 'rgba(18, 21, 34, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
            <Keyboard size={16} color="var(--accent-cyan)" />
            <span>Keyboard Controls</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div><kbd style={{ background: '#262b42', padding: '2px 5px', borderRadius: '3px' }}>Enter</kbd> : Submit Answer</div>
            <div><kbd style={{ background: '#262b42', padding: '2px 5px', borderRadius: '3px' }}>Esc</kbd> : Pause / Resume</div>
            <div><kbd style={{ background: '#262b42', padding: '2px 5px', borderRadius: '3px' }}>H</kbd> : Toggle Hints</div>
            <div><kbd style={{ background: '#262b42', padding: '2px 5px', borderRadius: '3px' }}>R</kbd> : Reset Puzzle State</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button size="md" variant="cyan" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

