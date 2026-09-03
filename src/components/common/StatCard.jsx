import React from 'react';

const StatCard = ({ label, value, color, active, onClick }) => {
  return (
    <div 
      className="ui-panel" 
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderColor: active ? (color || 'var(--accent-primary)') : 'var(--glass-border)',
        boxShadow: active ? `0 8px 25px ${color ? color + '33' : 'var(--accent-glow)'}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>
        {label}
      </span>
      <h3 style={{ fontSize: '2.25rem', fontWeight: '800', color: color || 'var(--text-main)' }}>
        {value}
      </h3>
    </div>
  );
};

export default StatCard;
