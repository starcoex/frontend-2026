import { useAuth } from '@starcoex-frontend/auth';
import { PushNotificationToggle } from '@starcoex-frontend/common';
import ContentSection from '../components/content-section';
import { NotificationsForm } from './notifications-form';
import { Separator } from '@/components/ui/separator';

export default function SettingsNotificationsPage() {
  const { currentUser } = useAuth();

  return (
    <ContentSection
      title="알림 설정"
      desc="알림 수신 방법 및 채널을 관리합니다."
    >
      <>
        {/* 푸시 알림 토글 */}
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

        {/* 기존 알림 폼 */}
        <NotificationsForm />
      </>
    </ContentSection>
  );
}
