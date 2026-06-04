import { Users, Clock, Search, CheckCircle2, XCircle } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { JobApplication } from '@starcoex-frontend/jobs';

export function ApplicationStats({
  applications,
}: {
  applications: JobApplication[];
}) {
  const total = applications.length;
  const pending = applications.filter(
    (a) => a.jobApplicationStatus === 'PENDING'
  ).length;
  const reviewing = applications.filter(
    (a) => a.jobApplicationStatus === 'REVIEWING'
  ).length;
  const passed = applications.filter(
    (a) => a.jobApplicationStatus === 'PASSED'
  ).length;
  const rejected = applications.filter(
    (a) => a.jobApplicationStatus === 'REJECTED'
  ).length;

  const stats = [
    {
      label: '전체 지원자',
      value: `${total}명`,
      icon: Users,
      badge: null,
    },
    {
      label: '검토 대기',
      value: pending,
      icon: Clock,
      badge:
        pending > 0 ? { label: '대기중', variant: 'secondary' as const } : null,
    },
    {
      label: '검토중',
      value: reviewing,
      icon: Search,
      badge:
        reviewing > 0 ? { label: '진행중', variant: 'warning' as const } : null,
    },
    {
      label: '합격',
      value: passed,
      icon: CheckCircle2,
      badge: passed > 0 ? { label: '합격', variant: 'success' as const } : null,
    },
    {
      label: '불합격',
      value: rejected,
      icon: XCircle,
      badge:
        rejected > 0
          ? { label: '불합격', variant: 'destructive' as const }
          : null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
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
