import React, { useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { StarLogo } from '@starcoex-frontend/common';
import { PUBLIC_AUTH_ROUTES } from '@/app/constants/public-auth-routes';

export const AuthLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, initialized, checkAuthStatus } = useAuth();

  // ✅ 현재 경로가 공개 페이지인지 확인
  const isPublicRoute = PUBLIC_AUTH_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  // 1) 아직 인증 초기화가 되지 않았다면, 한 번만 서버에 상태 확인 요청
  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.warn('인증 상태 확인 실패:', error);
      });
    }
  }, [initialized, checkAuthStatus]);

  // 2) 초기화 중이거나 로딩 중이면 로딩 UI
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">인증 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 3) ✅ 공개 페이지는 인증 여부와 상관없이 접근 허용
  if (isPublicRoute) {
    return (
      <div className="bg-primary-foreground container grid h-svh flex-col items-center justify-center sm:max-w-none md:max-w-none lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <div className="mb-4 flex items-center justify-center">
            <Link to="/" className="inline-flex items-center justify-center">
              <StarLogo
                format="png"
                width={20}
                height={20}
                className="w-12 h-12 object-contain"
              />
            </Link>
            <div>
              <h1 className="text-2xl xl:text-3xl font-bold">Starcoex</h1>
              <p className="text-muted-foreground text-center text-sm xl:text-base">
                비즈니스 플랫폼
              </p>
            </div>
          </div>
          {/* 공개 페이지 렌더링 */}
          <Outlet />
        </div>
      </div>
    );
  }

  // 4) 이미 인증된 사용자는 로그인/회원가입 페이지에 접근 불가 → /admin으로 리디렉션
  if (isAuthenticated === true) {
    const from = location.state?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  // 5) 비로그인 상태이면 실제 Auth 페이지(로그인/회원가입 등)를 렌더
  return (
    <div className="bg-primary-foreground container grid h-svh flex-col items-center justify-center sm:max-w-none md:max-w-none lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
        <div className="mb-4 flex items-center justify-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <StarLogo
              format="png"
              width={20}
              height={20}
              className="w-12 h-12 object-contain"
            />
          </Link>
          <div>
            <h1 className="text-2xl xl:text-3xl font-bold">Starcoex</h1>
            <p className="text-muted-foreground text-center text-sm xl:text-base">
              비즈니스 플랫폼
            </p>
          </div>
        </div>
        {/* 로그인/회원가입 등의 실제 페이지가 Outlet 로 주입 */}
        <Outlet />
      </div>
    </div>
  );
};
