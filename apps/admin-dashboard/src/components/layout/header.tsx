import { HeaderUser } from './header-user';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

export const Header = () => {
  return (
    <header
      className={cn(
        'bg-background z-50 flex h-14 shrink-0 items-center gap-2 border-b px-3',
        'sticky top-0'
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* 데스크탑: 검색창 표시 / 모바일: 숨김 */}
      <div className="hidden sm:flex flex-1 max-w-md">
        <Search />
      </div>

      {/* 모바일: 타이틀 중앙 표시 */}
      <div className="flex sm:hidden flex-1 justify-center">
        <span className="font-semibold text-sm tracking-tight">
          Starcoex Admin
        </span>
      </div>

      {/* 우측 액션 영역 */}
      <div className="flex items-center gap-1 ml-auto sm:ml-0">
        <ThemeSwitch />
        <HeaderUser />
      </div>
    </header>
  );
};
