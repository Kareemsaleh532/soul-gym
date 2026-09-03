import React from 'react';

const CheckInWidget = ({ onSelfCheckIn, isCheckingIn, checkInSuccessShow, checkInHistory = [] }) => {
  return (
    <div className="ui-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn-accent" 
          onClick={onSelfCheckIn} 
          disabled={isCheckingIn}
          style={{ width: '100%', maxWidth: '320px', padding: '1rem', fontSize: '1rem' }}
        >
          {isCheckingIn ? 'جاري التسجيل...' : 'تسجيل الدخول الرقمي السريع'}
        </button>

        {checkInSuccessShow && (
          <div style={{ color: 'var(--status-active)', marginTop: '0.75rem', fontWeight: '600', fontSize: '0.9rem' }}>
            دخول ناجح! طاب يومك الرياضي 💪
          </div>
        )}
      </div>

      <div>
        <h4 className="title-sm" style={{ marginBottom: '1rem' }}>سجل الحضور الأخير</h4>
        {checkInHistory.length === 0 ? (
          <p className="subtitle">لم تقم بتسجيل الدخول بعد. اضغط على الزر أعلاه لتسجيل دخولك!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {checkInHistory.slice(0, 5).map((log, i) => (
              <div 
                key={i} 
                style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem'
                }}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInWidget;
