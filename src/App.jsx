import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { addMonths, addDays, isAfter } from 'date-fns';
import { supabase } from './lib/supabase';

// Common Components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import MemberModal from './components/members/MemberModal';

// Pages
import AuthPage from './pages/AuthPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import GuestStorePage from './pages/GuestStorePage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

function App() {
  // Navigation / View Mode: 'guest' | 'auth' | 'admin'
  const [viewMode, setViewMode] = useState('guest');

  // Session / Auth States
  const [sessionUser, setSessionUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // App Layout States
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Data States
  const [members, setMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [formData, setFormData] = useState({
    name: '', phone: '', plan_type: 'Pro Membership', duration_months: '1', duration_days: ''
  });

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth Session Verification
  useEffect(() => {
    const initSession = async () => {
      try {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSessionUser(session.user);
          setViewMode('admin');
        } else {
          setViewMode('guest');
        }
      } catch (err) {
        console.error('Session error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initSession();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setSessionUser(session.user);
          setViewMode('admin');
        } else {
          setSessionUser(null);
          setViewMode('guest');
        }
        setIsAuthLoading(false);
      });
      return () => subscription?.unsubscribe();
    }
  }, []);

  // Admin Data Fetch
  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client missing.');
      let allMembers = [];
      let keepFetching = true;
      let offset = 0;
      const limit = 1000;

      while (keepFetching) {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .range(offset, offset + limit - 1)
          .order('subscription_end', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) {
          keepFetching = false;
        } else {
          allMembers = [...allMembers, ...data];
          offset += limit;
          if (data.length < limit) keepFetching = false;
        }
      }
      setMembers(allMembers);
    } catch (err) {
      console.error('Fetch members error:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async (shouldUpdateUnread = true) => {
    setIsNotifLoading(true);
    try {
      const now = new Date().toISOString();
      if (!supabase) return;
      const { data } = await supabase
        .from('members')
        .select('*')
        .lt('subscription_end', now)
        .order('subscription_end', { ascending: false });
      const expired = data || [];
      setNotifications(expired);
      if (shouldUpdateUnread) setUnreadNotifs(expired.length);
    } catch (err) {
      console.error('Fetch notifs error:', err.message);
    } finally {
      setIsNotifLoading(false);
    }
  }, []);

  const fetchOrdersCount = useCallback(async () => {
    try {
      if (!supabase) return;
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'جديد');

      if (!error && count !== null) {
        setNewOrdersCount(count);
      }
    } catch (err) {
      console.error('Fetch orders count error:', err);
    }
  }, []);

  useEffect(() => {
    if (sessionUser) {
      fetchMembers();
      fetchNotifications(true);
      fetchOrdersCount();
    }
  }, [sessionUser, fetchMembers, fetchNotifications, fetchOrdersCount]);

  // Auth Handlers
  const handleAuthSuccess = (user) => {
    setSessionUser(user);
    setViewMode('admin');
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSessionUser(null);
    setViewMode('guest');
  };

  // Modal Handlers
  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        phone: member.phone || '',
        plan_type: member.plan_type || 'Pro Membership',
        duration_months: '0',
        duration_days: ''
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', phone: '', plan_type: 'Pro Membership', duration_months: '1', duration_days: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmitMember = async (e) => {
    e.preventDefault();
    try {
      if (!supabase) throw new Error('Supabase integration missing.');

      if (editingMember) {
        const baseDate = isAfter(new Date(editingMember.subscription_end), new Date())
          ? new Date(editingMember.subscription_end)
          : new Date();
        
        let newEndDate = editingMember.subscription_end;
        if (formData.duration_days) {
          newEndDate = addDays(baseDate, parseInt(formData.duration_days)).toISOString();
        } else if (formData.duration_months !== '0') {
          newEndDate = addMonths(baseDate, parseInt(formData.duration_months)).toISOString();
        }

        const { data, error } = await supabase
          .from('members')
          .update({
            name: formData.name,
            phone: formData.phone,
            plan_type: formData.plan_type,
            subscription_end: newEndDate
          })
          .eq('id', editingMember.id)
          .select().single();

        if (error) throw error;
        setMembers(prev => prev.map(m => m.id === data.id ? data : m));
      } else {
        const startDate = new Date();
        let endDate = addMonths(startDate, parseInt(formData.duration_months || 1));

        const avatar = `https://i.pravatar.cc/150?u=${formData.phone || encodeURIComponent(formData.name)}`;

        const { data, error } = await supabase
          .from('members')
          .insert([{
            name: formData.name,
            phone: formData.phone,
            avatar,
            plan_type: formData.plan_type,
            subscription_start: startDate.toISOString(),
            subscription_end: endDate.toISOString(),
            last_check_in: 'Never'
          }])
          .select().single();

        if (error) throw error;
        setMembers(prev => [...prev, data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في إزالة هذا العضو؟')) return;
    try {
      if (!supabase) return;
      await supabase.from('members').delete().eq('id', id);
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert('فشل في حذف العضو: ' + err.message);
    }
  };

  // Filter & Pagination Calculations
  const filteredMembers = useMemo(() => {
    const filtered = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (member.phone && member.phone.toLowerCase().includes(debouncedSearch.toLowerCase()));
      if (!matchesSearch) return false;

      const endDate = new Date(member.subscription_end);
      const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
      const isActive = endDate > new Date();

      if (statusFilter === 'active') return isActive && daysLeft > 10;
      if (statusFilter === 'warning') return isActive && daysLeft > 0 && daysLeft <= 10;
      if (statusFilter === 'expired') return !isActive;
      return true;
    });

    return filtered;
  }, [debouncedSearch, statusFilter, members]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, page]);

  const stats = {
    total: members.length,
    active: members.filter(m => Math.ceil((new Date(m.subscription_end) - new Date()) / (1000 * 60 * 60 * 24)) > 10).length,
    expiring: members.filter(m => {
      const d = Math.ceil((new Date(m.subscription_end) - new Date()) / (1000 * 60 * 60 * 24));
      return d > 0 && d <= 10;
    }).length,
    expired: members.filter(m => new Date(m.subscription_end) <= new Date()).length,
  };

  if (isAuthLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <h2 className="title-md gradient-text">جاري تحميل SOULGYM...</h2>
      </div>
    );
  }

  // 1. Guest View (Public Store Landing Page)
  if (viewMode === 'guest') {
    return <GuestStorePage onOpenAdminLogin={() => setViewMode('auth')} />;
  }

  // 2. Admin Auth Page
  if (viewMode === 'auth' && !sessionUser) {
    return (
      <div>
        <div style={{ padding: '1rem 2rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-subtle" onClick={() => setViewMode('guest')}>
            ← العودة لمتجر الزوار 🛒
          </button>
        </div>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // 3. Admin Dashboard View
  return (
    <div className="layout-wrapper" dir="rtl">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'Notifications') setUnreadNotifs(0);
        }} 
        unreadNotifs={unreadNotifs}
        newOrdersCount={newOrdersCount}
        onLogout={handleLogout}
        onOpenGuestStore={() => setViewMode('guest')}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="layout-main">
        <Header 
          title={
            activeTab === 'Dashboard' ? 'لوحة التحكم والمباشرة' :
            activeTab === 'Members' ? 'دليل الأعضاء' :
            activeTab === 'Orders' ? 'طلبات الشراء القادمة' :
            activeTab === 'Products' ? 'إدارة المنتجات والمكملات' :
            activeTab === 'Notifications' ? 'التنبيهات' : 'الإعدادات'
          } 
          onMenuToggle={() => setIsMobileOpen(true)}
          onRefresh={() => { fetchMembers(); fetchOrdersCount(); }}
          onNewSubscription={() => handleOpenModal()}
          isLoading={isLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          unreadCount={unreadNotifs}
        />

        <main className="content-container">
          {activeTab === 'Dashboard' && (
            <AdminDashboardPage 
              stats={stats}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              paginatedMembers={paginatedMembers}
              filteredMembers={filteredMembers}
              isLoading={isLoading}
              page={page}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              onOpenModal={handleOpenModal}
              onDeleteMember={handleDeleteMember}
            />
          )}

          {activeTab === 'Members' && (
            <AdminDashboardPage 
              stats={stats}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              paginatedMembers={paginatedMembers}
              filteredMembers={filteredMembers}
              isLoading={isLoading}
              page={page}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              onOpenModal={handleOpenModal}
              onDeleteMember={handleDeleteMember}
            />
          )}

          {activeTab === 'Orders' && (
            <AdminOrdersPage />
          )}

          {activeTab === 'Products' && (
            <AdminProductsPage />
          )}

          {activeTab === 'Notifications' && (
            <NotificationsPage 
              notifications={notifications}
              onRenew={(member) => handleOpenModal(member)}
              onRefresh={() => fetchNotifications(false)}
              isNotifLoading={isNotifLoading}
            />
          )}

          {activeTab === 'Settings' && (
            <SettingsPage theme={theme} setTheme={setTheme} />
          )}
        </main>
      </div>

      <MemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingMember={editingMember}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmitMember}
        phoneError={phoneError}
      />
    </div>
  );
}

export default App;
