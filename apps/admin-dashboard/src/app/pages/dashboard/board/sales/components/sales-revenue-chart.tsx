import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardAction,
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
  count: { label: '건수', color: 'var(--chart-2)' },
} satisfies ChartConfig;

type ActiveKey = 'amount' | 'count';

export function SalesRevenueChart({ payments, isLoading }: Props) {
  const [activeKey, setActiveKey] = useState<ActiveKey>('amount');

  // 날짜별 그룹핑
  const chartData = useMemo(() => {
    const map = new Map<string, { amount: number; count: number }>();

    payments
      .filter((p) => p.status === 'PAID' && p.paidAt)
      .forEach((p) => {
        const day = format(new Date(p.paidAt!), 'MM.dd', { locale: ko });
        const prev = map.get(day) ?? { amount: 0, count: 0 };
        map.set(day, {
          amount: prev.amount + p.amount,
          count: prev.count + 1,
        });
      });

    return Array.from(map.entries())
      .map(([date, val]) => ({ date, ...val }))
      .slice(-30); // 최근 30일
  }, [payments]);

  const total = useMemo(
    () => ({
      amount: payments
        .filter((p) => p.status === 'PAID')
        .reduce((acc, p) => acc + p.amount, 0),
      count: payments.filter((p) => p.status === 'PAID').length,
    }),
    [payments]
  );

  return (
    <Card className="relative h-full overflow-hidden">
      <CardHeader>
        <CardTitle>매출 차트</CardTitle>
        <CardDescription>결제 완료 기준 일별 현황</CardDescription>
        <CardAction className="col-start-auto row-start-auto justify-self-start md:col-start-2 md:row-start-1 md:justify-self-end">
          <div className="flex divide-x rounded-md border">
            {(['amount', 'count'] as ActiveKey[]).map((key) => (
              <button
                key={key}
                data-active={activeKey === key}
                className="data-[active=true]:bg-muted flex flex-col gap-1 px-6 py-3 text-left"
                onClick={() => setActiveKey(key)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[key].label}
                </span>
                <span className="text-lg font-bold leading-none">
                  {key === 'amount'
                    ? `₩${total.amount.toLocaleString()}`
                    : `${total.count.toLocaleString()}건`}
                </span>
              </button>
            ))}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[186px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="text-muted-foreground flex h-[186px] items-center justify-center text-sm">
            결제 데이터가 없습니다.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[186px] w-full">
            <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey={activeKey}
                  />
                }
              />
              <Bar
                dataKey={activeKey}
                fill={`var(--color-${activeKey})`}
                radius={5}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
