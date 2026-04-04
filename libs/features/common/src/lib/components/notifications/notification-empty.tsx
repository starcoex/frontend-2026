import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationEmptyProps {
  message?: string;
}

export const NotificationEmpty: React.FC<NotificationEmptyProps> = ({
  message = '새로운 알림이 없습니다',
}) => (
  <div className="px-4 py-8 text-center">
    <Bell className="w-8 h-8 mx-auto text-muted-foreground mb-2 opacity-40" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);
