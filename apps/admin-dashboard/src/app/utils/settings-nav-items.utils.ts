// 설정 네비게이션 아이템 추출

import { NavItem, TeamName, UserRole } from '@/app/types/sidebar-type';
import { getSidebarData } from '@/components/layout/data/sidebar-data';

export const getSettingsNavItems = (
  teamName: TeamName = 'StarcoexMain',
  userRole: UserRole = 'ADMIN'
): NavItem[] => {
  const sidebarData = getSidebarData(teamName, userRole);

  // '설정' 그룹 찾기
  const settingsGroup = sidebarData.navGroups.find(
    (group) => group.title === '설정'
  );

  // 시스템 설정의 하위 아이템들 반환
  const systemSettingsItem = settingsGroup?.items.find(
    (item) => item.title === '시스템 설정'
  );

  return systemSettingsItem?.items || [];
};
