import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { SystemStatusOutput } from '@starcoex-frontend/analytics';

interface Props {
  data: SystemStatusOutput | null;
  isLoading: boolean;
}

const getHealthColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
};

export function SystemStatusCard({ data, isLoading }: Props) {
  const score = data?.healthScore ?? 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>시스템 상태</CardTitle>
        <CardDescription>현재 시스템 건강 점수</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <div className="flex items-end justify-between">
                <span className="text-muted-foreground text-sm">건강 점수</span>
                <span
                  className={cn('text-3xl font-bold', getHealthColor(score))}
                >
                  {score}
                  <span className="text-muted-foreground text-base font-normal">
                    /100
                  </span>
                </span>
              </div>
              <Progress value={score} className="h-2" />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">처리 지연</span>
                <span className="font-medium">
                  {data?.processingDelay ?? 0}ms
                </span>
              </div>
              {data?.dataFreshness && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">데이터 최신성</span>
                  <span className="font-medium">
                    {format(new Date(data.dataFreshness), 'HH:mm:ss', {
                      locale: ko,
                    })}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
