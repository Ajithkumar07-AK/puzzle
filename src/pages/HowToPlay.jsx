import React, { useState } from 'react';
import { ArrowLeft, Lightbulb, Clock, Trophy, MousePointer, ShieldCheck, Check, Zap } from 'lucide-react';
import Button from '../components/Button.jsx';
import { sound } from '../game/audio.js';

export default function HowToPlay({ onBack, onStartGame }) {
  // Mini tutorial interactive puzzle: 2 toggle switches feeding an XOR gate
  const [swA, setSwA] = useState(0);
  const [swB, setSwB] = useState(0);
  const [tutorialSolved, setTutorialSolved] = useState(false);

  const xorOutput = swA ^ swB;

  const handleToggle = (which) => {
    sound.playSelect();
    if (which === 'A') setSwA(prev => prev === 1 ? 0 : 1);
    if (which === 'B') setSwB(prev => prev === 1 ? 0 : 1);

    const nextOutput = (which === 'A' ? (swA === 1 ? 0 : 1) : swA) ^ (which === 'B' ? (swB === 1 ? 0 : 1) : swB);
    if (nextOutput === 1) {
      sound.playSuccess();
      setTutorialSolved(true);
    } else {
      setTutorialSolved(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem 1.5rem',
      maxWidth: '860px',
      margin: '0 auto',
      width: '100%',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Navigation header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
        <Button size="sm" variant="ghost" icon={ArrowLeft} onClick={onBack}>
          Back to Terminal
        </Button>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          Facility Orientation Guide
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff' }}>HOW TO PLAY</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            Mastering the protocols of unconventional thinking and cognitive evaluation.
          </p>
        </div>

        {/* 1. Interactive Demo Card */}
        <div style={{
          background: 'rgba(24, 28, 46, 0.75)',
          border: '1px solid var(--border-bright)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: tutorialSolved ? '0 0 25px rgba(16, 185, 129, 0.3)' : 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MousePointer size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Interactive Training Chamber</h3>
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              background: tutorialSolved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: tutorialSolved ? '#34d399' : '#fbbf24'
            }}>
              {tutorialSolved ? 'POWER RESTORED' : 'GOAL: OUTPUT = 1'}
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Every chamber is an active sandbox. In this training test, configure the two switches so the XOR circuit powers the lamp (inputs must differ: 1 and 0).
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button
              size="md"
              variant={swA === 1 ? 'cyan' : 'secondary'}
              onClick={() => handleToggle('A')}
            >
              Switch A: [{swA}]
            </Button>
            <Button
              size="md"
              variant={swB === 1 ? 'cyan' : 'secondary'}
              onClick={() => handleToggle('B')}
            >
              Switch B: [{swB}]
            </Button>
          </div>

          <div style={{
            background: 'var(--bg-primary)',
            padding: '0.8rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem'
          }}>
            Circuit: {swA} XOR {swB} = <span style={{ color: xorOutput ? '#34d399' : '#fb7185', fontWeight: 700 }}>{xorOutput}</span>
            {tutorialSolved && <span style={{ color: '#34d399', marginLeft: '0.5rem' }}>✓ System Calibrated!</span>}
          </div>
        </div>

        {/* 2. Core Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {/* Thinking Outside the Box */}
          <div style={{
            background: 'rgba(18, 21, 34, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-violet-light)' }}>
              <Zap size={18} />
              <h4 style={{ fontSize: '0.95rem' }}>Transcend Framing</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Whenever a boundary appears rigid (such as the 3×3 dot perimeter in Level 5 or the prompt wording in Level 20), do not hesitate to extend strokes beyond the visible edges or read instructions literally.
            </p>
          </div>

          {/* Timers & Campaign Duration */}
          <div style={{
            background: 'rgba(18, 21, 34, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
              <Clock size={18} />
              <h4 style={{ fontSize: '0.95rem' }}>45-Minute Campaign</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              The campaign timer starts at 45:00. Pausing freezes the clock completely. You can take your time to reason without fear of sudden wipeouts; reaching zero triggers a graceful evaluation.
            </p>
          </div>

          {/* Scoring & Hints */}
          <div style={{
            background: 'rgba(18, 21, 34, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
              <Lightbulb size={18} />
              <h4 style={{ fontSize: '0.95rem' }}>Two-Step Hints</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Every level offers 2 contextual hints. Hint 1 provides a perspective shift (-35 pts). Hint 2 provides deep structural guidance (-65 pts). Completing chambers without hints maximizes score and unlocks elite ranks.
            </p>
          </div>
        </div>

        {/* Start CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Button size="xl" variant="cyan" onClick={onStartGame}>
            Begin Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}

