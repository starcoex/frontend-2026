import { Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip'; // ✅ shadcn 버전으로
import { PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { FuelDataProvider } from '@starcoex-frontend/vehicles';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { QuickActionFab } from '@/components/quick-action-fab';
import { useAuth } from '@starcoex-frontend/auth';
import { OfflineIndicator, PwaInstallBanner } from '@starcoex-frontend/pwa';

export const MainLayout: React.FC = () => {
  const { initialized, checkAuthStatus } = useAuth();

  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.debug('메인 레이아웃 인증 상태 확인:', error);
      });
    }
  }, []); // ✅ 마운트 시 1회만

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
          {/* PWA 배너 */}
          <div className="mx-4 mt-2 space-y-2">
            <OfflineIndicator />
            <PwaInstallBanner />
          </div>
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
