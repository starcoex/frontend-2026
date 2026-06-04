import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { SavingsGoalProgressOutput } from '@starcoex-frontend/analytics';

interface Props {
  data: SavingsGoalProgressOutput | null;
  isLoading: boolean;
}

export function SavingsGoalProgressCard({ data, isLoading }: Props) {
  const progress = data?.progressPercentage ?? 0;
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>절약 목표</CardTitle>
        <CardDescription>이번 달 절약 목표 달성 현황</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-muted-foreground text-sm">현재 절약액</p>
                <p className="text-2xl font-bold">
                  {data?.currentSavings?.toLocaleString() ?? 0}
                  <span className="text-muted-foreground ml-1 text-sm font-normal">
                    원
                  </span>
                </p>
              </div>
              {data?.savingsGoal && (
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">목표</p>
                  <p className="text-lg font-semibold">
                    {data.savingsGoal.toLocaleString()}
                    <span className="text-muted-foreground ml-1 text-sm font-normal">
                      원
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">진행률</span>
                <span className="font-medium">{clamped.toFixed(1)}%</span>
              </div>
              <Progress value={clamped} className="h-2" />
            </div>

            {data?.message && (
              <p className="text-muted-foreground text-sm">{data.message}</p>
            )}

            {data?.remainingAmount != null && data.remainingAmount > 0 && (
              <p className="text-sm">
                <span className="text-muted-foreground">남은 금액: </span>
                <span className="font-medium text-orange-500">
                  {data.remainingAmount.toLocaleString()}원
                </span>
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
