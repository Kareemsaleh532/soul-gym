import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user'); // 'admin' or 'user'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!supabase) throw new Error('Supabase client is not configured.');

      if (isLogin) {
        // Sign in with email and password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        const userRole = data.user?.user_metadata?.role || 'user';
        if (onAuthSuccess) onAuthSuccess(data.user, userRole);
      } else {
        // Sign up new user
        if (phone) {
          const phoneRegex = /^(056|059)\d{7}$/;
          if (!phoneRegex.test(phone)) {
            throw new Error('رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 056 أو 059');
          }
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone,
              role
            }
          }
        });

        if (error) throw error;
        const userRole = data.user?.user_metadata?.role || role;
        if (onAuthSuccess) onAuthSuccess(data.user, userRole);
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow Effects */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(255, 71, 26, 0.15) 0%, transparent 60%)',
        filter: 'blur(60px)', zIndex: 0
      }} />

      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '460px', padding: '2.5rem', zIndex: 1, position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="animate-float" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(255,71,26,0.2) 0%, rgba(255,71,26,0.05) 100%)',
            border: '1px solid rgba(255,71,26,0.3)', marginBottom: '1rem',
            color: 'var(--accent-primary)', boxShadow: '0 8px 32px rgba(255,71,26,0.2)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.4 14.4 9.6 9.6" />
              <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
              <path d="m21.5 21.5-1.4-1.4" />
              <path d="M3.9 3.9 2.5 2.5" />
              <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
            </svg>
          </div>
          <h1 className="heading-2" style={{ marginBottom: '0.5rem' }}>
            SOUL<span className="text-gradient">GYM</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isLogin ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(255, 23, 68, 0.1)', border: '1px solid rgba(255, 23, 68, 0.3)',
            color: '#ff1744', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem',
            fontSize: '0.875rem', textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">الاسم الكامل</label>
                <input 
                  type="text" required 
                  className="input-field" 
                  placeholder="أدخل اسمك..." 
                  value={name} onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">رقم الهاتف (اختياري)</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="059XXXXXXX" 
                  value={phone} onChange={(e) => setPhone(e.target.value)} 
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">نوع الحساب</label>
                <select 
                  className="input-field" 
                  value={role} onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">عضو عادي (Member)</option>
                  <option value="admin">مدير النظام (Admin)</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">البريد الإلكتروني</label>
            <input 
              type="email" required 
              className="input-field" 
              placeholder="example@domain.com" 
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">كلمة المرور</label>
            <input 
              type="password" required 
              className="input-field" 
              placeholder="••••••••" 
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading} 
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem' }}
          >
            {loading ? 'جاري التحقق...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
              {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
