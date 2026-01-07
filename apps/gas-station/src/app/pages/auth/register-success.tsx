import React, { useState, useEffect } from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { WelcomeRewardsModal } from '@starcoex-frontend/common';

export const RegisterSuccessHandler: React.FC = () => {
  const { currentUser } = useAuth();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // 신규 가입자인지 확인 (예: URL 파라미터, 세션 스토리지 등)
    const isNewUser = sessionStorage.getItem('is_new_registration') === 'true';

    if (isNewUser && currentUser) {
      setShowWelcomeModal(true);
      sessionStorage.removeItem('is_new_registration');
    }
  }, [currentUser]);

  return (
    <WelcomeRewardsModal
      open={showWelcomeModal}
      onClose={() => setShowWelcomeModal(false)}
      userName={currentUser?.name || ''}
      welcomeStars={5}
      welcomeCouponName="프리미엄 세차권"
    />
  );
};
