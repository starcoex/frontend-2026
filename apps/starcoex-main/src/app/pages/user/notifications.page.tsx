import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@starcoex-frontend/auth';
import {
  NotificationsForm,
  PushNotificationToggle,
} from '@starcoex-frontend/common';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">알림 설정</h1>
          <p className="text-sm text-muted-foreground">
            알림 수신 방법 및 채널을 관리합니다.
          </p>
        </div>
      </div>

      {currentUser && (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium">브라우저 푸시 알림</h4>
            <p className="text-xs text-muted-foreground mt-1">
              주문, 재고 등 중요 알림을 실시간으로 받아보세요
            </p>
          </div>
          <PushNotificationToggle userId={currentUser.id} />
          <Separator />
        </div>
      )}

      <NotificationsForm />
    </div>
  );
};
