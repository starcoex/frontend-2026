import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHead, CouponExchange } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';

export const CouponExchangePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHead
        title="쿠폰 교환 - 별표주유소"
        description="별을 쿠폰으로 교환하세요"
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/dashboard/coupons/exchange`}
      />

      <div className="max-w-md mx-auto">
        <CouponExchange
          onBack={() => navigate('/dashboard/coupons')}
          onSuccess={() => navigate('/dashboard/coupons')}
        />
      </div>
    </>
  );
};
