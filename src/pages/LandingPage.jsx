import React from 'react';
import { Play, BookOpen, Compass, Award, Trophy, Volume2, VolumeX, Sliders, Map, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';
import { getRankFromScore } from '../game/scoring.js';

export default function LandingPage({
  campaignState,
  onStartCampaign,
  onStartPractice,
  onOpenHowToPlay,
  onOpenMap,
  onOpenSettings,
  soundMuted,
  onToggleSound
}) {
  const completedCount = Object.keys(campaignState.completedLevels || {}).length;
  const currentRank = getRankFromScore(campaignState.totalScore || 0);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem 1.5rem',
      position: 'relative',
      zIndex: 1,
      maxWidth: '1000px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Top Bar with shortcuts */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        gap: '0.6rem'
      }}>
        <Button size="sm" variant="secondary" icon={soundMuted ? VolumeX : Volume2} onClick={onToggleSound}>
          {soundMuted ? 'Muted' : 'Sound'}
        </Button>
        <Button size="sm" variant="secondary" icon={Sliders} onClick={onOpenSettings}>
          Settings
        </Button>
      </div>

      {/* Hero Brand Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.2rem',
        marginTop: '2rem',
        marginBottom: '2.5rem'
      }}>
        {/* Facility Classification Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--accent-violet-light)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <Sparkles size={14} color="#a78bfa" />
          <span>Cognitive Laboratory Testing Protocol</span>
        </div>

        {/* Big Animated Title */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: '1.05',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 40px rgba(139, 92, 246, 0.35)',
          maxWidth: '850px'
        }}>
          OUT OF THE BOX
        </h1>

        {/* Primary & Supporting Taglines */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
          fontWeight: 500,
          color: 'var(--accent-cyan-light)',
          fontStyle: 'italic',
          letterSpacing: '0.02em'
        }}>
          "The answer is not always where you are looking."
        </p>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          maxWidth: '560px',
          lineHeight: '1.5'
        }}>
          30 challenges. 45 minutes. One extraordinary mind.<br />
          Mathematical reasoning, spatial deduction, lateral leaps, and three multi-phase guardians.
        </p>
      </div>

      {/* Main Action Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '3rem'
      }}>
        <Button
          size="xl"
          variant="cyan"
          icon={Play}
          onClick={onStartCampaign}
          style={{ minWidth: '220px' }}
        >
          {completedCount > 0 ? "Resume Campaign" : "Enter Facility"}
        </Button>

        <Button
          size="xl"
          variant="secondary"
          icon={Compass}
          onClick={onStartPractice}
        >
          Practice Mode
        </Button>

        <Button
          size="xl"
          variant="secondary"
          icon={BookOpen}
          onClick={onOpenHowToPlay}
        >
          How to Play
        </Button>

        <Button
          size="xl"
          variant="secondary"
          icon={Map}
          onClick={onOpenMap}
        >
          Campaign Map
        </Button>
      </div>

      {/* Campaign Statistics / Dossier Bar */}
      <div style={{
        background: 'rgba(24, 28, 46, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.2rem 2rem',
        width: '100%',
        maxWidth: '780px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1.2rem',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Progress
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              {completedCount}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 30 Chambers</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cognitive Yield
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan-light)' }}>
            {(campaignState.totalScore || 0).toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>pts</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cognitive Classification
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{currentRank.badge}</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fbbf24' }}>
              {currentRank.title}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Zones Overview Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        width: '100%',
        maxWidth: '920px'
      }}>
        <div style={{
          background: 'rgba(18, 21, 34, 0.6)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
            Zone 1: Discovery (Lv 1–10)
          </div>
          <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
            Foundations & Lateral Leaps
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Nine introductory chambers culminating in BOSS 1: The Pattern Keeper.
          </div>
        </div>

        <div style={{
          background: 'rgba(18, 21, 34, 0.6)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-violet-light)', fontWeight: 700, textTransform: 'uppercase' }}>
            Zone 2: Thinking Lab (Lv 11–20)
          </div>
          <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
            Constraints & Subverted Rules
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Multi-step deduction culminating in BOSS 2: The Reality Breaker.
          </div>
        </div>

        <div style={{
          background: 'rgba(18, 21, 34, 0.6)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose-light)', fontWeight: 700, textTransform: 'uppercase' }}>
            Zone 3: Impossible Room (Lv 21–30)
          </div>
          <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
            Synthesis & Meta-Paradoxes
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Transcendent challenges culminating in BOSS 3: The Architect of Thought.
          </div>
        </div>
      </div>
    </div>
  );
}

