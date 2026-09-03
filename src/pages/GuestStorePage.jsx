import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  DumbbellIcon, 
  SearchIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  CheckCircleIcon, 
  CloseIcon, 
  PhoneIcon, 
  MapPinIcon, 
  UserIcon 
} from '../components/common/Icons';

const LOCAL_PRODUCTS_KEY = 'soulgym_custom_products';
const LOCAL_ORDERS_KEY = 'soulgym_custom_orders';

const getStoredProducts = () => {
  try {
    const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem(LOCAL_ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveStoredOrders = (ordersList) => {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(ordersList));
  } catch (err) {
    console.error('LocalStorage save orders error:', err);
  }
};

const GuestStorePage = ({ onOpenAdminLogin }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  // Order Modal States
  const [orderingProduct, setOrderingProduct] = useState(null);
  const [orderQty, setOrderQty] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Fetch real products added by Admin (LocalStorage + Supabase combined)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const local = getStoredProducts();
      let remote = [];

      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            remote = data;
          }
        }
      } catch (err) {
        console.log('Supabase fetch error, using local:', err);
      } finally {
        const mergedMap = new Map();
        [...remote, ...local].forEach(p => {
          if (p && p.id) mergedMap.set(String(p.id), p);
        });
        setProducts(Array.from(mergedMap.values()));
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['الكل', 'بروتينات', 'كرياتين ومحفزات', 'أحماض أمينية', 'طاقة وتمرين', 'إكسسوارات'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenOrderModal = (product) => {
    setOrderingProduct(product);
    setOrderQty(1);
    setGuestName('');
    setGuestPhone('');
    setGuestAddress('');
    setFormError('');
    setOrderSuccess(false);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!guestName.trim()) {
      setFormError('يرجى إدخال اسمك الكامل');
      return;
    }

    const phoneRegex = /^(056|059)\d{7}$/;
    if (!phoneRegex.test(guestPhone.trim())) {
      setFormError('رقم الهاتف يجب أن يتكون من 10 أرقام ويبدأ بـ 056 أو 059');
      return;
    }

    if (!guestAddress.trim()) {
      setFormError('يرجى إدخال عنوانك / منطقتك بالتفصيل');
      return;
    }

    setIsSubmitting(true);

    const totalPrice = (orderingProduct.price * orderQty);
    const newOrder = {
      id: Date.now(),
      guest_name: guestName.trim(),
      guest_phone: guestPhone.trim(),
      guest_address: guestAddress.trim(),
      product_name: orderingProduct.name,
      quantity: orderQty,
      total_price: totalPrice,
      status: 'جديد',
      created_at: new Date().toISOString()
    };

    try {
      if (supabase) {
        await supabase.from('orders').insert([newOrder]);
      }
    } catch (err) {
      console.log('Remote order save notice:', err);
    } finally {
      const existingOrders = getStoredOrders();
      saveStoredOrders([newOrder, ...existingOrders]);

      setLastOrderDetails({
        ...newOrder,
        unitPrice: orderingProduct.price
      });
      setOrderSuccess(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)', paddingBottom: '4rem' }}>
      
      {/* Guest Top Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 90,
        background: 'rgba(18, 18, 20, 0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <DumbbellIcon size={24} />
          </div>
          <div>
            <h1 className="title-md" style={{ fontSize: '1.2rem', margin: 0 }}>
              SOUL <span className="gradient-text">GYM</span> STORE
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>متجر المكملات والبروتينات</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn-subtle" 
            onClick={onOpenAdminLogin}
            style={{ padding: '0.55rem 1.15rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
          >
            <span>دخول الإدارة 🔐</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '3.5rem 2rem 2.5rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top center, rgba(255, 71, 26, 0.15) 0%, transparent 70%)',
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(255, 71, 26, 0.12)', border: '1px solid rgba(255, 71, 26, 0.3)',
          padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem', color: 'var(--accent-primary)',
          fontWeight: '600', marginBottom: '1.25rem'
        }}>
          <ShoppingBagIcon size={16} />
          <span>توصيل سريع ومباشر داخل المنطقة ⚡</span>
        </div>

        <h1 className="title-lg" style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1.35, marginBottom: '1rem' }}>
          أفضل <span className="gradient-text">البروتينات والمكملات</span> لجسمك وطاقتك
        </h1>
        <p className="subtitle" style={{ maxWidth: '650px', margin: '0 auto 2rem', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
          اختر من تشكيلة المكملات الغذائية المعتمدة، وحدد كميتك واطلب مباشرة بنقرة زر بدون الحاجة لتسجيل حساب!
        </p>

        {/* Filter Controls Bar */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
          maxWidth: '900px', margin: '0 auto',
          background: 'var(--bg-surface)', padding: '1.25rem',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              type="text" 
              className="form-control"
              placeholder="ابحث عن اسم البروتين، الكرياتين، أو المكمل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '2.75rem', height: '48px', fontSize: '0.95rem' }}
            />
            <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
              <SearchIcon size={20} />
            </div>
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: selectedCategory === cat ? '700' : '500',
                  background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-dark)',
                  color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <h3 className="title-md gradient-text">جاري تحميل المعروضات...</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '4rem 2rem',
            background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <ShoppingBagIcon size={48} className="gradient-text" />
            <h3 className="title-md" style={{ marginTop: '1rem' }}>لا توجد منتجات مضافة حالياً في المتجر</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>سيتم عرض المعروضات والبروتينات بمجرد إضافتها من قبل إدارة النادي.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="ui-panel animate-up"
                style={{
                  display: 'flex', flexDirection: 'column',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  padding: 0,
                  transition: 'transform 0.25s ease, border-color 0.25s ease'
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', height: '220px', width: '100%', background: '#0a0a0c', overflow: 'hidden' }}>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                      <ShoppingBagIcon size={48} />
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(18, 18, 20, 0.85)', backdropFilter: 'blur(6px)',
                    padding: '4px 10px', borderRadius: '100px',
                    fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)',
                    border: '1px solid rgba(255, 71, 26, 0.3)'
                  }}>
                    {product.category || 'بروتينات'}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', lineHeight: 1.4 }}>{product.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
                    {product.description || 'منتج متوفر داخل النادي.'}
                  </p>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>السعر</span>
                      <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                        {product.price} <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>₪</span>
                      </span>
                    </div>

                    <button 
                      className="btn-accent"
                      onClick={() => handleOpenOrderModal(product)}
                      style={{ padding: '0.6rem 1.1rem', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}
                    >
                      <ShoppingCartIcon size={16} />
                      <span>اطلب الآن</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Guest Order Modal */}
      {orderingProduct && !orderSuccess && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="ui-panel animate-up" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShoppingCartIcon className="gradient-text" size={24} />
                <h2 className="title-md" style={{ fontSize: '1.2rem', margin: 0 }}>تأكيد طلب الشراء</h2>
              </div>
              <button className="btn-circle" onClick={() => setOrderingProduct(null)}>
                <CloseIcon />
              </button>
            </div>

            {/* Selected Item Card Preview */}
            <div style={{
              background: 'var(--bg-surface)', padding: '1rem',
              borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
              display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem'
            }}>
              {orderingProduct.image_url ? (
                <img 
                  src={orderingProduct.image_url} 
                  alt={orderingProduct.name} 
                  style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <ShoppingBagIcon size={24} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '700' }}>{orderingProduct.name}</h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
                  {orderingProduct.price} ₪ للقطعة
                </span>
              </div>
            </div>

            {formError && (
              <div style={{
                background: 'rgba(255, 23, 68, 0.1)', border: '1px solid rgba(255, 23, 68, 0.3)',
                color: '#ff1744', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                fontSize: '0.85rem', textAlign: 'center'
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleConfirmOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Quantity Selector */}
              <div className="form-group">
                <label className="form-label">الكمية المطلوبة</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    className="btn-subtle" 
                    onClick={() => setOrderQty(q => Math.max(1, q - 1))}
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: '700' }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', width: '40px', textAlign: 'center' }}>
                    {orderQty}
                  </span>
                  <button 
                    type="button" 
                    className="btn-subtle" 
                    onClick={() => setOrderQty(q => q + 1)}
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: '700' }}
                  >
                    +
                  </button>

                  <div style={{ marginRight: 'auto', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>المجموع الكلي</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                      {orderingProduct.price * orderQty} ₪
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="form-group">
                <label className="form-label">الاسم الكامل</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    required 
                    className="form-control" 
                    placeholder="مثال: أحمد محمود"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <div style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                    <UserIcon size={16} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">رقم الهاتف للتواصل للتوصيل</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="tel" 
                    required 
                    className="form-control" 
                    placeholder="059XXXXXXXX أو 056XXXXXXXX"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <div style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                    <PhoneIcon size={16} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">العنوان أو المنطقة التفصيلية</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    required 
                    className="form-control" 
                    placeholder="مثال: نابلس - رفيديا شارع الجامعة"
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <div style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}>
                    <MapPinIcon size={16} />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-accent" 
                disabled={isSubmitting}
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
              >
                {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد وإرسال الطلب 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Confirmation Modal */}
      {orderSuccess && lastOrderDetails && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="ui-panel animate-up" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(0, 230, 118, 0.15)', border: '1px solid rgba(0, 230, 118, 0.4)',
              color: '#00e676', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <CheckCircleIcon size={36} />
            </div>

            <h2 className="title-md" style={{ color: '#00e676', fontSize: '1.4rem' }}>تم إرسال طلبك بنجاح! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              شكراً لك يا <strong>{lastOrderDetails.guest_name}</strong>. سيتواصل معك كابتن النادي لتسليم طلبك.
            </p>

            <div style={{
              background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)', margin: '1.25rem 0', textAlign: 'right', fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>المنتج:</span>
                <span style={{ fontWeight: '700' }}>{lastOrderDetails.product_name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>الكمية:</span>
                <span style={{ fontWeight: '700' }}>{lastOrderDetails.quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>رقم التواصل:</span>
                <span style={{ fontWeight: '700' }}>{lastOrderDetails.guest_phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-dim)' }}>المبلغ الإجمالي:</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '1rem' }}>{lastOrderDetails.total_price} ₪</span>
              </div>
            </div>

            <button 
              className="btn-accent" 
              onClick={() => { setOrderingProduct(null); setOrderSuccess(false); }}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              متابعة التصفح 🛒
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default GuestStorePage;
