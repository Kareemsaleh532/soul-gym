import React from 'react';
import { DumbbellIcon } from './Icons';

const EmptyState = ({ title = "لا توجد بيانات حالياً", description = "المساحة فارغة، أضف بيانات جديدة لتظهر هنا.", onAction, actionLabel = "+ إضافة جديد" }) => {
  return (
    <div className="ui-panel animate-up" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 2rem',
      width: '100%'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(255,71,26,0.15) 0%, rgba(255,71,26,0.05) 100%)',
        border: '1px solid rgba(255,71,26,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--accent-primary)',
        marginBottom: '1.5rem'
      }}>
        <DumbbellIcon size={36} />
      </div>

      <h3 className="title-md" style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p className="subtitle" style={{ maxWidth: '380px', marginBottom: '1.5rem' }}>{description}</p>

      {onAction && (
        <button className="btn-accent" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
