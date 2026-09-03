import React from 'react';
import DigitalPass from '../components/portal/DigitalPass';
import CheckInWidget from '../components/portal/CheckInWidget';
import { LogoutIcon } from '../components/common/Icons';

const MemberPortalPage = ({
  sessionUser,
  memberProfile,
  onLogout,
  onSelfCheckIn,
  isCheckingIn,
  checkInSuccessShow,
  checkInHistory
}) => {
  return (
    <div dir="rtl" className="layout-wrapper" style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="title-lg">أهلاً بك، {sessionUser?.user_metadata?.name || 'عضو الرياضة'} 👋</h1>
            <p className="subtitle">تابع تفاصيل اشتراكك وسجل حضورك اليومي بنقرة واحدة</p>
          </div>
          <button className="btn-subtle" onClick={onLogout}>
            <LogoutIcon />
            <span>تسجيل الخروج</span>
          </button>
        </header>

        <DigitalPass memberProfile={memberProfile} sessionUser={sessionUser} />

        <CheckInWidget 
          onSelfCheckIn={onSelfCheckIn} 
          isCheckingIn={isCheckingIn} 
          checkInSuccessShow={checkInSuccessShow} 
          checkInHistory={checkInHistory} 
        />
      </div>
    </div>
  );
};

export default MemberPortalPage;
