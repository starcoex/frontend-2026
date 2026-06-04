import { Outlet } from 'react-router-dom';
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
import { PwaInstallBanner, OfflineIndicator } from '@starcoex-frontend/pwa';

export const MainLayout: React.FC = () => {
  return (
    <TooltipProvider>
      <Header />
      {/* PWA 배너 */}
      <div className="mx-4 mt-2 space-y-2">
        <OfflineIndicator />
        <PwaInstallBanner />
      </div>
      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </TooltipProvider>
  );
};
