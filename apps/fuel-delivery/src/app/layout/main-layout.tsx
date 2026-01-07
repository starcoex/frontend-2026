import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { PortalConnectionBanner } from '@/components/common/portal-connection-banner';
import { SeasonalNotice } from '@/components/common/seasonal-notice';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { QuickActionFab } from '@/components/common/quick-action-fab';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();

  // 페이지별 배경색 설정 (배송 앱 테마)
  const getPageBackgroundClass = () => {
    if (location.pathname === '/') {
      return 'bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900';
    }
    if (location.pathname.startsWith('/auth')) {
      return 'bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-gray-800';
    }
    if (location.pathname.startsWith('/order')) {
      return 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20';
    }
    if (location.pathname.startsWith('/tracking')) {
      return 'bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20';
    }
    if (location.pathname.startsWith('/profile')) {
      return 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
    }
    return 'bg-gray-50 dark:bg-gray-900';
  };

  // 계절별 알림 표시 조건
  const shouldShowSeasonalNotice = () => {
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const isWinterSeason = [11, 12, 1, 2, 3].includes(currentMonth);

    // 겨울철에는 성수기 안내, 여름철에는 점검 안내
    return location.pathname === '/' || location.pathname.startsWith('/order');
  };

  // 서비스 앱 배너 표시 조건
  const shouldShowServiceAppsBanner = () => {
    return location.pathname === '/' && isAuthenticated;
  };

  // 페이지 변경 시 스크롤을 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${getPageBackgroundClass()}`}
    >
      {/* 포털 연결 상태 배너 */}
      <PortalConnectionBanner />

      {/* 계절별 공지사항 */}
      {shouldShowSeasonalNotice() && <SeasonalNotice />}

      <Header />

      {/* 하이브리드 서비스 앱 배너 - 로그인한 사용자에게만 표시 */}
      {shouldShowServiceAppsBanner() &&
        currentUser?.userType === 'INDIVIDUAL' && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎉</span>
                  <div>
                    <p className="font-medium text-sm">
                      {currentUser?.name}님의 통합 서비스가 연결되었습니다!
                    </p>
                    <p className="text-xs text-orange-100">
                      주유소, 세차 서비스도 자동 로그인으로 이용 가능해요
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">⛽ 🚗</span>
                </div>
              </div>
            </div>
          </div>
        )}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* 빠른 액션 FAB */}
      <QuickActionFab />

      {/* 비로그인 사용자를 위한 서비스 안내 플로팅 */}
      {!isAuthenticated && location.pathname === '/' && (
        <div
          className="fixed bottom-6 left-6 z-40 max-w-sm"
          data-banner="service-info"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-orange-200 p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚛</div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">
                  스타코엑스 통합 서비스
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  한 번 가입으로 모든 에너지 서비스 이용!
                </p>
                <div className="flex gap-2 text-xs">
                  <span>⛽ 주유소</span>
                  <span>🚗 세차</span>
                  <span>🚛 배달</span>
                </div>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground text-xs"
                onClick={() => {
                  const banner = document.querySelector(
                    '[data-banner="service-info"]'
                  );
                  if (banner) banner.remove();
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
