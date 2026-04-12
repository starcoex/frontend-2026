import { useCallback, useEffect, useState } from 'react';
import { LoadingSpinner, PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import { User } from 'lucide-react';
import { DriverAvailabilityCard } from './components/driver-availability-card';
import { DriverProfileForm } from './components/driver-profile-form';

export default function DriverProfilePage() {
  const { fetchMyDriverProfile, isLoading, error } = useDelivery();
  const [myProfile, setMyProfile] = useState<DeliveryDriver | null>(null);

  useEffect(() => {
    fetchMyDriverProfile().then((res) => {
      if (res.success && res.data) {
        setMyProfile(res.data);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 수정/토글 후 로컬 상태 즉시 반영
  const handleUpdated = useCallback((updated: DeliveryDriver) => {
    setMyProfile(updated);
  }, []);

  if (isLoading && !myProfile) {
    return <LoadingSpinner message="프로필을 불러오는 중..." />;
  }

  if (!myProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <User className="text-muted-foreground mb-3 h-12 w-12" />
        <p className="text-muted-foreground text-sm">
          {error ?? '프로필 정보를 찾을 수 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`내 프로필 - ${COMPANY_INFO.name}`}
        description="프로필 정보를 수정하고 가용 상태를 변경하세요."
        keywords={['내 프로필', '가용 상태', '배달기사', COMPANY_INFO.name]}
        og={{
          title: `내 프로필 - ${COMPANY_INFO.name}`,
          description: '배달기사 프로필 관리',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 가용 상태 + 통계 카드 — 항상 상단 고정 */}
        <DriverAvailabilityCard driver={myProfile} onUpdated={handleUpdated} />

        {/* 프로필 수정 폼 */}
        <DriverProfileForm driver={myProfile} onUpdated={handleUpdated} />
      </div>
    </>
  );
}
