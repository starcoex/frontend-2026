import { Briefcase, CheckCircle2, Clock, Users } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { JobPosting } from '@starcoex-frontend/jobs';

export function JobStats({ jobs }: { jobs: JobPosting[] }) {
  const total = jobs.length;
  const open = jobs.filter((j) => j.jobPostingStatus === 'OPEN').length;
  const draft = jobs.filter((j) => j.jobPostingStatus === 'DRAFT').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicationCount, 0);

  const stats = [
    {
      label: '전체 공고',
      value: total,
      icon: Briefcase,
      badge: null,
    },
    {
      label: '모집중',
      value: open,
      icon: CheckCircle2,
      badge: open > 0 ? { label: '활성', variant: 'success' as const } : null,
    },
    {
      label: '초안',
      value: draft,
      icon: Clock,
      badge:
        draft > 0 ? { label: '미게시', variant: 'secondary' as const } : null,
    },
    {
      label: '전체 지원자',
      value: `${totalApplicants}명`,
      icon: Users,
      badge: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
