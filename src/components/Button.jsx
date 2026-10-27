import React from 'react';
import { sound } from '../game/audio.js';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  ...props
}) {
  const handleClick = (e) => {
    if (disabled) return;
    sound.playClick();
    if (onClick) onClick(e);
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    position: 'relative',
    overflow: 'hidden'
  };

  const sizeStyles = {
    sm: { padding: '0.35rem 0.75rem', fontSize: '0.8rem' },
    md: { padding: '0.65rem 1.25rem', fontSize: '0.9rem' },
    lg: { padding: '0.9rem 1.75rem', fontSize: '1.05rem' },
    xl: { padding: '1.1rem 2.25rem', fontSize: '1.2rem' }
  };

  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      color: '#ffffff',
      border: '1px solid rgba(167, 139, 250, 0.4)',
      boxShadow: disabled ? 'none' : '0 0 16px rgba(139, 92, 246, 0.35)'
    },
    cyan: {
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: '#ffffff',
      border: '1px solid rgba(34, 211, 238, 0.4)',
      boxShadow: disabled ? 'none' : '0 0 16px rgba(6, 182, 212, 0.35)'
    },
    amber: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#ffffff',
      border: '1px solid rgba(251, 191, 36, 0.4)',
      boxShadow: disabled ? 'none' : '0 0 16px rgba(245, 158, 11, 0.35)'
    },
    secondary: {
      background: 'var(--bg-surface-elevated)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-sm)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#ffffff',
      border: '1px solid rgba(248, 113, 113, 0.4)'
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant]
      }}
      className={`custom-btn ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
}

