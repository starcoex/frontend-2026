import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, SunIcon, MoonIcon, MonitorIcon } from 'lucide-react';
import { useTheme } from '@starcoex-frontend/common';
import { useSearch } from '@/components/search-provider';
import { useTeamContext } from '@/components/team-provider';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CommandMenu() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();
  const { sidebarData } = useTeamContext();

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="명령어를 입력하거나 검색하세요..." />
      <CommandList>
        <ScrollArea className="h-72 pr-1">
          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>

          {sidebarData?.navGroups?.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                const IconComponent = navItem.icon || ArrowRightIcon;

                // url이 있는 경우 (직접 링크)
                if (navItem.url && !navItem.disabled) {
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate(navItem.url || ''));
                      }}
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <IconComponent className="text-muted-foreground/80 h-4 w-4" />
                      </div>
                      {navItem.title}
                      {navItem.badge && (
                        <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                          {navItem.badge}
                        </span>
                      )}
                    </CommandItem>
                  );
                }

                // items가 있는 경우 (하위 메뉴)
                return navItem.items?.map((subItem, subIndex) => {
                  const SubIconComponent = subItem.icon || ArrowRightIcon;

                  if (subItem.url && !subItem.disabled) {
                    return (
                      <CommandItem
                        key={`${subItem.url}-${subIndex}`}
                        value={subItem.title}
                        onSelect={() => {
                          runCommand(() => navigate(subItem.url || ''));
                        }}
                      >
                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                          <SubIconComponent className="text-muted-foreground/80 h-4 w-4" />
                        </div>
                        {subItem.title}
                        {subItem.badge && (
                          <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                            {subItem.badge}
                          </span>
                        )}
                      </CommandItem>
                    );
                  }
                  return null;
                });
              })}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="테마">
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <SunIcon className="mr-2 h-4 w-4" />
              <span>라이트</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              <span>다크</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <MonitorIcon className="mr-2 h-4 w-4" />
              <span>시스템</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
