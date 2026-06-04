import { useNavigate } from 'react-router-dom';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { UserActivityItem } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: UserActivityItem[];
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '서비스', key: 'service' },
  { header: '활동', key: 'action' },
  { header: '금액', key: 'amountFormatted' },
  { header: '절약액', key: 'savingsFormatted' },
  { header: '일시', key: 'timestampFormatted' },
];

const SERVICE_ROUTE_MAP: Record<string, string> = {
  ORDER: '/admin/orders',
  PAYMENT: '/admin/payments',
  RESERVATION: '/admin/reservations',
  DELIVERY: '/admin/delivery',
  LOYALTY: '/admin/loyalty',
};

export function UserActivityFeed({ data, isLoading }: Props) {
  const navigate = useNavigate();

  const exportData = data.map((item) => ({
    service: item.service,
    action: item.action,
    amountFormatted:
      item.amount != null ? `₩${item.amount.toLocaleString()}` : '-',
    savingsFormatted:
      item.savings != null && item.savings > 0
        ? `-₩${item.savings.toLocaleString()}`
        : '-',
    timestampFormatted: format(new Date(item.timestamp), 'yyyy.MM.dd HH:mm', {
      locale: ko,
    }),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>
              최근 이용 내역 · 총 {data.length}건
            </CardDescription>
          </div>
          <ExportButton
            data={exportData}
            columns={EXPORT_COLUMNS}
            fileName="user-activities"
            pdfTitle="사용자 최근 활동"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            활동 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.service}
                    </Badge>
                    <span className="text-sm font-medium">{item.action}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {format(new Date(item.timestamp), 'MM.dd HH:mm', {
                      locale: ko,
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {item.amount != null && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {item.amount.toLocaleString()}원
                      </p>
                      {item.savings != null && item.savings > 0 && (
                        <p className="text-xs text-emerald-500">
                          -{item.savings.toLocaleString()}원 절약
                        </p>
                      )}
                    </div>
                  )}
                  {/* ⋮ 메뉴 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          const route = SERVICE_ROUTE_MAP[item.service];
                          if (route) navigate(route);
                        }}
                      >
                        관련 페이지로 이동
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
