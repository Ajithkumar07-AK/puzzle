import React from 'react';
import { ArrowLeft, Lock, Check, Crown, Play, Sparkles, Award } from 'lucide-react';
import Button from '../components/Button.jsx';
import { LEVELS } from '../data/levels.js';
import { sound } from '../game/audio.js';

export default function CampaignMap({
  campaignState,
  onSelectLevel,
  onBack
}) {
  const { completedLevels = {}, unlockedLevelMax = 0, currentLevelIndex = 0 } = campaignState;

  const zones = [
    {
      id: 1,
      title: "ZONE 1: DISCOVERY",
      range: [1, 10],
      accent: "var(--accent-cyan)",
      boss: "BOSS 10: The Pattern Keeper"
    },
    {
      id: 2,
      title: "ZONE 2: THE THINKING LAB",
      range: [11, 20],
      accent: "var(--accent-violet)",
      boss: "BOSS 20: The Reality Breaker"
    },
    {
      id: 3,
      title: "ZONE 3: THE IMPOSSIBLE ROOM",
      range: [21, 30],
      accent: "var(--accent-rose)",
      boss: "BOSS 30: The Architect of Thought"
    }
  ];

  const handleLevelClick = (lvlId) => {
    const isUnlocked = (lvlId - 1) <= Math.max(unlockedLevelMax, Object.keys(completedLevels).length);
    if (!isUnlocked) {
      sound.playError();
      return;
    }
    sound.playClick();
    onSelectLevel(lvlId);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem 1.5rem',
      maxWidth: '1080px',
      margin: '0 auto',
      width: '100%',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
        <Button size="sm" variant="ghost" icon={ArrowLeft} onClick={onBack}>
          Back
        </Button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          Facility Spatial Cartography
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff' }}>CAMPAIGN MAP</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            All 30 cognitive chambers across the three facility zones. Select any unlocked node to enter.
          </p>
        </div>

        {/* Zones Container */}
        {zones.map((zone) => {
          const zoneLevels = LEVELS.filter(l => l.id >= zone.range[0] && l.id <= zone.range[1]);

          return (
            <div
              key={zone.id}
              style={{
                background: 'rgba(24, 28, 46, 0.75)',
                border: '1px solid var(--border-bright)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {/* Zone Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: zone.accent, letterSpacing: '0.04em' }}>
                    {zone.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Chambers {zone.range[0]} through {zone.range[1]}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  {zone.boss}
                </div>
              </div>

              {/* Level Node Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                gap: '0.8rem'
              }}>
                {zoneLevels.map((lvl) => {
                  const isCompleted = !!completedLevels[lvl.id];
                  const isCurrent = (lvl.id - 1) === currentLevelIndex;
                  const isUnlocked = (lvl.id - 1) <= Math.max(unlockedLevelMax, Object.keys(completedLevels).length);
                  const isBoss = lvl.isBoss;

                  return (
                    <div
                      key={lvl.id}
                      onClick={() => handleLevelClick(lvl.id)}
                      style={{
                        background: isCompleted
                          ? 'rgba(16, 185, 129, 0.12)'
                          : isCurrent
                          ? 'rgba(139, 92, 246, 0.25)'
                          : isUnlocked
                          ? 'var(--bg-surface-elevated)'
                          : 'rgba(0,0,0,0.4)',
                        border: isCurrent
                          ? '2px solid var(--accent-cyan)'
                          : isCompleted
                          ? '1px solid #10b981'
                          : isBoss
                          ? '1px solid #fbbf24'
                          : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.8rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        opacity: isUnlocked ? 1 : 0.45,
                        boxShadow: isCurrent ? 'var(--shadow-glow-cyan)' : 'none',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {/* Icon */}
                      {isBoss ? (
                        <Crown size={18} color="#fbbf24" />
                      ) : isCompleted ? (
                        <Check size={18} color="#34d399" />
                      ) : !isUnlocked ? (
                        <Lock size={16} color="var(--text-dim)" />
                      ) : (
                        <Play size={16} color="var(--accent-violet-light)" />
                      )}

                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: isCompleted ? '#34d399' : isCurrent ? '#22d3ee' : '#f8fafc'
                      }}>
                        {lvl.id}
                      </span>

                      <span style={{
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '80px'
                      }}>
                        {lvl.isBoss ? 'BOSS' : lvl.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

