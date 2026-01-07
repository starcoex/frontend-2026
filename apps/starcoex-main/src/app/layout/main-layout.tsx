import { Outlet } from 'react-router-dom';
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';

export const MainLayout: React.FC = () => {
  return (
    <TooltipProvider>
      <Header />
      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </TooltipProvider>
  );
};
