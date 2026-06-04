import { MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { RealtimeAlertOutput } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: RealtimeAlertOutput[];
  isLoading: boolean;
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'border-red-500 bg-red-50 dark:bg-red-950/20',
  warning: 'border-orange-400 bg-orange-50 dark:bg-orange-950/20',
  info: 'border-blue-400 bg-blue-50 dark:bg-blue-950/20',
};

const EXPORT_COLUMNS = [
  { header: '유형', key: 'type' },
  { header: '심각도', key: 'severity' },
  { header: '메시지', key: 'message' },
  { header: '읽음여부', key: 'isReadLabel' },
  { header: '시간', key: 'timestampFormatted' },
];

export function RealtimeAlertList({ data, isLoading }: Props) {
  const unreadCount = data.filter((a) => !a.isRead).length;

  const exportData = data.map((alert, idx) => ({
    type: alert.type,
    severity: alert.severity ?? 'info',
    message: alert.message,
    isReadLabel: alert.isRead ? '읽음' : '안읽음',
    timestampFormatted: format(new Date(alert.timestamp), 'yyyy.MM.dd HH:mm', {
      locale: ko,
    }),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>최근 알림</CardTitle>
            <CardDescription>
              실시간 알림 · 미읽음 {unreadCount}건
            </CardDescription>
          </div>
          <ExportButton
            data={exportData}
            columns={EXPORT_COLUMNS}
            fileName="realtime-alerts"
            pdfTitle="실시간 알림 목록"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            알림이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((alert, idx) => (
              <div
                key={idx}
                className={cn(
                  'rounded-md border-l-4 px-3 py-2',
                  SEVERITY_STYLES[alert.severity ?? 'info'] ??
                    SEVERITY_STYLES['info'],
                  !alert.isRead && 'font-medium'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {alert.type}
                      </Badge>
                      {!alert.isRead && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="mt-1 text-sm">{alert.message}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(alert.timestamp), 'HH:mm', {
                        locale: ko,
                      })}
                    </span>
                    {/* ⋮ 메뉴 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          {alert.isRead ? '읽음 표시됨' : '읽음으로 표시'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          알림 삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
