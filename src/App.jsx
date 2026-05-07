import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Users,
  Calendar,
  LayoutDashboard,
  Settings,
  Bell,
  Dumbbell,
  LogOut,
  X,
  Plus,
  Loader2,
  RefreshCw,
  Clock,
  ChevronRight
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { addMonths, addYears, addDays, format, isAfter } from 'date-fns';
import MemberCard from './components/MemberCard';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan_type: 'Pro Membership',
    duration_months: '1',
    duration_days: ''
  });

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/members`);
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setIsNotifLoading(true);
    try {
      const response = await fetch(`${API_URL}/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
      if (activeTab !== 'Notifications') {
        setUnreadNotifs(data.length);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (activeTab === 'Notifications') {
      fetchNotifications();
    }
  }, [activeTab]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        phone: member.phone,
        plan_type: member.plan_type,
        duration_months: '0', // 0 means don't extend
        duration_days: ''
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', phone: '', plan_type: 'Pro Membership', duration_months: '1', duration_days: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^(056|059)\d{7}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('Phone number must be 10 digits and start with 056 or 059');
      return;
    }

    try {
      if (editingMember) {
        const baseDate = isAfter(new Date(editingMember.subscription_end), new Date())
          ? new Date(editingMember.subscription_end)
          : new Date();
        
        let newEndDate = editingMember.subscription_end;
        
        if (formData.duration_days) {
          newEndDate = addDays(baseDate, parseInt(formData.duration_days)).toISOString();
        } else if (formData.duration_months !== '0') {
          if (formData.duration_months === '12') {
            newEndDate = addYears(baseDate, 1).toISOString();
          } else {
            newEndDate = addMonths(baseDate, parseInt(formData.duration_months)).toISOString();
          }
        }

        const response = await fetch(`${API_URL}/members/${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            plan_type: formData.plan_type,
            subscription_end: newEndDate
          })
        });
        if (!response.ok) throw new Error('Failed to update member');
        const updated = await response.json();
        setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
      } else {
        const response = await fetch(`${API_URL}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to add member');
        const newMember = await response.json();
        setMembers(prev => [...prev, newMember]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      const response = await fetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete member');
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      const endDate = new Date(member.subscription_end);
      const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
      const isActive = endDate > new Date();
      if (statusFilter === 'active') return isActive && daysLeft > 7;
      if (statusFilter === 'warning') return isActive && daysLeft > 0 && daysLeft <= 7;
      if (statusFilter === 'expired') return !isActive;
      return true;
    });
  }, [searchTerm, statusFilter, members]);

  const stats = {
    total: members.length,
    active: members.filter(m => new Date(m.subscription_end) > new Date()).length,
    expiring: members.filter(m => {
      const days = Math.ceil((new Date(m.subscription_end) - new Date()) / (1000 * 60 * 60 * 24));
      return days > 0 && days <= 7;
    }).length,
    expired: members.filter(m => new Date(m.subscription_end) <= new Date()).length,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px', borderRight: '1px solid var(--glass-border)', padding: '32px 24px',
        display: 'flex', flexDirection: 'column', gap: '32px', position: 'fixed', height: '100vh', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', boxShadow: '0 0 20px var(--primary-glow)' }}>
            <Dumbbell color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
            SOUL<span style={{ color: 'var(--primary)' }}>GYM</span>
          </h1>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <NavItem icon={<Users size={20} />} label="Members" active={activeTab === 'Members'} onClick={() => setActiveTab('Members')} />
          <NavItem 
            icon={<Bell size={20} />} 
            label="Notifications" 
            active={activeTab === 'Notifications'} 
            onClick={() => { setActiveTab('Notifications'); setUnreadNotifs(0); }} 
            badge={unreadNotifs}
          />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>
      </aside>

      <main style={{ marginLeft: '280px', flex: 1, padding: '40px', width: 'calc(100% - 280px)' }}>
        <style>{`
          @media (max-width: 1024px) {
            aside { display: none !important; }
            main { marginLeft: 0 !important; width: 100% !important; padding: 20px !important; }
          }
        `}</style>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Management Dashboard</h2>
            <p style={{ color: 'var(--text-dim)' }}>{isLoading ? 'Updating database...' : "Live gym overview"}</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="primary-btn" onClick={fetchMembers} disabled={isLoading}>
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              Sync Data
            </button>
            <button className="primary-btn" onClick={() => handleOpenModal()}>
              <Plus size={20} />
              New Subscription
            </button>
          </div>
        </header>

        {activeTab === 'Dashboard' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              <StatCard label="Database Count" value={stats.total} onClick={() => setStatusFilter('all')} active={statusFilter === 'all'} />
              <StatCard label="Active Now" value={stats.active} color="var(--status-active)" onClick={() => setStatusFilter('active')} active={statusFilter === 'active'} />
              <StatCard label="Expiring Soon" value={stats.expiring} color="var(--status-warning)" onClick={() => setStatusFilter('warning')} active={statusFilter === 'warning'} />
              <StatCard label="Expired" value={stats.expired} color="var(--status-expired)" onClick={() => setStatusFilter('expired')} active={statusFilter === 'expired'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, flex: 1 }}>Member Directory</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                      <input type="text" placeholder="Search name or phone..." style={{ paddingLeft: '40px', width: '250px' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="glass-card" style={{ padding: '8px 16px', background: 'var(--surface)', color: 'white', borderRadius: '8px', cursor: 'pointer' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="warning">Warning</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '100px' }}>
                    <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-dim)' }}>Loading members...</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    <AnimatePresence mode="popLayout">
                      {filteredMembers.map(member => (
                        <MemberCard key={member.id} member={member} onEdit={handleOpenModal} onDelete={handleDeleteMember} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </section>
            </div>
          </>
        ) : activeTab === 'Notifications' ? (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Subscription Alerts</h3>
              <button className="primary-btn" onClick={fetchNotifications} disabled={isNotifLoading}>
                <RefreshCw size={16} className={isNotifLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
            
            {notifications.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
                <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>No new notifications. All subscriptions are currently up to date.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {notifications.map(member => (
                  <div key={member.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--status-expired)' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img src={member.avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{member.name}'s subscription has ended</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                          Expired on {format(new Date(member.subscription_end), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <button className="primary-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleOpenModal(member)}>
                      Renew Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'Members' ? (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Full Member Directory</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input type="text" placeholder="Search members..." style={{ paddingLeft: '40px', width: '300px' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="glass-card" style={{ padding: '8px 16px', background: 'var(--surface)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Members</option>
                  <option value="active">Active Only</option>
                  <option value="warning">Expiring Soon</option>
                  <option value="expired">Expired Only</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              <AnimatePresence mode="popLayout">
                {filteredMembers.map(member => (
                  <MemberCard key={member.id} member={member} onEdit={handleOpenModal} onDelete={handleDeleteMember} />
                ))}
              </AnimatePresence>
            </div>
            
            {filteredMembers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
                <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>No members found matching your search.</p>
              </div>
            )}
          </section>
        ) : activeTab === 'Settings' ? (
          <div style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Appearance Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div 
                onClick={() => setTheme('light')}
                className="glass-card" 
                style={{ 
                  cursor: 'pointer', 
                  border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                  background: '#F8F9FA',
                  color: '#212529',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ background: 'white', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <Dumbbell size={32} color="#FF5722" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>White Mode</div>
                <div style={{ fontSize: '0.85rem', color: '#6C757D', textAlign: 'center' }}>Clean and bright interface for daylight use.</div>
              </div>

              <div 
                onClick={() => setTheme('dark')}
                className="glass-card" 
                style={{ 
                  cursor: 'pointer', 
                  border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                  background: '#0A0A0A',
                  color: 'white',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ background: '#141414', padding: '12px', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                  <Dumbbell size={32} color="#FF5722" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Night Mode</div>
                <div style={{ fontSize: '0.85rem', color: '#A0A0A0', textAlign: 'center' }}>Professional dark interface for low light.</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-dim)' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{activeTab}</h3>
              <p>This module is coming soon...</p>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-card" style={{ width: '500px', background: 'var(--surface)', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{editingMember ? 'Update Subscription' : 'Register Member'}</h3>
                <X size={24} style={{ cursor: 'pointer', color: 'var(--text-dim)' }} onClick={() => setIsModalOpen(false)} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Member Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Phone Number (056 or 059)</label>
                  <input type="tel" required placeholder="05xXXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>Membership Plan</label>
                  <select className="glass-card" style={{ padding: '12px', background: 'var(--bg-dark)', color: 'white' }} value={formData.plan_type} onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}>
                    <option>Basic Plan</option>
                    <option>Pro Membership</option>
                    <option>Elite Training</option>
                  </select>
                </div>

                <div style={{ padding: '20px', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)' }}>
                    <Clock size={18} />
                    <span style={{ fontWeight: 600 }}>{editingMember ? 'Extend Subscription' : 'Set Duration'}</span>
                  </div>

                  {editingMember && (
                    <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      Current expiry: <span style={{ color: 'white' }}>{format(new Date(editingMember.subscription_end), 'MMM dd, yyyy')}</span>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select
                      className="glass-card"
                      style={{ width: '100%', padding: '12px', background: 'var(--surface-light)', color: 'white' }}
                      value={formData.duration_months}
                      onChange={(e) => setFormData({ ...formData, duration_months: e.target.value, duration_days: '' })}
                    >
                      {editingMember && <option value="0">No extension</option>}
                      <option value="1">+ 1 Month</option>
                      <option value="2">+ 2 Months</option>
                      <option value="3">+ 3 Months</option>
                      <option value="6">+ 6 Months</option>
                      <option value="12">+ 1 Year</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Or enter days..."
                      style={{ width: '100%' }}
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: e.target.value, duration_months: '0' })}
                    />
                  </div>
                </div>

                <button type="submit" className="primary-btn" style={{ justifyContent: 'center', height: '50px' }}>
                  {editingMember ? 'Save Changes' : 'Activate Subscription'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const NavItem = ({ icon, label, active, danger, onClick, badge }) => (
  <motion.div onClick={onClick} whileHover={{ x: 4 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', background: active ? 'var(--glass)' : 'transparent', color: active ? 'var(--primary)' : (danger ? '#ff4d4d' : 'var(--text-dim)'), fontWeight: active ? 600 : 400, transition: 'all 0.2s ease' }}>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon}
      {badge > 0 && (
        <span style={{ 
          position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', 
          fontSize: '11px', fontWeight: 700, minWidth: '18px', height: '18px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid var(--bg-dark)'
        }}>
          {badge}
        </span>
      )}
    </div>
    <span>{label}</span>
  </motion.div>
);

const StatCard = ({ label, value, color, onClick, active }) => (
  <motion.div onClick={onClick} whileHover={{ y: -5 }} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer', border: active ? `1px solid ${color || 'var(--primary)'}` : '1px solid var(--glass-border)' }}>
    <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{label}</span>
    <span style={{ fontSize: '2.5rem', fontWeight: 700, color: color || 'white' }}>{value}</span>
  </motion.div>
);

export default App;
