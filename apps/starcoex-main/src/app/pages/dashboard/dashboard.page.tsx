import React, { useEffect } from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { usePermissions } from '@starcoex-frontend/auth';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { WelcomeBanner } from '@/app/pages/dashboard/components/welcome-banner';
import { AlertBanner } from '@/app/pages/dashboard/components/alert-banner';
import { MembershipCard } from '@/app/pages/dashboard/components/membership-card';
import { ServiceShortcuts } from '@/app/pages/dashboard/components/service-shortcuts';
import { ProfileSummary } from '@/app/pages/dashboard/components/profile-summary';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { isEmailVerified, isPhoneVerified, isIdentityVerified, is2FAEnabled } =
    usePermissions();
  const {
    membership,
    fetchMembershipConfig,
    currentTierDisplayName,
    availableStars, // ✅ totalStars → availableStars
    tierStars, // ✅ 등급 내 별 추가
    tierProgress,
    starsToNextTier,
    starsToNextCoupon,
    couponProgress,
    exchangeableCoupons,
  } = useLoyalty();

  // 멤버십 설정(등급 기준 등) 최초 1회 로드
  useEffect(() => {
    fetchMembershipConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* 1) 인사 배너 */}
      <WelcomeBanner
        userName={currentUser.name ?? '고객'}
        tier={currentTierDisplayName}
      />

      {/* 2) 미인증 경고 배너 */}
      <AlertBanner
        isEmailVerified={isEmailVerified()}
        isPhoneVerified={isPhoneVerified()}
        is2FAEnabled={is2FAEnabled()}
        isIdentityVerified={isIdentityVerified()}
        userType={currentUser.userType}
      />

      {/* 3) 멤버십 현황 — 핵심 정보 */}
      <MembershipCard
        tier={currentTierDisplayName}
        availableStars={availableStars}
        tierStars={tierStars}
        tierProgress={tierProgress}
        starsToNextTier={starsToNextTier}
        starsToNextCoupon={starsToNextCoupon}
        couponProgress={couponProgress}
        exchangeableCoupons={exchangeableCoupons}
        membership={membership}
      />

      {/* 4) 서비스 바로가기 */}
      <ServiceShortcuts />

      {/* 5) 내 계정 정보 */}
      <ProfileSummary user={currentUser} />
    </div>
  );
};

export default DashboardPage;
