import React from 'react';
import { Crown, Check } from 'lucide-react';

export default function ProgressBar({
  currentLevelId = 1,
  completedLevels = {},
  totalLevels = 30,
  onSelectLevel
}) {
  const getLevelStatus = (lvlId) => {
    if (completedLevels[lvlId]) return 'completed';
    if (lvlId === currentLevelId) return 'current';
    return 'pending';
  };

  const getZoneColor = (lvlId) => {
    if (lvlId <= 10) return 'var(--accent-cyan)';
    if (lvlId <= 20) return 'var(--accent-violet)';
    return 'var(--accent-rose)';
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Zone 1: Discovery (1-10)</span>
          <span style={{ color: 'var(--accent-violet)', fontWeight: 600 }}>Zone 2: Thinking Lab (11-20)</span>
          <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>Zone 3: Impossible (21-30)</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {Object.keys(completedLevels).length} / {totalLevels} Cleared
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${totalLevels}, 1fr)`,
        gap: '3px',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.4)',
        padding: '5px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {Array.from({ length: totalLevels }, (_, idx) => {
          const lvl = idx + 1;
          const status = getLevelStatus(lvl);
          const isBoss = lvl === 10 || lvl === 20 || lvl === 30;
          const zoneColor = getZoneColor(lvl);

          let bg = 'rgba(255, 255, 255, 0.05)';
          let border = 'transparent';
          let glow = 'none';

          if (status === 'completed') {
            bg = zoneColor;
            glow = `0 0 6px ${zoneColor}`;
          } else if (status === 'current') {
            bg = '#ffffff';
            border = `2px solid ${zoneColor}`;
            glow = `0 0 10px #ffffff`;
          } else if (isBoss) {
            bg = 'rgba(245, 158, 11, 0.2)';
            border = '1px solid rgba(245, 158, 11, 0.5)';
          }

          return (
            <div
              key={lvl}
              onClick={() => onSelectLevel && onSelectLevel(lvl)}
              title={`Level ${lvl}${isBoss ? ' (BOSS)' : ''} - ${status}`}
              style={{
                height: isBoss ? '16px' : '10px',
                borderRadius: '2px',
                background: bg,
                border: border,
                boxShadow: glow,
                cursor: onSelectLevel ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)',
                position: 'relative'
              }}
            >
              {isBoss && (
                <Crown
                  size={10}
                  color={status === 'completed' ? '#000000' : '#fbbf24'}
                  style={{ strokeWidth: 3 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

