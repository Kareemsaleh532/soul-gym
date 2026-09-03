import React from 'react';
import { EditIcon, TrashIcon } from '../common/Icons';

const MemberCard = ({ member, onEdit, onDelete, viewMode = 'grid', language = 'ar' }) => {
  const calculateDaysLeft = (subscriptionEnd) => {
    const end = new Date(subscriptionEnd);
    const now = new Date();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(member.subscription_end);
  const isActive = daysLeft > 0;
  const isExpiringSoon = isActive && daysLeft <= 10;

  const getStatusBadge = () => {
    if (!isActive) return { text: language === 'ar' ? 'منتهي' : 'Expired', className: 'badge-expired' };
    if (isExpiringSoon) return { text: language === 'ar' ? `ينتهي خلال ${daysLeft} أيام` : `Expires in ${daysLeft}d`, className: 'badge-warning' };
    return { text: language === 'ar' ? 'نشط' : 'Active', className: 'badge-active' };
  };

  const status = getStatusBadge();

  if (viewMode === 'table') {
    return (
      <div className="ui-panel animate-up" style={{
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-md)',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
          <img 
            src={member.avatar || `https://i.pravatar.cc/150?u=${member.phone || member.name}`} 
            alt={member.name} 
            style={{ width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{member.name}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{member.phone || 'بدون هاتف'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{member.plan_type || 'Pro Membership'}</span>
          <span className={`badge ${status.className}`}>{status.text}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-circle" style={{ width: '34px', height: '34px' }} onClick={() => onEdit(member)}>
              <EditIcon size={14} />
            </button>
            <button className="btn-circle" style={{ width: '34px', height: '34px', color: '#ff1744' }} onClick={() => onDelete(member.id)}>
              <TrashIcon size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ui-panel animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img 
            src={member.avatar || `https://i.pravatar.cc/150?u=${member.phone || member.name}`} 
            alt={member.name} 
            style={{ width: '48px', height: '48px', borderRadius: '16px', objectFit: 'cover' }}
          />
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{member.name}</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{member.phone || 'بدون هاتف'}</span>
          </div>
        </div>
        <span className={`badge ${status.className}`}>{status.text}</span>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem'
      }}>
        <div>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block' }}>نوع الاشتراك</span>
          <span style={{ fontWeight: '600' }}>{member.plan_type || 'Pro Membership'}</span>
        </div>
        <div style={{ textAlign: 'left' }}>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'block' }}>تاريخ الانتهاء</span>
          <span style={{ fontWeight: '600' }}>
            {new Date(member.subscription_end).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
        <button className="btn-subtle" style={{ flex: 1, padding: '0.5rem' }} onClick={() => onEdit(member)}>
          <EditIcon />
          <span>تعديل</span>
        </button>
        <button className="btn-circle" style={{ color: '#ff1744', borderColor: 'rgba(255, 23, 68, 0.2)' }} onClick={() => onDelete(member.id)}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
