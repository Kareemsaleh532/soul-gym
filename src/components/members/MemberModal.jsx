import React from 'react';
import { CloseIcon } from '../common/Icons';

const MemberModal = ({ 
  isOpen, 
  onClose, 
  editingMember, 
  formData, 
  setFormData, 
  handleSubmit, 
  phoneError 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="title-md">{editingMember ? 'تحديث الاشتراك' : 'تسجيل عضو جديد'}</h3>
          <button className="btn-circle" onClick={onClose} style={{ width: '36px', height: '36px' }}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group">
            <label className="form-label">اسم العضو</label>
            <input 
              type="text" required className="form-control" 
              placeholder="أدخل الاسم..." 
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">رقم الهاتف (056 أو 059)</label>
            <input 
              type="tel" className="form-control" 
              placeholder="05xXXXXXXX" 
              value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            />
            {phoneError && <span style={{ color: '#ff1744', fontSize: '0.8rem' }}>{phoneError}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">نوع الاشتراك</label>
            <select className="form-control" value={formData.plan_type} onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}>
              <option value="Basic Plan">الخطة الأساسية (Basic)</option>
              <option value="Pro Membership">اشتراك برو (Pro)</option>
              <option value="Elite Training">تدريب النخبة (Elite)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{editingMember ? 'تمديد الاشتراك' : 'تحديد المدة'}</label>
            <select className="form-control" value={formData.duration_months} onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}>
              {editingMember && <option value="0">بدون تمديد</option>}
              <option value="1">+ شهر واحد</option>
              <option value="2">+ شهرين</option>
              <option value="3">+ 3 أشهر</option>
              <option value="6">+ 6 أشهر</option>
              <option value="12">+ سنة</option>
            </select>
          </div>

          <button type="submit" className="btn-accent" style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem' }}>
            {editingMember ? 'حفظ التغييرات' : 'تفعيل الاشتراك'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
