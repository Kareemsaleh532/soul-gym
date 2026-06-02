import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Users,
  LayoutDashboard,
  Settings,
  Bell,
  Dumbbell,
  X,
  Plus,
  Loader2,
  RefreshCw,
  Clock,
  Menu
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
<<<<<<< HEAD
import { addMonths, addYears, addDays, format, isAfter } from 'date-fns';
const supabase = null; // No Supabase in this setup
=======
import { addMonths, addYears, addDays, isAfter } from 'date-fns';
import { supabase } from './lib/supabase';
>>>>>>> c4e4a95cf85c66e8a1ba3b1d0d174526d1e28991
import MemberCard from './components/MemberCard';

const API_URL = '/api';

const copy = {
  ar: {
    langName: 'English',
    dashboard: 'لوحة التحكم',
    members: 'الأعضاء',
    notifications: 'التنبيهات',
    settings: 'الإعدادات',
    managementDashboard: 'لوحة إدارة النادي',
    updatingDatabase: 'جاري تحديث قاعدة البيانات...',
    liveOverview: 'نظرة مباشرة على النادي',
    syncData: 'مزامنة البيانات',
    newSubscription: 'اشتراك جديد',
    databaseCount: 'عدد الأعضاء',
    activeNow: 'نشط الآن',
    expired: 'منتهي',
    expiringSoon: 'ينتهي قريبًا',
    memberDirectory: 'دليل الأعضاء',
    fullMemberDirectory: 'دليل الأعضاء الكامل',
    searchNamePhone: 'ابحث بالاسم أو الهاتف...',
    searchMembers: 'ابحث عن عضو...',
    allStatus: 'كل الحالات',
    allMembers: 'كل الأعضاء',
    active: 'نشط',
    activeOnly: 'النشطون فقط',
    warning: 'تحذير',
    expiredOnly: 'المنتهية فقط',
    loadingMembers: 'جاري تحميل الأعضاء...',
    prev: 'السابق',
    next: 'التالي',
    pageOf: (page, total) => `صفحة ${page} من ${total}`,
    subscriptionAlerts: 'تنبيهات الاشتراكات',
    refresh: 'تحديث',
    noNotifications: 'لا توجد تنبيهات جديدة. كل الاشتراكات محدثة.',
    noPhoto: 'بدون صورة',
    subscriptionEnded: (name) => `انتهى اشتراك ${name}`,
    expiredOn: (date) => `انتهى في ${date}`,
    renewNow: 'جدد الآن',
    noMembers: 'لا يوجد أعضاء مطابقون للبحث.',
    appearanceSettings: 'إعدادات المظهر',
    whiteMode: 'الوضع الفاتح',
    whiteModeDescription: 'واجهة نظيفة ومشرقة للاستخدام نهارًا.',
    nightMode: 'الوضع الليلي',
    nightModeDescription: 'واجهة داكنة ومريحة للإضاءة المنخفضة.',
    comingSoon: 'هذا القسم قادم قريبًا...',
    updateSubscription: 'تحديث الاشتراك',
    registerMember: 'تسجيل عضو',
    memberName: 'اسم العضو',
    phoneNumber: 'رقم الهاتف (056 أو 059)',
    phonePlaceholder: '05xXXXXXXX (اختياري)',
    phoneInvalid: 'يجب أن يكون الهاتف 10 أرقام ويبدأ بـ 056 أو 059',
    fixValidation: 'يرجى تصحيح أخطاء التحقق قبل الحفظ.',
    membershipPlan: 'نوع الاشتراك',
    basicPlan: 'الخطة الأساسية',
    proMembership: 'اشتراك برو',
    eliteTraining: 'تدريب النخبة',
    extendSubscription: 'تمديد الاشتراك',
    setDuration: 'تحديد المدة',
    currentExpiry: 'تاريخ الانتهاء الحالي:',
    noExtension: 'بدون تمديد',
    oneMonth: '+ شهر واحد',
    twoMonths: '+ شهرين',
    threeMonths: '+ 3 أشهر',
    sixMonths: '+ 6 أشهر',
    oneYear: '+ سنة',
    enterDays: 'أو أدخل عدد الأيام...',
    saveChanges: 'حفظ التغييرات',
    activateSubscription: 'تفعيل الاشتراك',
    confirmRemove: 'هل أنت متأكد أنك تريد إزالة هذا العضو؟',
    removed: (name) => `تمت إزالة ${name}`,
    undo: 'تراجع',
    localServerError: 'خطأ في الخادم المحلي',
    failedUpdateLocal: 'فشل تحديث العضو محليًا',
    failedAddLocal: 'فشل إضافة العضو محليًا',
    failedDelete: 'فشل حذف العضو: ',
    loadError: 'تعذر تحميل البيانات',
  },
  en: {
    langName: 'العربية',
    dashboard: 'Dashboard',
    members: 'Members',
    notifications: 'Notifications',
    settings: 'Settings',
    managementDashboard: 'Management Dashboard',
    updatingDatabase: 'Updating database...',
    liveOverview: 'Live gym overview',
    syncData: 'Sync Data',
    newSubscription: 'New Subscription',
    databaseCount: 'Database Count',
    activeNow: 'Active Now',
    expired: 'Expired',
    expiringSoon: 'Expiring Soon',
    memberDirectory: 'Member Directory',
    fullMemberDirectory: 'Full Member Directory',
    searchNamePhone: 'Search name or phone...',
    searchMembers: 'Search members...',
    allStatus: 'All Status',
    allMembers: 'All Members',
    active: 'Active',
    activeOnly: 'Active Only',
    warning: 'Warning',
    expiredOnly: 'Expired Only',
    loadingMembers: 'Loading members...',
    prev: 'Prev',
    next: 'Next',
    pageOf: (page, total) => `Page ${page} of ${total}`,
    subscriptionAlerts: 'Subscription Alerts',
    refresh: 'Refresh',
    noNotifications: 'No new notifications. All subscriptions are currently up to date.',
    noPhoto: 'No Photo',
    subscriptionEnded: (name) => `${name}'s subscription has ended`,
    expiredOn: (date) => `Expired on ${date}`,
    renewNow: 'Renew Now',
    noMembers: 'No members found matching your search.',
    appearanceSettings: 'Appearance Settings',
    whiteMode: 'White Mode',
    whiteModeDescription: 'Clean and bright interface for daylight use.',
    nightMode: 'Night Mode',
    nightModeDescription: 'Professional dark interface for low light.',
    comingSoon: 'This module is coming soon...',
    updateSubscription: 'Update Subscription',
    registerMember: 'Register Member',
    memberName: 'Member Name',
    phoneNumber: 'Phone Number (056 or 059)',
    phonePlaceholder: '05xXXXXXXX (Optional)',
    phoneInvalid: 'Phone must be 10 digits and start with 056 or 059',
    fixValidation: 'Please fix validation errors before submitting.',
    membershipPlan: 'Membership Plan',
    basicPlan: 'Basic Plan',
    proMembership: 'Pro Membership',
    eliteTraining: 'Elite Training',
    extendSubscription: 'Extend Subscription',
    setDuration: 'Set Duration',
    currentExpiry: 'Current expiry:',
    noExtension: 'No extension',
    oneMonth: '+ 1 Month',
    twoMonths: '+ 2 Months',
    threeMonths: '+ 3 Months',
    sixMonths: '+ 6 Months',
    oneYear: '+ 1 Year',
    enterDays: 'Or enter days...',
    saveChanges: 'Save Changes',
    activateSubscription: 'Activate Subscription',
    confirmRemove: 'Are you sure you want to remove this member?',
    removed: (name) => `${name} removed`,
    undo: 'Undo',
    localServerError: 'Local server error',
    failedUpdateLocal: 'Failed to update member locally',
    failedAddLocal: 'Failed to add member locally',
    failedDelete: 'Failed to delete member: ',
    loadError: 'Unable to load data',
  }
};

const navLabels = {
  Dashboard: 'dashboard',
  Members: 'members',
  Notifications: 'notifications',
  Settings: 'settings'
};

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
  const [phoneError, setPhoneError] = useState('');
  const modalRef = useRef(null);
  const [pendingDeletes, setPendingDeletes] = useState([]); // array of { member, timeoutId }
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // New pagination and debounce states
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const t = copy.ar;
  const isRtl = true;

  const formatDisplayDate = (date) => new Intl.DateTimeFormat('ar', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
  const searchIconStyle = {
    position: 'absolute',
    [isRtl ? 'right' : 'left']: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-dim)'
  };
  const searchInputStyle = {
    [isRtl ? 'paddingRight' : 'paddingLeft']: '40px',
    width: '100%',
    minWidth: '200px'
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounce search term to avoid filtering on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to first page on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);
  // Initialize data fetching depending on whether Supabase is available
  const fetchMembers = useCallback(async () => {
    await Promise.resolve();
    setIsLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('subscription_end', { ascending: true });
        if (error) throw error;
        setMembers(data || []);
      } else {
        // Fallback to local API
        const response = await fetch(`${API_URL}/members`);
        if (!response.ok) throw new Error(t.localServerError);
        const data = await response.json();
        setMembers(data || []);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [t.localServerError]);

  const fetchNotifications = useCallback(async (shouldUpdateUnread = true) => {
    await Promise.resolve();
    setIsNotifLoading(true);
    try {
      const now = new Date().toISOString();
      let expiredMembers = [];
      if (supabase) {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .lt('subscription_end', now)
          .order('subscription_end', { ascending: false });
        if (error) throw error;
        expiredMembers = data || [];
      } else {
        // Fallback to local API
        const response = await fetch(`${API_URL}/members`);
        if (!response.ok) throw new Error(t.localServerError);
        const allData = await response.json();
        expiredMembers = allData.filter(m => new Date(m.subscription_end) < new Date());
      }
      setNotifications(expiredMembers);
      if (shouldUpdateUnread) {
        setUnreadNotifs(expiredMembers.length);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsNotifLoading(false);
    }
  }, [t.localServerError]);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMembers();
      fetchNotifications(true);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [fetchMembers, fetchNotifications]);

  useEffect(() => {
    if (activeTab === 'Notifications') {
      const timeoutId = setTimeout(() => fetchNotifications(false), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, fetchNotifications]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  // Focus trap and keyboard handlers for modal
  useEffect(() => {
    if (!isModalOpen) return;

    const focusableSelector = 'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const handleKeyDown = (e) => {
      const modal = modalRef.current;
      if (!modal) return;
      const focusable = modal.querySelectorAll(focusableSelector);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    // focus first element
    setTimeout(() => {
      const modal = modalRef.current;
      if (!modal) return;
      const focusable = modal.querySelectorAll(focusableSelector);
      if (focusable.length) focusable[0].focus();
    }, 0);

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan_type: 'Pro Membership',
    duration_months: '1',
    duration_days: ''
  });

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
      setAvatarPreview(member.avatar || '');
      setAvatarFile(null);
    } else {
      setEditingMember(null);
      setFormData({ name: '', phone: '', plan_type: 'Pro Membership', duration_months: '1', duration_days: '' });
      setAvatarPreview('');
      setAvatarFile(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^(056|059)\d{7}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert(t.phoneInvalid);
        return;
      }
    }

    try {
      if (phoneError) {
        alert(t.fixValidation);
        return;
      }
      let avatarUrl = avatarPreview || '';

      // If a new file is selected and supabase available, upload it
      if (avatarFile && supabase) {
        try {
          const path = `avatars/${Date.now()}_${avatarFile.name}`;
          const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true });
          if (uploadErr) throw uploadErr;
          const { data: pub } = await supabase.storage.from('avatars').getPublicUrl(path);
          avatarUrl = pub.publicUrl || avatarUrl;
        } catch (upErr) {
          console.warn('Avatar upload failed, will fallback to preview or empty', upErr.message || upErr);
        }
      }

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

        if (supabase) {
          const { data, error } = await supabase
            .from('members')
            .update({
              name: formData.name,
              phone: formData.phone,
              plan_type: formData.plan_type,
              subscription_end: newEndDate
            })
            .eq('id', editingMember.id)
            .select()
            .single();

          if (error) throw error;
          // attach avatar if available
          if (avatarUrl) data.avatar = avatarUrl;
          setMembers(prev => prev.map(m => m.id === data.id ? data : m));
        } else {
          // Fallback to local API
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
          if (!response.ok) throw new Error(t.failedUpdateLocal);
          const data = await response.json();
          if (avatarUrl) data.avatar = avatarUrl;
          setMembers(prev => prev.map(m => m.id === data.id ? data : m));
        }
      } else {
        const startDate = new Date();
        let endDate;
        
        if (formData.duration_days) {
          endDate = addDays(startDate, parseInt(formData.duration_days));
        } else if (formData.duration_months === '12') {
          endDate = addYears(startDate, 1);
        } else {
          endDate = addMonths(startDate, parseInt(formData.duration_months));
        }

        const avatar = `https://i.pravatar.cc/150?u=${formData.phone || encodeURIComponent(formData.name)}`;

        if (supabase) {
          const { data, error } = await supabase
            .from('members')
            .insert([{
              name: formData.name,
              phone: formData.phone,
              avatar: avatarUrl || avatar,
              plan_type: formData.plan_type,
              subscription_start: startDate.toISOString(),
              subscription_end: endDate.toISOString(),
              last_check_in: 'Never'
            }])
            .select()
            .single();

          if (error) throw error;
          if (avatarUrl) data.avatar = avatarUrl;
          setMembers(prev => [...prev, data]);
        } else {
          // Fallback to local API
          let payload = {
            name: formData.name,
            phone: formData.phone,
            avatar,
            plan_type: formData.plan_type,
            subscription_start: startDate.toISOString(),
            subscription_end: endDate.toISOString()
          };

          // if file provided but no supabase, convert to data URL
          if (avatarFile && !avatarUrl) {
            const toDataUrl = (file) => new Promise((res, rej) => {
              const reader = new FileReader();
              reader.onload = () => res(reader.result);
              reader.onerror = rej;
              reader.readAsDataURL(file);
            });
            try {
              const dataUrl = await toDataUrl(avatarFile);
              payload.avatar = dataUrl;
            } catch (e) {
              console.warn('Failed to read avatar file locally', e);
            }
          }

          const response = await fetch(`${API_URL}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error(t.failedAddLocal);
          const data = await response.json();
          setMembers(prev => [...prev, data]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }


  };
  const handleDeleteMember = async (id) => {
    if (!window.confirm(t.confirmRemove)) return;

    const member = members.find(m => m.id === id);
    if (!member) return;

    // remove locally immediately
    setMembers(prev => prev.filter(m => m.id !== id));

    // schedule final delete after 6s
    const timeoutId = setTimeout(() => finalizeDelete(member), 6000);
    setPendingDeletes(prev => [...prev, { member, timeoutId }]);
  };

  const finalizeDelete = async (member) => {
    const id = member.id;
    // remove from pendingDeletes
    setPendingDeletes(prev => prev.filter(p => p.member.id !== id));
    try {
      if (supabase) {
        const { error } = await supabase
          .from('members')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } else {
        const response = await fetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(t.localServerError);
      }
    } catch (err) {
      // restore on failure
      setMembers(prev => (prev.find(m => m.id === id) ? prev : [...prev, member]));
      alert(t.failedDelete + err.message);
    }
  };

  const undoDelete = () => {
    if (!pendingDeletes.length) return;
    // undo the latest pending delete
    const last = pendingDeletes[pendingDeletes.length - 1];
    clearTimeout(last.timeoutId);
    setMembers(prev => [last.member, ...prev]);
    setPendingDeletes(prev => prev.slice(0, prev.length - 1));
  };

  const filteredMembers = useMemo(() => {
    // First filter based on search and status filter
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

    // Sort so active members appear first, then warning, then expired
    const getStatusRank = (member) => {
      const end = new Date(member.subscription_end);
      const days = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
      const active = end > new Date();
      if (active && days > 10) return 0; // active
      if (!active) return 1; // expired
      // active && days > 0 && days <= 10
      return 2; // warning (expiring soon)
    };
    filtered.sort((a, b) => getStatusRank(a) - getStatusRank(b));
    return filtered;
  }, [debouncedSearch, statusFilter, members]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, page]);

  const stats = {
    total: members.length,
    active: members.filter(m => {
      const days = Math.ceil((new Date(m.subscription_end) - new Date()) / (1000 * 60 * 60 * 24));
      return days > 10;
    }).length,
    expiring: members.filter(m => {
      const days = Math.ceil((new Date(m.subscription_end) - new Date()) / (1000 * 60 * 60 * 24));
      return days > 0 && days <= 10;
    }).length,
    expired: members.filter(m => new Date(m.subscription_end) <= new Date()).length,
  };

  const pendingDelete = pendingDeletes[pendingDeletes.length - 1] || null;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            style={{ 
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.5)', zIndex: 90, backdropFilter: 'blur(4px)' 
            }}
            className="show-mobile"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside style={{
        width: '280px',
        borderRight: isRtl ? 'none' : '1px solid var(--glass-border)',
        borderLeft: isRtl ? '1px solid var(--glass-border)' : 'none',
        padding: '32px 24px',
        display: 'flex', flexDirection: 'column', gap: '32px', position: 'fixed', height: '100vh', zIndex: 100,
        transition: 'transform 0.3s ease',
        background: 'var(--bg-dark)',
        left: isRtl ? 'auto' : 0,
        right: isRtl ? 0 : 'auto',
        transform: windowWidth <= 1024 ? (isSidebarOpen ? 'translateX(0)' : `translateX(${isRtl ? '100%' : '-100%'})`) : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', boxShadow: '0 0 20px var(--primary-glow)' }}>
              <Dumbbell color="white" size={24} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              SOUL<span style={{ color: 'var(--primary)' }}>GYM</span>
            </h1>
          </div>
          <button className="show-mobile" onClick={() => setIsSidebarOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)' }}>
            <X size={24} />
          </button>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label={t.dashboard} 
            active={activeTab === 'Dashboard'} 
            onClick={() => { setActiveTab('Dashboard'); setIsSidebarOpen(false); }} 
            isRtl={isRtl}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label={t.members} 
            active={activeTab === 'Members'} 
            onClick={() => { setActiveTab('Members'); setIsSidebarOpen(false); }} 
            isRtl={isRtl}
          />
          <NavItem 
            icon={<Bell size={20} />} 
            label={t.notifications} 
            active={activeTab === 'Notifications'} 
            onClick={() => { setActiveTab('Notifications'); setUnreadNotifs(0); setIsSidebarOpen(false); }} 
            badge={unreadNotifs}
            isRtl={isRtl}
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label={t.settings} 
            active={activeTab === 'Settings'} 
            onClick={() => { setActiveTab('Settings'); setIsSidebarOpen(false); }} 
            isRtl={isRtl}
          />
        </nav>
      </aside>

      <main style={{ 
        marginLeft: windowWidth <= 1024 || isRtl ? '0' : '280px',
        marginRight: windowWidth <= 1024 || !isRtl ? '0' : '280px',
        flex: 1, 
        padding: windowWidth <= 1024 ? '20px' : '40px', 
        width: windowWidth <= 1024 ? '100%' : 'calc(100% - 280px)',
        minHeight: '100vh'
      }}>
        {/* Mobile Header */}
        <div className="show-mobile" style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', padding: '8px', borderRadius: '8px', color: 'var(--text-main)' }}>
              <Menu size={24} />
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>SOULGYM</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="primary-btn" style={{ padding: '8px' }} onClick={() => handleOpenModal()}>
              <Plus size={20} />
            </button>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            aside { 
              transform: ${isSidebarOpen ? 'translateX(0)' : `translateX(${isRtl ? '100%' : '-100%'})`} !important; 
              display: flex !important;
            }
          }
        `}</style>

        <header className="flex-mobile-stack" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 700 }}>{t.managementDashboard}</h2>
            <p style={{ color: 'var(--text-dim)' }}>{isLoading ? t.updatingDatabase : t.liveOverview}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="primary-btn" onClick={fetchMembers} disabled={isLoading}>
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              <span className="hide-mobile">{t.syncData}</span>
            </button>
            <button className="primary-btn" onClick={() => handleOpenModal()}>
              <Plus size={20} />
              <span>{t.newSubscription}</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="glass-card" style={{ marginBottom: '24px', color: 'var(--status-expired)' }}>
            {t.loadError}: {error}
          </div>
        )}

        {activeTab === 'Dashboard' ? (
          <>
            <div className="stats-grid" style={{ marginBottom: '40px' }}>
              <StatCard label={t.databaseCount} value={stats.total} onClick={() => setStatusFilter('all')} active={statusFilter === 'all'} />
              <StatCard label={t.activeNow} value={stats.active} color="var(--status-active)" onClick={() => setStatusFilter('active')} active={statusFilter === 'active'} />
              <StatCard label={t.expired} value={stats.expired} color="var(--status-expired)" onClick={() => setStatusFilter('expired')} active={statusFilter === 'expired'} />
              <StatCard label={t.expiringSoon} value={stats.expiring} color="var(--status-warning)" onClick={() => setStatusFilter('warning')} active={statusFilter === 'warning'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
              <section>
                <div className="flex-mobile-stack" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, flex: 1 }}>{t.memberDirectory}</h3>
                  <div className="flex-mobile-stack" style={{ gap: '12px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Search size={18} style={searchIconStyle} />
                      <input type="text" placeholder={t.searchNamePhone} style={searchInputStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                      <select className="glass-card" style={{ padding: '8px 16px', background: 'var(--surface)', color: 'white', borderRadius: '8px', cursor: 'pointer', width: '100%' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">{t.allStatus}</option>
                        <option value="active">{t.active}</option>
                        <option value="expired">{t.expired}</option>
                        <option value="warning">{t.warning}</option>
                      </select>
                  </div>
                </div>

                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '100px' }}>
                    <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-dim)' }}>{t.loadingMembers}</p>
                  </div>
                ) : (
                  <div className="members-grid">
                    <AnimatePresence mode="popLayout">
                      {paginatedMembers.map(member => (
                        <MemberCard key={member.id} member={member} onEdit={handleOpenModal} onDelete={handleDeleteMember} language="ar" />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                {/* Pagination Controls */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                  <button
                    className="primary-btn"
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  >
                    {t.prev}
                  </button>
                  <span style={{ alignSelf: 'center' }}>{t.pageOf(page, Math.ceil(filteredMembers.length / itemsPerPage) || 1)}</span>
                  <button
                    className="primary-btn"
                    disabled={page >= Math.ceil(filteredMembers.length / itemsPerPage)}
                    onClick={() => setPage(prev => prev + 1)}
                  >
                    {t.next}
                  </button>
                </div>
              </section>
            </div>
          </>
        ) : activeTab === 'Notifications' ? (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{t.subscriptionAlerts}</h3>
              <button className="primary-btn" onClick={() => fetchNotifications(false)} disabled={isNotifLoading}>
                <RefreshCw size={16} className={isNotifLoading ? 'animate-spin' : ''} />
                {t.refresh}
              </button>
            </div>
            
            {notifications.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
                <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>{t.noNotifications}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {notifications.map(member => (
                  <div key={member.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: isRtl ? 'none' : '4px solid var(--status-expired)', borderRight: isRtl ? '4px solid var(--status-expired)' : 'none' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>{t.noPhoto}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{t.subscriptionEnded(member.name)}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                          {t.expiredOn(formatDisplayDate(new Date(member.subscription_end)))}
                        </div>
                      </div>
                    </div>
                    <button className="primary-btn" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleOpenModal(member)}>
                      {t.renewNow}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'Members' ? (
          <section>
            <div className="flex-mobile-stack" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{t.fullMemberDirectory}</h3>
              <div className="flex-mobile-stack" style={{ gap: '12px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={18} style={searchIconStyle} />
                  <input type="text" placeholder={t.searchMembers} style={searchInputStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="glass-card" style={{ padding: '8px 16px', background: 'var(--surface)', color: 'var(--text-main)', borderRadius: '8px', cursor: 'pointer', width: '100%' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">{t.allMembers}</option>
                  <option value="active">{t.activeOnly}</option>
                  <option value="warning">{t.expiringSoon}</option>
                  <option value="expired">{t.expiredOnly}</option>
                </select>
              </div>
            </div>

            <div className="members-grid">
              <AnimatePresence mode="popLayout">
                {paginatedMembers.map(member => (
                  <MemberCard key={member.id} member={member} onEdit={handleOpenModal} onDelete={handleDeleteMember} language="ar" />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <button
                className="primary-btn"
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              >
                {t.prev}
              </button>
              <span style={{ alignSelf: 'center' }}>{t.pageOf(page, Math.ceil(filteredMembers.length / itemsPerPage) || 1)}</span>
              <button
                className="primary-btn"
                disabled={page >= Math.ceil(filteredMembers.length / itemsPerPage)}
                onClick={() => setPage(prev => prev + 1)}
              >
                {t.next}
              </button>
            </div>
            
            {filteredMembers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
                <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                <p>{t.noMembers}</p>
              </div>
            )}
          </section>
        ) : activeTab === 'Settings' ? (
          <div style={{ width: '100%' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>{t.appearanceSettings}</h3>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
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
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{t.whiteMode}</div>
                <div style={{ fontSize: '0.85rem', color: '#6C757D', textAlign: 'center' }}>{t.whiteModeDescription}</div>
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
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{t.nightMode}</div>
                <div style={{ fontSize: '0.85rem', color: '#A0A0A0', textAlign: 'center' }}>{t.nightModeDescription}</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: 'var(--text-dim)' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t[navLabels[activeTab]] || activeTab}</h3>
              <p>{t.comingSoon}</p>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Member Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                className="glass-card modal-content" 
                ref={modalRef}
              style={{ 
                width: '100%', 
                maxWidth: '500px', 
                background: 'var(--surface)', 
                padding: 'clamp(16px, 5vw, 32px)', 
                maxHeight: '90vh', 
                overflowY: 'auto' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{editingMember ? t.updateSubscription : t.registerMember}</h3>
                <X size={24} style={{ cursor: 'pointer', color: 'var(--text-dim)' }} onClick={() => setIsModalOpen(false)} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.memberName}</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.phoneNumber}</label>
                  <input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData({ ...formData, phone: v });
                      if (v && v.trim()) {
                        const phoneRegex = /^(056|059)\d{7}$/;
                        setPhoneError(phoneRegex.test(v) ? '' : t.phoneInvalid);
                      } else {
                        setPhoneError('');
                      }
                    }}
                  />
                  {phoneError && (
                    <div style={{ color: 'var(--status-expired)', fontSize: '0.85rem' }}>{phoneError}</div>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t.membershipPlan}</label>
                  <select className="glass-card" style={{ padding: '12px', background: 'var(--bg-dark)', color: 'white' }} value={formData.plan_type} onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}>
                    <option value="Basic Plan">{t.basicPlan}</option>
                    <option value="Pro Membership">{t.proMembership}</option>
                    <option value="Elite Training">{t.eliteTraining}</option>
                  </select>
                </div>

                <div style={{ padding: '20px', background: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--primary)' }}>
                    <Clock size={18} />
                    <span style={{ fontWeight: 600 }}>{editingMember ? t.extendSubscription : t.setDuration}</span>
                  </div>

                  {editingMember && (
                    <div style={{ marginBottom: '12px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      {t.currentExpiry} <span style={{ color: 'white' }}>{formatDisplayDate(new Date(editingMember.subscription_end))}</span>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select
                      className="glass-card"
                      style={{ width: '100%', padding: '12px', background: 'var(--surface-light)', color: 'white' }}
                      value={formData.duration_months}
                      onChange={(e) => setFormData({ ...formData, duration_months: e.target.value, duration_days: '' })}
                    >
                      {editingMember && <option value="0">{t.noExtension}</option>}
                      <option value="1">{t.oneMonth}</option>
                      <option value="2">{t.twoMonths}</option>
                      <option value="3">{t.threeMonths}</option>
                      <option value="6">{t.sixMonths}</option>
                      <option value="12">{t.oneYear}</option>
                    </select>

                    <input
                      type="text"
                      placeholder={t.enterDays}
                      style={{ width: '100%' }}
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: e.target.value, duration_months: '0' })}
                    />
                  </div>
                </div>

                <button type="submit" className="primary-btn" style={{ justifyContent: 'center', height: '50px' }} disabled={!!phoneError}>
                  {editingMember ? t.saveChanges : t.activateSubscription}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        {pendingDelete && (
          <div style={{ position: 'fixed', [isRtl ? 'right' : 'left']: 20, bottom: 20, zIndex: 200 }}>
            <div className="glass-card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 16px' }}>
              <div style={{ fontWeight: 700 }}>{t.removed(pendingDelete.member.name)}</div>
              <button className="primary-btn" onClick={undoDelete} style={{ padding: '8px 12px' }}>{t.undo}</button>
            </div>
          </div>
        )}
    </div>
  );
}

const NavItem = ({ icon, label, active, danger, onClick, badge, isRtl }) => (
  <motion.div onClick={onClick} whileHover={{ x: isRtl ? -4 : 4 }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', background: active ? 'var(--glass)' : 'transparent', color: active ? 'var(--primary)' : (danger ? '#ff4d4d' : 'var(--text-dim)'), fontWeight: active ? 600 : 400, transition: 'all 0.2s ease' }}>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon}
      {badge > 0 && (
        <span style={{ 
          position: 'absolute', top: '-8px', [isRtl ? 'left' : 'right']: '-8px', background: 'var(--primary)', color: 'white', 
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
