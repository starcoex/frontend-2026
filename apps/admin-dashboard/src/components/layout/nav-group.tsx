import { ReactNode } from 'react';
import { Badge, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavItem, NavGroup as NavGroupType } from '@/app/types/sidebar-type';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function NavGroup({ title, items }: NavGroupType) {
  const { setOpenMobile } = useSidebar();
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMenuItem
            key={item.title}
            item={item}
            pathname={location.pathname}
            onNavigate={() => setOpenMobile(false)}
            level={0}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

interface NavMenuItemProps {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
  level: number;
  maxLevel?: number;
}

function NavMenuItem({
  item,
  pathname,
  onNavigate,
  level,
  maxLevel = 3,
}: NavMenuItemProps) {
  const hasChildren = item.items && item.items.length > 0;
  const isActive = checkIsActive(pathname, item, level === 0);
  const shouldShowItem = !item.disabled;

  const defaultOpen = isActive;

  if (!shouldShowItem) {
    return null;
  }

  // 단일 메뉴 아이템 (URL이 있고 children이 없음)
  if (item.url && !hasChildren) {
    if (level === 0) {
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
            <Link to={item.url} onClick={onNavigate}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    } else {
      return (
        <SidebarMenuSubItem key={item.title}>
          <SidebarMenuSubButton asChild isActive={isActive}>
            <Link to={item.url} onClick={onNavigate}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    }
  }

  // 중첩 메뉴 아이템 (children이 있음)
  if (hasChildren && level < maxLevel) {
    if (level === 0) {
      return (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={defaultOpen}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent">
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <NavMenuItem
                    key={subItem.title}
                    item={subItem}
                    pathname={pathname}
                    onNavigate={onNavigate}
                    level={level + 1}
                    maxLevel={maxLevel}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    } else {
      // 서브 메뉴에서의 중첩 처리
      return (
        <Collapsible
          key={item.title}
          defaultOpen={defaultOpen}
          className="group/collapsible"
        >
          <SidebarMenuSubItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuSubButton>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent">
              <div className="ml-4 border-l border-sidebar-border pl-2">
                {item.items?.map((subItem) => (
                  <NavMenuItem
                    key={subItem.title}
                    item={subItem}
                    pathname={pathname}
                    onNavigate={onNavigate}
                    level={level + 1}
                    maxLevel={maxLevel}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </SidebarMenuSubItem>
        </Collapsible>
      );
    }
  }

  // URL도 있고 children도 있는 경우 (둘 다 지원)
  if (item.url && hasChildren && level < maxLevel) {
    return (
      <Collapsible
        key={item.title}
        asChild={level === 0}
        defaultOpen={defaultOpen}
        className="group/collapsible"
      >
        {level === 0 ? (
          <SidebarMenuItem>
            {/* 메인 링크 */}
            <SidebarMenuButton
              asChild
              isActive={isActive && pathname === item.url}
              tooltip={item.title}
            >
              <Link to={item.url} onClick={onNavigate}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
              </Link>
            </SidebarMenuButton>

            {/* 하위 메뉴 토글 */}
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                size="sm"
                className="ml-auto h-6 w-6 p-0"
                tooltip="하위 메뉴 보기"
              >
                <ChevronRight className="h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent className="CollapsibleContent">
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <NavMenuItem
                    key={subItem.title}
                    item={subItem}
                    pathname={pathname}
                    onNavigate={onNavigate}
                    level={level + 1}
                    maxLevel={maxLevel}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        ) : (
          <SidebarMenuSubItem>
            <SidebarMenuSubButton
              asChild
              isActive={isActive && pathname === item.url}
            >
              <Link to={item.url} onClick={onNavigate}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        )}
      </Collapsible>
    );
  }

  return null;
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
);

function checkIsActive(
  pathname: string,
  item: NavItem,
  isMainNav = false
): boolean {
  // 직접 URL 매치
  if (item.url === pathname) {
    return true;
  }

  // 쿼리 파라미터 제거 후 매치
  if (item.url === pathname.split('?')[0]) {
    return true;
  }

  // 하위 아이템 중 활성화된 것이 있는지 확인 (재귀적)
  if (item.items) {
    const hasActiveChild = item.items.some((subItem) =>
      checkIsActive(pathname, subItem, false)
    );
    if (hasActiveChild) {
      return true;
    }
  }

  // 메인 네비게이션에서 상위 경로 매치
  // if (isMainNav && item.url) {
  //   const currentSection = pathname.split('/')[1];
  //   const itemSection = item.url.split('/')[1];
  //
  //   if (currentSection && itemSection && currentSection === itemSection) {
  //     return true;
  //   }
  // }

  return false;
}
