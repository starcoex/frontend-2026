import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Receipt, Ticket, Crown, User } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { MyPageLayout, MyPageTab } from '@starcoex-frontend/common';
import { OverviewTab } from './tabs/overview-tab';
import { OrdersTab } from './tabs/orders-tab';
import { CouponsTab } from './tabs/coupons-tab';
import { MembershipTab } from './tabs/membership-tab';
import { MyInfoTab } from './tabs/my-info-tab';

export const MyPage: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 탭 파라미터 읽기
  const activeTab = searchParams.get('tab') || 'overview';

  // 탭 변경 핸들러
  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  // 탭 구성 (star-oil 전용)
  const tabs: MyPageTab[] = useMemo(
    () => [
      {
        id: 'overview',
        label: '개요',
        icon: LayoutDashboard,
        content: <OverviewTab user={currentUser} />,
      },
      {
        id: 'orders',
        label: '주문내역',
        icon: Receipt,
        content: <OrdersTab />,
      },
      {
        id: 'coupons',
        label: '쿠폰함',
        icon: Ticket,
        badge: 3, // TODO: 실제 쿠폰 개수로 변경
        content: <CouponsTab />,
      },
      {
        id: 'membership',
        label: '멤버십',
        icon: Crown,
        content: <MembershipTab user={currentUser} />,
      },
      {
        id: 'info',
        label: '내 정보',
        icon: User,
        content: <MyInfoTab />,
      },
    ],
    [currentUser]
  );

  return (
    <MyPageLayout
      user={currentUser}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      title="마이페이지"
      accentColor="orange" // star-oil 브랜드 컬러
      isLoading={isLoading}
    />
  );
};
