import React from 'react';
import EmptyState from '../components/common/EmptyState';

const NotificationsPage = ({ notifications = [], onRenew, onRefresh, isNotifLoading }) => {
  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="title-md">تنبيهات الاشتراكات</h2>
        <button className="btn-subtle" onClick={onRefresh} disabled={isNotifLoading}>
          مزامنة التنبيهات
        </button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState 
          title="لا توجد تنبيهات جديدة" 
          description="جميع الاشتراكات الحالية محدثة ولا توجد أي اشتراكات منتهية تحتاج لاتخاذ إجراء." 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map(member => (
            <div 
              key={member.id} 
              className="ui-panel animate-up" 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRight: '4px solid #ff1744'
              }}
            >
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>انتهى اشتراك {member.name}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  انتهى في {new Date(member.subscription_end).toLocaleDateString('ar-EG')}
                </span>
              </div>
              <button className="btn-accent" onClick={() => onRenew(member)}>
                جدد الآن
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
