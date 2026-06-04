import { useNavigate } from 'react-router-dom';
import { Bell, FileBarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExportButton } from '@starcoex-frontend/common';

// Reports 탭에서 내보낼 데이터 컬럼 정의
const REPORT_EXPORT_COLUMNS = [
  { header: '항목', key: 'label' },
  { header: '값', key: 'value' },
];

interface Props {
  activeTab: string;
  // Overview 탭: 각 위젯에서 개별 Export하므로 불필요
  // Reports 탭: 전체 요약 데이터 Export
  reportData?: Record<string, unknown>[];
  // Notifications 탭: 미읽음 개수 표시
  unreadCount?: number;
  // Notifications 탭: 전체 읽음 처리
  onMarkAllAsRead?: () => void;
}

export const DashboardActions = ({
  activeTab,
  reportData = [],
  unreadCount = 0,
  onMarkAllAsRead,
}: Props) => {
  const navigate = useNavigate();

  // ─── Overview 탭: 액션 없음 (각 위젯에 개별 Export 있음) ───────────────────
  if (activeTab === 'overview') {
    return null;
  }

  // ─── Reports 탭: 전체 보고서 Export ────────────────────────────────────────
  if (activeTab === 'reports') {
    return (
      <div className="flex items-center gap-2">
        <ExportButton
          data={reportData}
          columns={REPORT_EXPORT_COLUMNS}
          fileName="dashboard-report"
          pdfTitle="대시보드 통합 리포트"
        />
      </div>
    );
  }

  // ─── Notifications 탭: 미읽음 수 + 전체 읽음 처리 + 알림 관리 이동 ──────────
  if (activeTab === 'notifications') {
    return (
      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <div className="flex items-center gap-1.5">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Badge variant="destructive" className="text-xs">
              미읽음 {unreadCount}건
            </Badge>
          </div>
        )}
        {unreadCount > 0 && onMarkAllAsRead && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            전체 읽음
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/notifications')}
        >
          <FileBarChart2 className="mr-1 h-4 w-4" />
          알림 관리
        </Button>
      </div>
    );
  }

  return null;
};
