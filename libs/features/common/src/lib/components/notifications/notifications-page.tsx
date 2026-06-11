import React from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { PushNotificationToggle } from '../push-notification';
import { NotificationsForm } from './notifications-form';
import { Separator } from '../ui';
import { toast } from 'sonner';

interface NotificationsPageProps {
  /** 페이지 감싸는 레이아웃 컴포넌트 (앱마다 다를 수 있음) */
  ContentSection?: React.ComponentType<{
    title: string;
    desc: string;
    children: React.ReactNode;
  }>;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  ContentSection,
}) => {
  const { currentUser } = useAuth();

  const content = (
    <>
      {currentUser && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-1">브라우저 푸시 알림</h4>
          <p className="text-xs text-muted-foreground mb-3">
            주문, 재고 등 중요 알림을 실시간으로 받아보세요
          </p>
          <PushNotificationToggle userId={currentUser.id} />
          <Separator className="mt-6" />
        </div>
      )}
      <NotificationsForm
        onSuccess={() => toast.success('알림 설정이 저장되었습니다.')}
      />
    </>
  );

  // ContentSection이 주입된 경우 (admin-dashboard 등)
  if (ContentSection) {
    return (
      <ContentSection
        title="알림 설정"
        desc="알림 수신 방법 및 채널을 관리합니다."
      >
        {content}
      </ContentSection>
    );
  }

  // 기본 레이아웃 (starcoex-frontend 등)
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold">알림 설정</h1>
        <p className="text-sm text-muted-foreground mt-1">
          알림 수신 방법 및 채널을 관리합니다.
        </p>
      </div>
      {content}
    </div>
  );
};
