import { useMemo } from 'react';
import {
  ShoppingCart,
  CircleDollarSign,
  TruckIcon,
  XCircle,
  Clock,
  CheckCircle2,
  PackageCheck,
  BarChart3,
} from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useOrders } from '@starcoex-frontend/orders';
import type { Order } from '@starcoex-frontend/orders';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

// ─── 통계 카드 ────────────────────────────────────────────────────────────────

function OrderStatCards({ orders }: { orders: Order[] }) {
  const stats = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === 'COMPLETED')
      .reduce((sum, o) => sum + o.finalAmount, 0);
    const pending = orders.filter((o) => o.status === 'PENDING').length;
    const confirmed = orders.filter((o) => o.status === 'CONFIRMED').length;
    const shipped = orders.filter((o) => o.status === 'SHIPPED').length;
    const delivered = orders.filter((o) => o.status === 'DELIVERED').length;
    const cancelled = orders.filter((o) => o.status === 'CANCELLED').length;
    const completionRate =
      total > 0 ? Math.round((delivered / total) * 100) : 0;

    return {
      total,
      totalRevenue,
      pending,
      confirmed,
      shipped,
      delivered,
      cancelled,
      completionRate,
    };
  }, [orders]);

  const statItems = [
    {
      label: '전체 주문',
      value: stats.total.toLocaleString(),
      icon: ShoppingCart,
      badge: null,
    },
    {
      label: '결제 완료 매출',
      value: `₩${stats.totalRevenue.toLocaleString()}`,
      icon: CircleDollarSign,
      badge: null,
    },
    {
      label: '배송 완료',
      value: stats.delivered.toLocaleString(),
      icon: PackageCheck,
      badge: {
        label: `완료율 ${stats.completionRate}%`,
        variant: 'outline' as const,
      },
    },
    {
      label: '취소',
      value: stats.cancelled.toLocaleString(),
      icon: XCircle,
      badge:
        stats.cancelled > 0
          ? { label: '주의', variant: 'destructive' as const }
          : { label: '정상', variant: 'outline' as const },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <stat.icon className="size-4 opacity-60" />
              {stat.label}
            </CardDescription>
            <CardTitle className="font-display text-2xl lg:text-3xl">
              {stat.value}
            </CardTitle>
            {stat.badge && (
              <CardAction>
                <Badge variant={stat.badge.variant}>{stat.badge.label}</Badge>
              </CardAction>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

// ─── 상태별 분포 카드 ─────────────────────────────────────────────────────────

function OrderStatusDistribution({ orders }: { orders: Order[] }) {
  const statusData = useMemo(() => {
    const map: Record<
      string,
      { label: string; count: number; icon: React.ElementType }
    > = {
      PENDING: { label: '대기 중', count: 0, icon: Clock },
      CONFIRMED: { label: '확인됨', count: 0, icon: CheckCircle2 },
      SHIPPED: { label: '배송 중', count: 0, icon: TruckIcon },
      DELIVERED: { label: '배송 완료', count: 0, icon: PackageCheck },
      CANCELLED: { label: '취소', count: 0, icon: XCircle },
    };
    orders.forEach((o) => {
      if (map[o.status]) map[o.status].count++;
    });
    return Object.values(map);
  }, [orders]);

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <BarChart3 className="size-4 opacity-60" />
          주문 상태 분포
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {statusData.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 rounded-lg border p-3"
            >
              <s.icon className="text-muted-foreground size-5" />
              <span className="text-2xl font-bold">{s.count}</span>
              <span className="text-muted-foreground text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── 일별 주문 추이 차트 ──────────────────────────────────────────────────────

function OrderDailyChart({ orders }: { orders: Order[] }) {
  const chartData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i);
      const key = format(date, 'yyyy-MM-dd');
      return {
        date: format(date, 'MM/dd', { locale: ko }),
        key,
        count: 0,
        revenue: 0,
      };
    });

    orders.forEach((o) => {
      const key = format(new Date(o.createdAt), 'yyyy-MM-dd');
      const day = days.find((d) => d.key === key);
      if (day) {
        day.count++;
        if (o.paymentStatus === 'COMPLETED') day.revenue += o.finalAmount;
      }
    });

    return days;
  }, [orders]);

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <BarChart3 className="size-4 opacity-60" />
          최근 14일 주문 추이
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value) => [
                `${(value as number)?.toLocaleString() ?? 0}건`,
                '주문 수',
              ]}
              labelStyle={{ fontSize: 12 }}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ─── 일별 매출 추이 차트 ──────────────────────────────────────────────────────

function OrderRevenueChart({ orders }: { orders: Order[] }) {
  const chartData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i);
      const key = format(date, 'yyyy-MM-dd');
      return { date: format(date, 'MM/dd', { locale: ko }), key, revenue: 0 };
    });

    orders.forEach((o) => {
      if (o.paymentStatus !== 'COMPLETED') return;
      const key = format(new Date(o.createdAt), 'yyyy-MM-dd');
      const day = days.find((d) => d.key === key);
      if (day) day.revenue += o.finalAmount;
    });

    return days;
  }, [orders]);

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <CircleDollarSign className="size-4 opacity-60" />
          최근 14일 매출 추이
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [
                `₩${(value as number)?.toLocaleString() ?? 0}`,
                '매출',
              ]}
              labelStyle={{ fontSize: 12 }}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary) / 0.7)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ─── 페이지 ───────────────────────────────────────────────────────────────────

export default function OrderStatsPage() {
  const { orders } = useOrders();

  return (
    <>
      <PageHead
        title={`주문 통계 - ${COMPANY_INFO.name}`}
        description="주문 현황 및 통계 데이터를 확인하세요."
        keywords={['주문 통계', '주문 현황', COMPANY_INFO.name]}
        og={{
          title: `주문 통계 - ${COMPANY_INFO.name}`,
          description: '주문 현황 및 통계 분석',
          image: '/images/og-orders.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 요약 카드 */}
        <OrderStatCards orders={orders} />

        {/* 상태 분포 */}
        <OrderStatusDistribution orders={orders} />

        {/* 차트 2개 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <OrderDailyChart orders={orders} />
          <OrderRevenueChart orders={orders} />
        </div>
      </div>
    </>
  );
}
