import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/utils';
import { MyPageTabs } from './my-page-tabs';
import type { MyPageLayoutProps } from '../../types/my-page-types';

/**
 * 마이페이지 레이아웃 컴포넌트
 * - 페이지 타이틀 + 탭 네비게이션 + 탭 콘텐츠
 */
export const MyPageLayout: React.FC<MyPageLayoutProps> = ({
  user,
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  title = '마이페이지',
  accentColor = 'default',
  isLoading = false,
  className,
}) => {
  // 내부 탭 상태 (비제어 모드용)
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );

  // 제어/비제어 모드 처리
  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  // defaultTab 변경 시 동기화
  useEffect(() => {
    if (defaultTab && !controlledActiveTab) {
      setInternalActiveTab(defaultTab);
    }
  }, [defaultTab, controlledActiveTab]);

  // 현재 활성 탭의 콘텐츠
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 사용자 없음
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">로그인이 필요합니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // 액센트 컬러 클래스
  const accentColorClass = {
    default: '',
    orange:
      '[&_.text-primary]:text-orange-600 [&_.bg-primary]:bg-orange-600 [&_.border-primary]:border-orange-600',
    green:
      '[&_.text-primary]:text-green-600 [&_.bg-primary]:bg-green-600 [&_.border-primary]:border-green-600',
    blue: '[&_.text-primary]:text-blue-600 [&_.bg-primary]:bg-blue-600 [&_.border-primary]:border-blue-600',
    purple:
      '[&_.text-primary]:text-purple-600 [&_.bg-primary]:bg-purple-600 [&_.border-primary]:border-purple-600',
  }[accentColor];

  return (
    <div
      className={cn(
        'container mx-auto px-4 py-6 sm:py-8',
        accentColorClass,
        className
      )}
    >
      {/* 페이지 타이틀 */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{title}</h1>

      {/* 탭 네비게이션 */}
      <MyPageTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-6"
      />

      {/* 탭 콘텐츠 */}
      <div className="min-h-[300px]">{activeTabContent}</div>
    </div>
  );
};
