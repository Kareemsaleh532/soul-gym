import React from 'react';
import { MenuIcon, SearchIcon, BellIcon, PlusIcon, RefreshIcon } from './Icons';

const Header = ({ 
  title, 
  onMenuToggle, 
  onRefresh, 
  onNewSubscription, 
  isLoading, 
  searchTerm, 
  setSearchTerm,
  unreadCount = 0 
}) => {
  return (
    <header style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--glass)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="btn-circle" 
          onClick={onMenuToggle}
          style={{ display: window.innerWidth <= 1024 ? 'flex' : 'none' }}
        >
          <MenuIcon />
        </button>
        <h1 className="title-md">{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '100px',
          padding: '0.4rem 1rem',
          gap: '0.5rem',
          width: '240px'
        }}>
          <SearchIcon style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="بحث..." 
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              outline: 'none',
              width: '100%',
              fontFamily: 'inherit',
              fontSize: '0.9rem'
            }} 
          />
        </div>

        {onRefresh && (
          <button className="btn-subtle" onClick={onRefresh} disabled={isLoading}>
            <RefreshIcon className={isLoading ? 'animate-spin' : ''} />
            <span style={{ display: window.innerWidth <= 640 ? 'none' : 'inline' }}>مزامنة</span>
          </button>
        )}

        {onNewSubscription && (
          <button className="btn-accent" onClick={onNewSubscription}>
            <PlusIcon />
            <span>اشتراك جديد</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
