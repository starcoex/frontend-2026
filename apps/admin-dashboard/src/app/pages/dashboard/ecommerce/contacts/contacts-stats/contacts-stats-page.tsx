import { useMemo } from 'react';
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Users,
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
import { useContacts } from '@starcoex-frontend/contact';
import type { Contact } from '@starcoex-frontend/contact';
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
import { CONTACT_CATEGORY_LABEL } from '../data/contact-data';

// ─── 요약 카드 ────────────────────────────────────────────────────────────────

function ContactStatCards({ contacts }: { contacts: Contact[] }) {
  const stats = useMemo(() => {
    const total = contacts.length;
    const pending = contacts.filter((c) => c.status === 'PENDING').length;
    const inProgress = contacts.filter(
      (c) => c.status === 'IN_PROGRESS'
    ).length;
    const resolved = contacts.filter((c) => c.status === 'RESOLVED').length;
    const closed = contacts.filter((c) => c.status === 'CLOSED').length;
    const members = contacts.filter(
      (c) => c.contactUserType === 'MEMBER'
    ).length;
    const guests = contacts.filter((c) => c.contactUserType === 'GUEST').length;
    const resolvedRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    return {
      total,
      pending,
      inProgress,
      resolved,
      closed,
      members,
      guests,
      resolvedRate,
    };
  }, [contacts]);

  const statItems = [
    {
      label: '전체 문의',
      value: stats.total,
      icon: MessageCircle,
      badge: null,
    },
    {
      label: '접수 대기',
      value: stats.pending,
      icon: Clock,
      badge:
        stats.pending > 0
          ? { label: '처리 필요', variant: 'warning' as const }
          : { label: '없음', variant: 'outline' as const },
    },
    {
      label: '처리 완료',
      value: stats.resolved,
      icon: CheckCircle2,
      badge: {
        label: `완료율 ${stats.resolvedRate}%`,
        variant: 'outline' as const,
      },
    },
    {
      label: '회원 / 비회원',
      value: `${stats.members} / ${stats.guests}`,
      icon: Users,
      badge: null,
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

// ─── 카테고리 분포 ────────────────────────────────────────────────────────────

function ContactCategoryDistribution({ contacts }: { contacts: Contact[] }) {
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    contacts.forEach((c) => {
      map[c.category] = (map[c.category] ?? 0) + 1;
    });
    return Object.entries(map).map(([key, count]) => ({
      label:
        CONTACT_CATEGORY_LABEL[key as keyof typeof CONTACT_CATEGORY_LABEL] ??
        key,
      count,
    }));
  }, [contacts]);

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <BarChart3 className="size-4 opacity-60" />
          카테고리별 분포
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={categoryData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
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
              formatter={(value) => [`${value}건`, '문의 수']}
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

// ─── 일별 문의 추이 ───────────────────────────────────────────────────────────

function ContactDailyChart({ contacts }: { contacts: Contact[] }) {
  const chartData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const date = subDays(new Date(), 13 - i);
      const key = format(date, 'yyyy-MM-dd');
      return { date: format(date, 'MM/dd', { locale: ko }), key, count: 0 };
    });
    contacts.forEach((c) => {
      const key = format(new Date(c.createdAt), 'yyyy-MM-dd');
      const day = days.find((d) => d.key === key);
      if (day) day.count++;
    });
    return days;
  }, [contacts]);

  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5">
          <BarChart3 className="size-4 opacity-60" />
          최근 14일 문의 추이
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
              formatter={(value) => [`${value}건`, '문의 수']}
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

// ─── 페이지 ───────────────────────────────────────────────────────────────────

export default function ContactStatsPage() {
  const { contacts } = useContacts();

  return (
    <>
      <PageHead
        title={`문의 통계 - ${COMPANY_INFO.name}`}
        description="고객 문의 현황 및 통계 데이터를 확인하세요."
        keywords={['문의 통계', '문의 현황', COMPANY_INFO.name]}
        og={{
          title: `문의 통계 - ${COMPANY_INFO.name}`,
          description: '고객 문의 현황 및 통계 분석',
          image: '/images/og-contacts.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <ContactStatCards contacts={contacts} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ContactDailyChart contacts={contacts} />
          <ContactCategoryDistribution contacts={contacts} />
        </div>
      </div>
    </>
  );
}
