import React from 'react';
import {
  CouponList,
  MembershipCard,
  CouponHistory,
  PageHead,
} from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';

export const CouponsPage: React.FC = () => {
  return (
    <>
      <PageHead
        title="내 쿠폰 - 별표주유소"
        description="보유 쿠폰 확인 및 관리"
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/dashboard/coupons`}
      />

      <div className="space-y-6">
        {/* 멤버십 현황 카드 */}
        <MembershipCard />

        {/* 쿠폰 목록 */}
        <CouponList />

        {/* 이용 내역 */}
        <CouponHistory maxItems={5} />
      </div>
    </>
  );
};
