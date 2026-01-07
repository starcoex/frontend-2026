import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Truck, Shield, Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { LoadingPage } from '@starcoex-frontend/common';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles = [],
  redirectTo = '/auth/login',
}) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-900/10 dark:via-amber-900/10 dark:to-gray-900">
        <LoadingPage message="인증 확인 중..." />
      </div>
    );
  }

  // 미인증 사용자
  if (!isAuthenticated || !currentUser) {
    // 현재 페이지를 state로 전달 (쿼리 파라미터 대신 사용)
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 역할 기반 접근 제어
  if (requiredRoles.length > 0) {
    const currentUserRoles = currentUser.role;

    if (!currentUserRoles) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-900/10 dark:via-amber-900/10 dark:to-gray-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-200 dark:border-red-800">
              <Shield className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-3">
              접근 권한 없음
            </h2>
            <p className="text-orange-700 dark:text-orange-300 mb-6 leading-relaxed">
              난방유 배달 서비스의 이 페이지에 접근할 권한이 없습니다.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                이전 페이지로 돌아가기
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full px-6 py-3 border-2 border-orange-300 text-orange-700 dark:text-orange-300 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 font-medium"
              >
                메인 페이지로 이동
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // 사업자 회원 체크 (필요한 경우)
  if (currentUser.userType === 'INDIVIDUAL') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-900/10 dark:via-amber-900/10 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-200 dark:border-blue-800">
            <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-orange-900 dark:text-orange-100">
                난방유 배달
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-2">
              사업자 회원
            </h2>
          </div>
          <p className="text-orange-700 dark:text-orange-300 mb-6 leading-relaxed">
            사업자 회원님은 스타코엑스 통합 관리자 시스템을 이용해주세요.
            <br />
            <span className="text-sm text-orange-600 dark:text-orange-400 mt-2 block">
              대량 주문, 법인 계약, 정산 관리 등 다양한 서비스를 제공합니다.
            </span>
          </p>
          <div className="space-y-3">
            <button
              onClick={() =>
                window.open('https://admin.starcoex.com', '_blank')
              }
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
            >
              <Building2 className="w-4 h-4" />
              관리자 시스템으로 이동 →
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 border-2 border-orange-300 text-orange-700 dark:text-orange-300 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 font-medium"
            >
              이전 페이지로 돌아가기
            </button>
          </div>

          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-xs text-orange-600 dark:text-orange-400">
              💡 관리자 시스템에서는 배송 스케줄 관리, 드라이버 배정, 실시간
              배송 추적 등의 기능을 이용하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
