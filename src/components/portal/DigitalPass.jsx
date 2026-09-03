import React, { useState } from 'react';
import { DumbbellIcon } from '../common/Icons';

const DigitalPass = ({ memberProfile, sessionUser }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const name = memberProfile?.name || sessionUser?.user_metadata?.name || 'عضو';
  const phone = memberProfile?.phone || sessionUser?.user_metadata?.phone || '05XXXXXXXX';
  const plan = memberProfile?.plan_type || 'Pro Membership';
  const expiry = memberProfile?.subscription_end 
    ? new Date(memberProfile.subscription_end).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'نشط';

  return (
    <div 
      style={{ perspective: '1000px', width: '100%', maxWidth: '380px', margin: '0 auto', cursor: 'pointer' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div style={{
        width: '100%', height: '220px', position: 'relative',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        {/* Front */}
        <div className="ui-panel" style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, rgba(255, 71, 26, 0.2) 0%, rgba(121, 40, 202, 0.2) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '1.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-glow)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="title-md" style={{ fontSize: '1.1rem' }}>SOUL <span className="gradient-text">GYM</span></h3>
            <DumbbellIcon style={{ color: 'var(--accent-primary)' }} />
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>اسم العضو</span>
            <h2 className="title-md">{name}</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{phone}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>الباقة: </span>
              <span style={{ fontWeight: '600' }}>{plan}</span>
            </div>
            <div className="badge badge-active">{expiry}</div>
          </div>
        </div>

        {/* Back (Digital QR/Barcode View) */}
        <div className="ui-panel" style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, rgba(16, 16, 22, 0.95) 0%, rgba(22, 22, 34, 0.95) 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          transform: 'rotateY(180deg)', borderRadius: 'var(--radius-xl)'
        }}>
          <div style={{
            width: '100px', height: '100px', background: 'white', padding: '8px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Mock QR SVG */}
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>رمز الدخول الرقمي</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalPass;
