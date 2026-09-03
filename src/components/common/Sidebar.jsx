import React from 'react';
import { 
  DashboardIcon, 
  UsersIcon, 
  BellIcon, 
  SettingsIcon, 
  DumbbellIcon, 
  LogoutIcon 
} from './Icons';

const Sidebar = ({ activeTab, setActiveTab, unreadNotifs = 0, onLogout, isMobileOpen, setIsMobileOpen }) => {
  const navItems = [
    { id: 'Dashboard', label: 'لوحة التحكم', icon: DashboardIcon },
    { id: 'Members', label: 'الأعضاء', icon: UsersIcon },
    { id: 'Notifications', label: 'التنبيهات', icon: BellIcon, badge: unreadNotifs },
    { id: 'Settings', label: 'الإعدادات', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: '280px',
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border-subtle)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1.5rem',
        transform: window.innerWidth <= 1024 && !isMobileOpen ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <DumbbellIcon />
          </div>
          <div>
            <h2 className="title-md" style={{ fontSize: '1.25rem', lineHeight: 1 }}>SOUL<span className="gradient-text">GYM</span></h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>الإصدار احترافي</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(255, 71, 26, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(255, 71, 26, 0.25)' : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? '600' : '500',
                  textAlign: 'right',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <Icon />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    marginRight: 'auto',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    borderRadius: '100px',
                    padding: '2px 8px'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <button className="btn-subtle" onClick={onLogout} style={{ width: '100%', justifyContent: 'center' }}>
            <LogoutIcon />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
