import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavGroup } from '@/components/layout/nav-group';
import { NavUser } from '@/components/layout/nav-user';
import { TeamSwitcher } from '@/components/layout/team-switcher';
import { useTeamContext } from '@/components/team-provider';
import React from 'react';

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { sidebarData } = useTeamContext();

  return (
    <div className="relative">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={sidebarData.teams} />
        </SidebarHeader>
        <SidebarContent>
          {sidebarData.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={sidebarData.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
};
