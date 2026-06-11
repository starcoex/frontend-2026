import React, { useEffect } from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { MembershipCard } from '@/app/pages/dashboard/components/membership-card';
import { ProfileSummary } from '@/app/pages/dashboard/components/profile-summary';
import { useContacts } from '@starcoex-frontend/contact';
import { MyOrdersSection } from '@/app/pages/dashboard/sections/my-orders-section';
import { useOrders } from '@starcoex-frontend/orders';
import { MyContactsSection } from '@/app/pages/dashboard/sections/my-contacts-section';
import { MyApplicationsSection } from '@/app/pages/dashboard/sections/my-applications-section';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { orders, fetchOrders } = useOrders();
  const { contacts, fetchMyContacts } = useContacts();

  useEffect(() => {
    fetchOrders(5, 0);
    fetchMyContacts(5, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* 1) 멤버십 현황 - 훅 내부에서 직접 사용 */}
      <MembershipCard />

      {/* 2) 최근 주문 내역 */}
      <MyOrdersSection orders={orders} />

      {/* 3) 내 문의 내역 */}
      <MyContactsSection contacts={contacts} />

      {/* 4) 내 채용 지원 현황 */}
      <MyApplicationsSection />

      {/* 5) 계정 정보 */}
      <ProfileSummary user={currentUser} />
    </div>
  );
};

export default DashboardPage;
