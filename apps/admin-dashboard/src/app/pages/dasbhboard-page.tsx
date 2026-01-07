import React from 'react';
import {
  IconAnalyze,
  IconFileReport,
  IconNotification,
  IconSettings2,
} from '@tabler/icons-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Analytics } from '@/app/pages/dashboard/board/analytics/analytics';
import { Overview } from '@/app/pages/dashboard/board/overvies/overview';
import { DashboardActions } from '@/app/pages/dashboard/components/dashboard-actions';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4 p-4">
      <div className="mb-2 flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <DashboardActions />
      </div>
      <Tabs
        orientation="vertical"
        defaultValue="overview"
        className="space-y-4"
      >
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <IconSettings2 size={14} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <IconAnalyze size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center gap-2"
              disabled
            >
              <IconFileReport size={16} />
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
              disabled
            >
              <IconNotification size={16} />
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
