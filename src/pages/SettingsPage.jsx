import React from 'react';

const SettingsPage = ({ theme, setTheme }) => {
  return (
    <div style={{ maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 className="title-md">إعدادات المظهر والنظام</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
        <div 
          className="ui-panel" 
          onClick={() => setTheme('light')}
          style={{
            cursor: 'pointer',
            border: theme === 'light' ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
            textAlign: 'center',
            padding: '2rem'
          }}
        >
          <h3 className="title-sm" style={{ marginBottom: '0.5rem' }}>الوضع الفاتح</h3>
          <p className="subtitle">واجهة مشرفة مريحة للاستخدام في النهار.</p>
        </div>

        <div 
          className="ui-panel" 
          onClick={() => setTheme('dark')}
          style={{
            cursor: 'pointer',
            border: theme === 'dark' ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
            textAlign: 'center',
            padding: '2rem'
          }}
        >
          <h3 className="title-sm" style={{ marginBottom: '0.5rem' }}>الوضع الداكن (الاحترافي)</h3>
          <p className="subtitle">واجهة داكنة تقلل إجهاد العين وتمنح مظهرًا فاخرًا.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
