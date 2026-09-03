import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PlusIcon, TrashIcon, EditIcon, PackageIcon, CloseIcon } from '../components/common/Icons';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'بروتينات',
    price: '',
    image_url: '',
    description: '',
    in_stock: true
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        image_url: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category || 'بروتينات',
        price: product.price || '',
        image_url: product.image_url || '',
        description: product.description || '',
        in_stock: product.in_stock !== false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'بروتينات',
        price: '',
        image_url: '',
        description: '',
        in_stock: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productPayload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        description: formData.description,
        in_stock: formData.in_stock
      };

      if (editingProduct) {
        if (supabase) {
          await supabase.from('products').update(productPayload).eq('id', editingProduct.id);
        }
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productPayload } : p));
      } else {
        if (supabase) {
          const { data, error } = await supabase.from('products').insert([productPayload]).select().single();
          if (!error && data) {
            setProducts(prev => [data, ...prev]);
          } else {
            setProducts(prev => [{ id: Date.now(), ...productPayload }, ...prev]);
          }
        } else {
          setProducts(prev => [{ id: Date.now(), ...productPayload }, ...prev]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('خطأ أثناء حفظ المنتج: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج من المتجر؟')) return;
    try {
      if (supabase) {
        await supabase.from('products').delete().eq('id', id);
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('خطأ أثناء الحذف: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="title-md">إدارة منتجات المتجر</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>أضف البروتينات والمكملات مع رفع صورها مباشرة لتظهر في متجر الزوار</span>
        </div>

        <button className="btn-accent" onClick={() => handleOpenModal()} style={{ padding: '0.65rem 1.25rem' }}>
          <PlusIcon />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>جاري تحميل المنتجات...</div>
      ) : products.length === 0 ? (
        <div className="ui-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <PackageIcon size={48} className="gradient-text" />
          <h3 style={{ marginTop: '1rem' }}>لا توجد منتجات حالياً</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>اضغط على زر "إضافة منتج جديد" لرفع المكملات وصورها وسوف تظهر مباشرة في متجر الزوار.</p>
          <button className="btn-accent" onClick={() => handleOpenModal()} style={{ marginTop: '1.25rem' }}>
            <PlusIcon />
            <span>إضافة أول منتج للمتجر 🚀</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {products.map(p => (
            <div key={p.id} className="ui-panel animate-up" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ position: 'relative', height: '180px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#0a0a0c' }}>
                {p.image_url ? (
                  <img 
                    src={p.image_url} 
                    alt={p.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                    <PackageIcon size={40} />
                  </div>
                )}
                <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(18, 18, 20, 0.85)', padding: '2px 8px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
                  {p.category}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>{p.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  {p.description || 'بدون وصف تفصيلي.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{p.price} ₪</span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-circle" onClick={() => handleOpenModal(p)} style={{ width: '34px', height: '34px' }}>
                    <EditIcon size={14} />
                  </button>
                  <button className="btn-circle" onClick={() => handleDelete(p.id)} style={{ width: '34px', height: '34px', color: '#ff1744' }}>
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal with Image File Upload */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="ui-panel animate-up" style={{ width: '100%', maxWidth: '480px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="title-md" style={{ margin: 0 }}>{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}</h3>
              <button className="btn-circle" onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">اسم المنتج</label>
                <input 
                  type="text" 
                  required 
                  className="form-control" 
                  placeholder="مثال: واي بروتين إيزوليت 2kg" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">التصنيف</label>
                <select className="form-control" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  <option value="بروتينات">بروتينات</option>
                  <option value="كرياتين ومحفزات">كرياتين ومحفزات</option>
                  <option value="أحماض أمينية">أحماض أمينية</option>
                  <option value="طاقة وتمرين">طاقة وتمرين</option>
                  <option value="إكسسوارات">إكسسوارات ومستلزمات</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">السعر بالشيقل (₪)</label>
                <input 
                  type="number" 
                  required 
                  step="1" 
                  className="form-control" 
                  placeholder="250" 
                  value={formData.price} 
                  onChange={e => setFormData({ ...formData, price: e.target.value })} 
                />
              </div>

              {/* Upload Image File Input */}
              <div className="form-group">
                <label className="form-label">صورة المنتج (رفع ملف من جهازك 📷)</label>
                
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{
                    display: 'block', width: '100%', padding: '0.6rem',
                    background: 'var(--bg-surface)', border: '1px dashed var(--accent-primary)',
                    borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                />

                {/* Preview Box */}
                {formData.image_url && (
                  <div style={{ marginTop: '0.75rem', textAlign: 'center', position: 'relative' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.25rem' }}>معاينة الصورة المختارة:</span>
                    <img 
                      src={formData.image_url} 
                      alt="معاينة" 
                      style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">الوصف التفصيلي للمنتج</label>
                <textarea 
                  className="form-control" 
                  rows={3} 
                  placeholder="اكتب فوائد المنتج أو مكوناته..." 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn-subtle" onClick={() => setIsModalOpen(false)}>إلغاء</button>
                <button type="submit" className="btn-accent">حفظ ونشر المنتج 🚀</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
