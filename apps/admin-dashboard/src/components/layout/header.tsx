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
        'bg-background z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4',
        'sticky top-0'
      )}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 justify-between items-center">
        <div className="flex-1 max-w-md">
          <Search />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <HeaderUser />
        </div>
      </div>
    </header>
  );
};
