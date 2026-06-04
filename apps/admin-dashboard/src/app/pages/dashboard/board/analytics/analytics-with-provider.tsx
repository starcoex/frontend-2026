import { AnalyticsProvider } from '@starcoex-frontend/analytics';
import { AnalyticsLayout } from '@/app/pages/dashboard/board/analytics/analytics-layout';

export const AnalyticsWithProvider = () => {
  return (
    <AnalyticsProvider>
      <AnalyticsLayout />
    </AnalyticsProvider>
  );
};
