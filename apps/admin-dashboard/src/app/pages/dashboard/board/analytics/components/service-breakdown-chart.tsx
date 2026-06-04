import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ServiceBreakdownOutput } from '@starcoex-frontend/analytics';

interface Props {
  data: ServiceBreakdownOutput[];
  isLoading: boolean;
}

const chartConfig = {
  totalAmount: { label: '총 결제액', color: 'var(--chart-1)' },
  totalSavings: { label: '총 절약액', color: 'var(--chart-2)' },
  totalOrders: { label: '주문 수', color: 'var(--chart-3)' },
} satisfies ChartConfig;

export function ServiceBreakdownChart({ data, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>서비스별 실적 차트</CardTitle>
        <CardDescription>
          서비스별 결제액 · 절약액 · 주문 수 비교
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : data.length === 0 ? (
          <div className="text-muted-foreground flex h-[260px] items-center justify-center text-sm">
            데이터가 없습니다.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={data} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="serviceName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="totalAmount"
                fill="var(--color-totalAmount)"
                radius={4}
              />
              <Bar
                dataKey="totalSavings"
                fill="var(--color-totalSavings)"
                radius={4}
              />
              <Bar
                dataKey="totalOrders"
                fill="var(--color-totalOrders)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
