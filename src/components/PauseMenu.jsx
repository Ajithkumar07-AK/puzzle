import React, { useState } from 'react';
import { Play, RotateCcw, AlertOctagon, Map, Volume2, VolumeX, Sliders, Home } from 'lucide-react';
import Button from './Button.jsx';
import { sound } from '../game/audio.js';

export default function PauseMenu({
  isOpen,
  onResume,
  onRestartLevel,
  onResetCampaign,
  onOpenMap,
  onOpenSettings,
  onExitHome,
  soundMuted,
  onToggleSound
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 6, 12, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 998,
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #181c2e 0%, #10121d 100%)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-glow-violet)',
        maxWidth: '440px',
        width: '100%',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        textAlign: 'center'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            Session Suspended
          </span>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginTop: '0.2rem' }}>
            PAUSE PROTOCOL
          </h2>
        </div>

        {!showResetConfirm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <Button
              size="lg"
              variant="cyan"
              icon={Play}
              onClick={onResume}
            >
              Resume Challenge
            </Button>

            <Button
              size="md"
              variant="secondary"
              icon={RotateCcw}
              onClick={onRestartLevel}
            >
              Restart Chamber
            </Button>

            <Button
              size="md"
              variant="secondary"
              icon={Map}
              onClick={onOpenMap}
            >
              Campaign Map
            </Button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Button
                size="sm"
                variant="secondary"
                icon={soundMuted ? VolumeX : Volume2}
                onClick={onToggleSound}
              >
                {soundMuted ? 'Muted' : 'Sound On'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={Sliders}
                onClick={onOpenSettings}
              >
                Settings
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              icon={AlertOctagon}
              onClick={() => setShowResetConfirm(true)}
              style={{ color: '#fb7185', marginTop: '0.4rem' }}
            >
              Restart Entire Campaign
            </Button>

            <Button
              size="sm"
              variant="ghost"
              icon={Home}
              onClick={onExitHome}
            >
              Main Menu
            </Button>
          </div>
        ) : (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            <h3 style={{ color: '#fb7185', fontSize: '1.1rem' }}>Confirm Campaign Reset?</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              This will erase all 30-level progress, campaign timer, and accumulated score. Saved achievements will remain intact.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetCampaign();
                }}
              >
                Yes, Reset Campaign
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

