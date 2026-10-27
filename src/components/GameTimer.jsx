import React from 'react';
import { Timer, Clock, Flame } from 'lucide-react';

export default function GameTimer({
  campaignSecondsRemaining,
  levelSecondsElapsed,
  targetLevelSeconds,
  isPaused = false,
  isPractice = false
}) {
  const formatTime = (secs) => {
    const s = Math.max(0, Math.floor(secs));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const isLowCampaignTime = campaignSecondsRemaining <= 300; // Under 5 min
  const isOverTarget = levelSecondsElapsed > targetLevelSeconds;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: 'rgba(18, 21, 34, 0.8)',
      padding: '0.4rem 0.9rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(8px)'
    }}>
      {/* Campaign Timer */}
      {!isPractice && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock
            size={16}
            color={isLowCampaignTime ? '#f43f5e' : '#22d3ee'}
            className={isLowCampaignTime ? 'animate-pulse-glow' : ''}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Campaign
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: isLowCampaignTime ? '#f43f5e' : '#f8fafc'
            }}>
              {formatTime(campaignSecondsRemaining)}
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      {!isPractice && (
        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
      )}

      {/* Level Timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Timer
          size={16}
          color={isOverTarget ? '#f59e0b' : '#a78bfa'}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Level Time
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: isOverTarget ? '#fbbf24' : '#cbd5e1'
          }}>
            {formatTime(levelSecondsElapsed)}
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: '3px' }}>
              / {formatTime(targetLevelSeconds)}
            </span>
          </span>
        </div>
      </div>

      {isPaused && (
        <span style={{
          fontSize: '0.7rem',
          background: 'rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          Paused
        </span>
      )}
    </div>
  );
}

