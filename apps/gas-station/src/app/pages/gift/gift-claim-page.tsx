import React from 'react';
import { PageHead, CouponGiftClaim } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';

export const GiftClaimPage: React.FC = () => {
  return (
    <>
      <PageHead
        title="선물 받기 - 별표주유소"
        description="선물로 받은 쿠폰을 수령하세요"
        siteName={APP_CONFIG.seo.siteName}
      />

      <div className="container py-8">
        <CouponGiftClaim />
      </div>
    </>
  );
};
