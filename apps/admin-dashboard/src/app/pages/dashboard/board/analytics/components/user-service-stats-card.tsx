import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { UserServiceStats } from '@starcoex-frontend/analytics';

interface Props {
  data: UserServiceStats[];
  isLoading: boolean;
}

const chartConfig = {
  totalAmount: { label: '사용액', color: 'var(--chart-1)' },
  totalSavings: { label: '절약액', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function UserServiceStatsCard({ data, isLoading }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>서비스별 이용 현황</CardTitle>
        <CardDescription>서비스별 사용액 및 절약액 비교</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : data.length === 0 ? (
          <div className="text-muted-foreground flex h-[200px] items-center justify-center text-sm">
            데이터가 없습니다.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={data} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="service"
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
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
