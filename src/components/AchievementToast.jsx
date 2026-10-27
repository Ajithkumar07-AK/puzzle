import React, { useEffect } from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { sound } from '../game/audio.js';

export default function AchievementToast({ achievement, onClose }) {
  useEffect(() => {
    if (achievement) {
      sound.playAchievement();
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 1000,
      background: 'linear-gradient(135deg, #181c2e 0%, #221d3b 100%)',
      border: '1px solid rgba(245, 158, 11, 0.5)',
      boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)',
      borderRadius: 'var(--radius-lg)',
      padding: '0.9rem 1.2rem',
      maxWidth: '360px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      animation: 'floatElement 3s ease-in-out infinite'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.2)',
        border: '1px solid #fbbf24',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Award size={22} color="#fbbf24" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Achievement Unlocked!
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {achievement.title}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.2', marginTop: '2px' }}>
          {achievement.desc}
        </div>
      </div>

      <button
        onClick={onClose}
        style={{ color: 'var(--text-muted)', padding: '2px', cursor: 'pointer' }}
        title="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

