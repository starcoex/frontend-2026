import { Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { Footer } from '@/components/footer/footer';
import { useAuth } from '@starcoex-frontend/auth';
import Navbar from '@/components/header/navbar';
import { PwaInstallBanner, OfflineIndicator } from '@starcoex-frontend/pwa';

export const MainLayout: React.FC = () => {
  const { initialized, checkAuthStatus } = useAuth();

  useEffect(() => {
    if (!initialized) {
      checkAuthStatus().catch((error) => {
        console.debug('카케어 메인 레이아웃 인증 상태 확인:', error);
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
        keywords={['세차', '손세차', '카케어', '디테일링', '코팅', 'PPF']}
        robots="index, follow"
      />
      <div className="min-h-screen flex flex-col transition-all duration-300">
        <Navbar />
        {/*<Navbar />*/}
        {/* ✅ Navbar가 fixed라서 main이 뒤로 밀리지 않음
               pt-[65px]로 Navbar 높이만큼 확보 → 모든 페이지에 자동 적용 */}
        {/* PWA 배너 */}
        <div className="mx-4 mt-2 space-y-2">
          <OfflineIndicator />
          <PwaInstallBanner />
        </div>
        <main className="flex-1 pt-[65px]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};
