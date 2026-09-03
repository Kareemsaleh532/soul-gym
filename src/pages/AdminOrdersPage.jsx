import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBagIcon, TrashIcon, PhoneIcon, MapPinIcon, RefreshIcon } from '../components/common/Icons';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('الكل');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      if (supabase) {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      }
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('خطأ أثناء تحديث الحالة: ' + err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      if (supabase) {
        await supabase.from('orders').delete().eq('id', orderId);
      }
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      alert('خطأ أثناء الحذف: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'الكل') return true;
    return o.status === statusFilter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'جديد': return { bg: 'rgba(255, 71, 26, 0.15)', color: 'var(--accent-primary)', border: 'rgba(255, 71, 26, 0.3)' };
      case 'قيد المعالجة': return { bg: 'rgba(255, 179, 0, 0.15)', color: '#ffb300', border: 'rgba(255, 179, 0, 0.3)' };
      case 'تم التوصيل': return { bg: 'rgba(0, 230, 118, 0.15)', color: '#00e676', border: 'rgba(0, 230, 118, 0.3)' };
      case 'ملغي': return { bg: 'rgba(255, 23, 68, 0.15)', color: '#ff1744', border: 'rgba(255, 23, 68, 0.3)' };
      default: return { bg: 'var(--bg-surface)', color: 'var(--text-muted)', border: 'var(--border-subtle)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="title-md">طلبات الشراء من المتجر</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>استعرض الطلبات القادمة من زوار صفحة المتجر وتواصل معهم للتسليم</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select 
            className="form-control" 
            style={{ width: '160px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="الكل">كل الحالات</option>
            <option value="جديد">الطلبات الجديدة</option>
            <option value="قيد المعالجة">قيد المعالجة</option>
            <option value="تم التوصيل">تم التوصيل</option>
            <option value="ملغي">الطلبات الملغية</option>
          </select>

          <button className="btn-subtle" onClick={fetchOrders} title="تحديث الطلبات">
            <RefreshIcon />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>جاري جلب الطلبات...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="ui-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <ShoppingBagIcon size={44} className="gradient-text" />
          <h3 style={{ marginTop: '1rem' }}>لا توجد طلبات شراء حالياً</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>أي طلب شراء يتم إرساله من صفحة الزوار يظهر هنا فوراً.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredOrders.map(order => {
            const badgeStyle = getStatusBadgeClass(order.status);
            return (
              <div 
                key={order.id} 
                className="ui-panel animate-up" 
                style={{ 
                  padding: '1.25rem 1.5rem', 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1.25rem',
                  alignItems: 'center'
                }}
              >
                {/* Guest Contact Details */}
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{order.guest_name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                    <PhoneIcon size={14} />
                    <a 
                      href={`tel:${order.guest_phone}`} 
                      style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: '700', textDecoration: 'none' }}
                    >
                      {order.guest_phone}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <MapPinIcon size={14} />
                    <span>{order.guest_address}</span>
                  </div>
                </div>

                {/* Product Summary */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>المنتج والكمية</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>{order.product_name}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                    الكمية: {order.quantity} قطعة
                  </span>
                </div>

                {/* Total Price */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>المبلغ الإجمالي</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                    {order.total_price} ₪
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '0.2rem' }}>
                    {new Date(order.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Status Dropdown & Delete */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <select 
                    value={order.status || 'جديد'} 
                    onChange={e => handleUpdateStatus(order.id, e.target.value)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '100px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      background: badgeStyle.bg,
                      color: badgeStyle.color,
                      border: `1px solid ${badgeStyle.border}`,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="جديد" style={{ background: '#18181b', color: 'white' }}>جديد</option>
                    <option value="قيد المعالجة" style={{ background: '#18181b', color: 'white' }}>قيد المعالجة</option>
                    <option value="تم التوصيل" style={{ background: '#18181b', color: 'white' }}>تم التوصيل</option>
                    <option value="ملغي" style={{ background: '#18181b', color: 'white' }}>ملغي</option>
                  </select>

                  <button className="btn-circle" onClick={() => handleDeleteOrder(order.id)} style={{ color: '#ff1744', width: '36px', height: '36px' }}>
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
