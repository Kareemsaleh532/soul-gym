import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { DumbbellIcon } from '../components/common/Icons';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!supabase) throw new Error('Supabase integration missing.');

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const userRole = data.user?.user_metadata?.role || 'admin';
        if (onAuthSuccess) onAuthSuccess(data.user, userRole);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role: 'admin' } }
        });

        if (error) throw error;
        const userRole = data.user?.user_metadata?.role || 'admin';
        if (onAuthSuccess) onAuthSuccess(data.user, userRole);
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', background: 'var(--bg-dark)', position: 'relative'
    }}>
      <div className="ui-panel animate-up" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(255,71,26,0.2) 0%, rgba(121,40,202,0.1) 100%)',
            border: '1px solid var(--border-active)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1rem'
          }}>
            <DumbbellIcon size={32} />
          </div>
          <h1 className="title-md">SOUL <span className="gradient-text">GYM</span></h1>
          <p className="subtitle" style={{ marginTop: '0.25rem' }}>
            {isLogin ? 'تسجيل دخول مدير النظام' : 'إنشاء حساب مدير جديد'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(255, 23, 68, 0.1)', border: '1px solid rgba(255, 23, 68, 0.3)',
            color: '#ff1744', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem',
            fontSize: '0.85rem', textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">الاسم الكامل</label>
              <input type="text" required className="form-control" placeholder="أدخل اسمك..." value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input type="email" required className="form-control" placeholder="admin@soulgym.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input type="password" required className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn-accent" disabled={loading} style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
            {loading ? 'جاري التحقق...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
              {isLogin ? 'إنشاء حساب مدير' : 'تسجيل الدخول'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
