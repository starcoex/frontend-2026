import React from 'react';
import { cn } from '../../utils/utils';
import { Badge } from '../ui';
import type { MyPageTabsProps } from '../../types/my-page-types';

/**
 * 마이페이지 탭 네비게이션 컴포넌트
 */
export const MyPageTabs: React.FC<MyPageTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn('border-b', className)}>
      {/* 스크롤 가능한 탭 컨테이너 (모바일 대응) */}
      <div className="flex overflow-x-auto scrollbar-hide -mb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <Badge
                  variant={isActive ? 'default' : 'secondary'}
                  className="ml-1 h-5 min-w-5 px-1.5 text-xs"
                >
                  {tab.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
