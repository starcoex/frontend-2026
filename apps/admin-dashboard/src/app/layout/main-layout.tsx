import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

export const MainLayout = () => {
  return (
    <TooltipProvider>
      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <div className="bg-primary-foreground container grid h-svh flex-col items-center justify-center sm:max-w-none md:max-w-none lg:max-w-none lg:px-0">
          <Outlet />
        </div>
      </main>
    </TooltipProvider>
  );
};
