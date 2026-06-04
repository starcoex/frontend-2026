import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { TodayActivityOutput } from '@starcoex-frontend/analytics';

interface Props {
  data: TodayActivityOutput | null;
  isLoading: boolean;
}

export function TodayActivityCard({ data, isLoading }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>오늘 활동</CardTitle>
        <CardDescription>오늘의 이용 현황</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div>
              <p className="text-muted-foreground text-xs">오늘 주문</p>
              <p className="text-2xl font-bold">
                {data?.orders ?? 0}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  건
                </span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">오늘 절약</p>
              <p className="text-2xl font-bold text-emerald-500">
                {data?.savings?.toLocaleString() ?? 0}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  원
                </span>
              </p>
            </div>
            {data?.lastOrder && (
              <p className="text-muted-foreground text-xs">
                마지막 주문:{' '}
                {format(new Date(data.lastOrder), 'HH:mm', { locale: ko })}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
