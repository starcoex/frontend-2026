import React, { useEffect } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { TeamName } from '@/app/types/sidebar-type';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTeamContext } from '@/components/team-provider';

interface TeamSwitcherProps {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}

export const TeamSwitcher = ({ teams }: TeamSwitcherProps) => {
  const { isMobile } = useSidebar();
  const { currentTeam, setCurrentTeam } = useTeamContext();

  // 현재 선택된 팀 찾기
  const activeTeam =
    teams.find((team) => team.name === currentTeam) || teams[0];

  const handleTeamChange = (teamName: string) => {
    setCurrentTeam(teamName as TeamName);
  };

  // ⌘1, ⌘2, ... 단축키 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        const num = parseInt(event.key);
        if (num >= 1 && num <= teams.length) {
          event.preventDefault();
          const targetTeam = teams[num - 1];
          if (targetTeam) {
            handleTeamChange(targetTeam.name);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [teams, handleTeamChange]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="ring-sidebar-primary/50 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-1"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-8" />
              </div>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleTeamChange(team.name)}
                className="gap-2 p-2 text-balance"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo
                    className={cn(
                      'size-4 shrink-0',
                      index === 0 && 'invert-0 dark:invert'
                    )}
                  />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
