import React, { useState } from 'react';

const MemberCard = ({ member, onEdit, onDelete, language = 'ar' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const calculateDaysLeft = (subscriptionEnd) => {
    const end = new Date(subscriptionEnd);
    const now = new Date();
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(member.subscription_end);
  const isActive = daysLeft > 0;
  const isExpiringSoon = isActive && daysLeft <= 10;

  const getStatusBadge = () => {
    if (!isActive) {
      return { text: language === 'ar' ? 'منتهي' : 'Expired', className: 'status-expired' };
    }
    if (isExpiringSoon) {
      return { text: language === 'ar' ? `ينتهي خلال ${daysLeft} أيام` : `Expires in ${daysLeft}d`, className: 'status-warning' };
    }
    return { text: language === 'ar' ? 'نشط' : 'Active', className: 'status-active' };
  };

  const status = getStatusBadge();

  return (
    <div 
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src={member.avatar || `https://i.pravatar.cc/150?u=${member.phone || member.name}`} 
            alt={member.name} 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '1px solid var(--border-subtle)'
            }}
          />
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              {member.name}
            </h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {member.phone || (language === 'ar' ? 'بدون هاتف' : 'No Phone')}
            </span>
          </div>
        </div>
        <span className={`status-badge ${status.className}`}>
          {status.text}
        </span>
      </div>

      {/* Subscription Details */}
      <div style={{
        background: 'var(--bg-primary)',
        padding: '0.875rem 1rem',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
            {language === 'ar' ? 'نوع الاشتراك' : 'Plan'}
          </span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {member.plan_type || 'Pro Membership'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
            {language === 'ar' ? 'ينتهي في' : 'Expires'}
          </span>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {new Date(member.subscription_end).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
        <button 
          onClick={() => onEdit(member)} 
          className="btn-secondary" 
          style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
        >
          {/* Edit SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          {language === 'ar' ? 'تعديل' : 'Edit'}
        </button>
        <button 
          onClick={() => onDelete(member.id)} 
          className="btn-icon" 
          style={{ color: '#ff471a', background: 'rgba(255, 71, 26, 0.1)', borderColor: 'rgba(255, 71, 26, 0.2)' }}
          title={language === 'ar' ? 'حذف' : 'Delete'}
        >
          {/* Trash SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
