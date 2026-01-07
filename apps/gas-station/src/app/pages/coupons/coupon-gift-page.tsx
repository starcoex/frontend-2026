import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHead, CouponGiftForm } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { RewardCoupon } from '@starcoex-frontend/graphql';
import { useLoyalty } from '@starcoex-frontend/loyalty';

export const CouponGiftPage: React.FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code?: string }>();
  const { coupons, fetchMyCoupons } = useLoyalty();
  const [preselectedCoupon, setPreselectedCoupon] = useState<
    RewardCoupon | undefined
  >();

  // code가 있으면 해당 쿠폰을 찾아서 preselect
  useEffect(() => {
    if (code) {
      // 이미 쿠폰 목록이 있으면 찾기
      const found = coupons.find(
        (c) => c.code === code && c.status === 'ACTIVE'
      );
      if (found) {
        setPreselectedCoupon(found);
      } else {
        // 쿠폰 목록이 없으면 먼저 로드
        fetchMyCoupons().then(() => {
          const coupon = coupons.find(
            (c) => c.code === code && c.status === 'ACTIVE'
          );
          setPreselectedCoupon(coupon);
        });
      }
    }
  }, [code, coupons, fetchMyCoupons]);

  return (
    <>
      <PageHead
        title="쿠폰 선물하기 - 별표주유소"
        description="친구에게 쿠폰을 선물하세요"
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/dashboard/coupons/gift`}
      />

      <div className="max-w-md mx-auto">
        <CouponGiftForm
          coupon={preselectedCoupon}
          onBack={() => navigate('/dashboard/coupons')}
          onSuccess={() => navigate('/dashboard/coupons')}
        />
      </div>
    </>
  );
};
