import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { DeliveryProvider } from '@starcoex-frontend/delivery';
import { LoadingSpinner } from '@starcoex-frontend/common';
import { DriverLayout } from './driver-layout';

const ALLOWED_ROLES = ['DELIVERY', 'ADMIN', 'SUPER_ADMIN'];

export function DriverWithProvider() {
  const navigate = useNavigate();
  const { currentUser, initialized } = useAuth();

  useEffect(() => {
    if (!initialized) return;
    if (currentUser && !ALLOWED_ROLES.includes(currentUser.role ?? '')) {
      navigate('/admin', { replace: true });
    }
  }, [initialized, currentUser, navigate]);

  if (!initialized) {
    return <LoadingSpinner message="권한을 확인하는 중..." />;
  }

  if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role ?? '')) {
    return null;
  }

  // delivery-with-provider.tsx 패턴 동일 — Provider로 감싸고 Layout 렌더
  return (
    <DeliveryProvider>
      <DriverLayout />
    </DeliveryProvider>
  );
}
