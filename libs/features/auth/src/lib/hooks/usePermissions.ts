import { useCallback } from 'react';
import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { currentUser } = useAuth();

  // 관리자 여부 (ADMIN 또는 SUPER_ADMIN)
  const isAdmin = useCallback(() => {
    return currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';
  }, [currentUser]);

  // 슈퍼 관리자 여부
  const isSuperAdmin = useCallback(() => {
    return currentUser?.role === 'SUPER_ADMIN';
  }, [currentUser]);

  // 사업자 여부
  const isBusiness = useCallback(() => {
    return currentUser?.hasBusiness === true;
  }, [currentUser]);

  // 배달원 여부
  const isDelivery = useCallback(() => {
    return currentUser?.role === 'DELIVERY';
  }, [currentUser]);

  // 이메일 인증 여부 (User 타입 구조에 따라 경로 수정 필요. 보통 activation.emailVerified)
  const isEmailVerified = useCallback(() => {
    return !!currentUser?.emailVerified;
  }, [currentUser]);

  // 휴대폰 인증 여부
  const isPhoneVerified = useCallback(() => {
    // phoneNumber가 있고, (만약 별도 flag가 있다면 그것을 확인)
    // 여기서는 전화번호가 존재하면 인증된 것으로 간주하거나, verified 필드를 확인
    return !!currentUser?.phoneNumber;
    // 만약 별도 필드가 있다면: return !!currentUser?.activation?.phoneVerified;
  }, [currentUser]);

  // 사업자 인증 여부
  const isBusinessVerified = useCallback(() => {
    return !!currentUser?.hasBusiness;
    // 또는 role이 BUSINESS이고 승인된 상태인지 확인
  }, [currentUser]);

  // 2FA 활성화 여부
  const is2FAEnabled = useCallback(() => {
    return !!currentUser?.activation?.twoFactorActivated;
  }, [currentUser]);

  return {
    isAdmin,
    isSuperAdmin,
    isBusiness,
    isDelivery,
    isEmailVerified,
    isPhoneVerified,
    isBusinessVerified,
    is2FAEnabled,
  };
};
