import React, { useState } from 'react';
import StatCard from '../components/common/StatCard';
import MemberCard from '../components/members/MemberCard';
import EmptyState from '../components/common/EmptyState';
import { GridViewIcon, ListViewIcon } from '../components/common/Icons';

const AdminDashboardPage = ({
  stats,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  paginatedMembers,
  filteredMembers,
  isLoading,
  page,
  setPage,
  itemsPerPage,
  onOpenModal,
  onDeleteMember
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard label="إجمالي الأعضاء" value={stats.total} active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
        <StatCard label="النشطون الآن" value={stats.active} color="#00e676" active={statusFilter === 'active'} onClick={() => setStatusFilter('active')} />
        <StatCard label="ينتهي قريبًا" value={stats.expiring} color="#ffb300" active={statusFilter === 'warning'} onClick={() => setStatusFilter('warning')} />
        <StatCard label="الاشتراكات المنتهية" value={stats.expired} color="#ff1744" active={statusFilter === 'expired'} onClick={() => setStatusFilter('expired')} />
      </div>

      {/* Control Bar & Filter Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="title-md">دليل الأعضاء</h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select className="form-control" style={{ width: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">كل الحالات</option>
            <option value="active">النشطون فقط</option>
            <option value="warning">ينتهي قريبًا</option>
            <option value="expired">المنتهية فقط</option>
          </select>

          {/* Grid vs Table View Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
            <button 
              className="btn-circle" 
              onClick={() => setViewMode('grid')}
              style={{ width: '34px', height: '34px', borderRadius: '8px', background: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent', color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              <GridViewIcon />
            </button>
            <button 
              className="btn-circle" 
              onClick={() => setViewMode('table')}
              style={{ width: '34px', height: '34px', borderRadius: '8px', background: viewMode === 'table' ? 'var(--bg-card)' : 'transparent', color: viewMode === 'table' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              <ListViewIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Members Listing */}
      {isLoading ? (
        <EmptyState title="جاري تحميل البيانات..." description="يرجى الانتظار بينما نقوم بمزامنة الأعضاء من قاعدة البيانات." />
      ) : paginatedMembers.length === 0 ? (
        <EmptyState 
          title="لا يوجد أعضاء مطابقون" 
          description="لم نتمكن من العثور على أي نتائج مطابقة للبحث أو تصفية الحالات الحالية." 
          onAction={onOpenModal} 
          actionLabel="+ تسجيل عضو جديد" 
        />
      ) : (
        <div className={viewMode === 'grid' ? 'grid-layout' : 'table-layout'}>
          {paginatedMembers.map(m => (
            <MemberCard key={m.id} member={m} onEdit={onOpenModal} onDelete={onDeleteMember} viewMode={viewMode} language="ar" />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredMembers.length > itemsPerPage && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn-subtle" disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>
            السابق
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            صفحة {page} من {Math.ceil(filteredMembers.length / itemsPerPage)}
          </span>
          <button className="btn-subtle" disabled={page >= Math.ceil(filteredMembers.length / itemsPerPage)} onClick={() => setPage(p => p + 1)}>
            التالي
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
