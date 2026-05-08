import React from 'react';
import { format, differenceInDays, isAfter, parseISO } from 'date-fns';
import { Phone, Clock, User, Timer, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MemberCard = ({ member, onEdit, onDelete }) => {
  const endDate = typeof member.subscription_end === 'string' ? parseISO(member.subscription_end) : member.subscription_end;
  const startDate = member.subscription_start ? (typeof member.subscription_start === 'string' ? parseISO(member.subscription_start) : member.subscription_start) : null;
  const daysLeft = differenceInDays(endDate, new Date());
  const totalDays = startDate ? differenceInDays(endDate, startDate) : 0;
  const isActive = isAfter(endDate, new Date());
  
  let status = 'active';
  if (!isActive) status = 'expired';
  else if (daysLeft <= 10) status = 'warning';

  const getStatusLabel = () => {
    if (status === 'active') return 'Subscribed';
    if (status === 'warning') return 'Expiring Soon';
    return 'Subscription Ended';
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="glass-card member-card"
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => onEdit(member)}
    >
      {/* Action Buttons Overlay */}
      <div className="card-actions" style={{ 
        position: 'absolute', 
        top: '12px', 
        right: '12px', 
        display: 'flex', 
        gap: '8px',
        zIndex: 5
      }}>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(member); }}
          style={{ 
            background: 'var(--glass)', 
            border: '1px solid var(--glass-border)', 
            color: 'var(--text-dim)',
            padding: '6px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
        >
          <Edit2 size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(member.id); }}
          style={{ 
            background: 'var(--glass)', 
            border: '1px solid var(--glass-border)', 
            color: 'var(--text-dim)',
            padding: '6px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--status-expired)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Progress Background Overlay */}
      {isActive && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '4px',
          background: status === 'warning' ? 'var(--status-warning)' : 'var(--status-active)',
          width: `${Math.min(100, (daysLeft / 30) * 100)}%`,
          opacity: 0.5,
          transition: 'width 1s ease-in-out'
        }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <img src={member.avatar} alt={member.name} style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', border: '2px solid var(--glass-border)' }} />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{member.name}</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{member.plan_type || member.plan}</p>
          </div>
        </div>
        <span className={`status-badge status-${status}`} style={{ margin: '0 40px 0 0' }}>
          {getStatusLabel()}
        </span>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          <Phone size={16} />
          <span>{member.phone}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            <Clock size={16} />
            <span>Ends: {format(endDate, 'MMM dd, yyyy')}</span>
          </div>
          
          {isActive && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '2px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                color: status === 'warning' ? 'var(--status-warning)' : 'var(--status-active)',
                fontWeight: 700,
                fontSize: '1rem'
              }}>
                <Timer size={18} />
                <span>{daysLeft}d left</span>
              </div>
              {totalDays > 0 && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                  of {totalDays} day plan
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
          <User size={16} />
          <span>Last seen: {member.last_check_in || member.lastCheckIn}</span>
        </div>
      </div>

      {status === 'warning' && (
        <div style={{ 
          marginTop: '16px', 
          padding: '10px', 
          background: 'rgba(255, 193, 7, 0.08)', 
          borderRadius: '10px', 
          border: '1px solid rgba(255, 193, 7, 0.2)',
          fontSize: '0.85rem',
          textAlign: 'center',
          color: 'var(--status-warning)',
          fontWeight: 600
        }}>
          Renewal required soon
        </div>
      )}

      {!isActive && (
        <div style={{ 
          marginTop: '16px', 
          padding: '10px', 
          background: 'rgba(244, 67, 54, 0.08)', 
          borderRadius: '10px', 
          border: '1px solid rgba(244, 67, 54, 0.2)',
          fontSize: '0.85rem',
          textAlign: 'center',
          color: 'var(--status-expired)',
          fontWeight: 600
        }}>
          Subscription expired {Math.abs(daysLeft)} days ago
        </div>
      )}
    </motion.div>
  );
};

export default MemberCard;
