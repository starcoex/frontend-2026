import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMedia } from '@starcoex-frontend/media';
import { useMemo } from 'react';
import { format, subDays, isSameDay } from 'date-fns';

export function ChartFileTransfer() {
  const { files } = useMedia();

  // 최근 7일간의 업로드 현황 계산
  const data = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i); // 오늘 포함 최근 7일
      return {
        date,
        label: format(date, 'MM/dd'),
        count: 0,
      };
    });

    files.forEach((file) => {
      const fileDate = new Date(file.createdAt);
      const targetDay = days.find((d) => isSameDay(d.date, fileDate));
      if (targetDay) {
        targetDay.count++;
      }
    });

    return days;
  }, [files]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Daily Uploads (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="label"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                allowDecimals={false} // 정수만 표시
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar
                dataKey="count"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
