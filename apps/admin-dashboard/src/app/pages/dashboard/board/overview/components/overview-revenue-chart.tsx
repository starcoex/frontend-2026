import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Payment {
  paidAt?: string | null;
  amount: number;
  status: string;
}

interface Props {
  payments: Payment[];
  isLoading: boolean;
}

const chartConfig = {
  amount: { label: '결제액', color: 'var(--chart-1)' },
} satisfies ChartConfig;

export function OverviewRevenueChart({ payments, isLoading }: Props) {
  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    payments
      .filter((p) => p.status === 'PAID' && p.paidAt)
      .forEach((p) => {
        const day = format(new Date(p.paidAt!), 'MM.dd', { locale: ko });
        map.set(day, (map.get(day) ?? 0) + p.amount);
      });
    return Array.from(map.entries())
      .map(([date, amount]) => ({ date, amount }))
      .slice(-14);
  }, [payments]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>매출 추이</CardTitle>
        <CardDescription>최근 14일 일별 결제액</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[180px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="text-muted-foreground flex h-[180px] items-center justify-center text-sm">
            결제 데이터가 없습니다.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="amount"
                type="natural"
                fill="url(#fillAmount)"
                fillOpacity={0.4}
                stroke="var(--color-amount)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
