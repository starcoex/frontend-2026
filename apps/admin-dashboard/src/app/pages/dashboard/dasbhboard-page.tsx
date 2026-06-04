import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileBarChart2, Bell } from 'lucide-react';
import { DashboardActions } from '@/app/pages/dashboard/components/dashboard-actions';
import { DashboardReportsTab } from '@/app/pages/dashboard/components/dashboard-reports-tab';
import { DashboardNotificationsTab } from '@/app/pages/dashboard/components/dashboard-notifications-tab';
import { OverviewWithProvider } from '@/app/pages/dashboard/board/overview/overview-with-provider';
import { Badge } from '@/components/ui/badge';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [unreadCount, setUnreadCount] = useState(0);

  const handleUnreadCountChange = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="overview"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <div className="flex w-full flex-wrap items-center justify-between gap-2 overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard size={14} />
              개요
            </TabsTrigger>

            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart2 size={14} />
              리포트
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className="relative flex items-center gap-2"
            >
              <Bell size={14} />
              알림
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 h-4 min-w-4 px-1 text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <DashboardActions
            activeTab={activeTab}
            unreadCount={unreadCount}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>

        <TabsContent value="overview" className="space-y-4">
          <OverviewWithProvider />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <DashboardReportsTab />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <DashboardNotificationsTab
            onUnreadCountChange={handleUnreadCountChange}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
