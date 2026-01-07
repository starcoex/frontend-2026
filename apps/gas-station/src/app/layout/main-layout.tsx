import { Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { FuelDataProvider } from '@starcoex-frontend/vehicles';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { QuickActionFab } from '@/components/quick-action-fab';
import { useAuth } from '@starcoex-frontend/auth';

export const MainLayout: React.FC = () => {
  const { initialized, checkAuthStatus } = useAuth();

  // 인증 상태 초기화 (토큰이 있으면 사용자 정보 로드)
  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        // 토큰이 없거나 만료된 경우 - 정상적인 비로그인 상태
        console.debug('메인 레이아웃 인증 상태 확인:', error);
      });
    }
  }, [initialized, checkAuthStatus]);

  return (
    <TooltipProvider>
      <FuelDataProvider autoLoad={true}>
        <PageHead
          title={APP_CONFIG.app.name}
          description={APP_CONFIG.app.description}
          siteName={APP_CONFIG.seo.siteName}
          url={`https://${APP_CONFIG.app.currentDomain}`}
          keywords={[
            '주유소',
            '연료가격',
            '제주도',
            '별표주유소',
            '실시간가격',
          ]}
          robots="index, follow"
        />
        <div className="min-h-screen transition-all duration-300">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />

          {/* 플로팅 액션 버튼 */}
          <QuickActionFab />
        </div>
      </FuelDataProvider>
    </TooltipProvider>
  );
};
