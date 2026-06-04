import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { PageHead } from '@starcoex-frontend/common';
import { TooltipProvider } from '@/components/ui/tooltip';
import { APP_CONFIG } from '@/app/config/app.config';
import { Footer } from '@/components/footer/footer';
import { QuickActionFab } from '@/components/common/quick-action-fab';
import { Navbar } from '@/components/header/navbar';
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
      <PageHead
        title={APP_CONFIG.app.name}
        description={APP_CONFIG.app.description}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}`}
        keywords={['난방유', '배달', '정량보장', '별표주유소', '당일배송']}
        robots="index, follow"
      />
      <div className="min-h-screen transition-all duration-300">
        <Navbar />
        {/* PWA 배너 */}
        <div className="mx-4 mt-2 space-y-2">
          <OfflineIndicator />
          <PwaInstallBanner />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <QuickActionFab />
      </div>
    </TooltipProvider>
  );
};
