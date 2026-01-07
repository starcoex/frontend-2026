import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHead, CouponDetail } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';

export const CouponDetailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHead
        title="쿠폰 상세 - 별표주유소"
        description="쿠폰 상세 정보 및 QR 코드"
        siteName={APP_CONFIG.seo.siteName}
      />

      <div className="max-w-md mx-auto">
        <CouponDetail
          onBack={() => navigate('/dashboard/coupons')}
          onGift={(code) => navigate(`/dashboard/coupons/gift/${code}`)}
        />
      </div>
    </>
  );
};
