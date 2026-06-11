import { MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Contact } from '@starcoex-frontend/contact';

export function ContactStats({ contacts }: { contacts: Contact[] }) {
  const total = contacts.length;
  const pending = contacts.filter((c) => c.status === 'PENDING').length;
  const inProgress = contacts.filter((c) => c.status === 'IN_PROGRESS').length;
  const resolved = contacts.filter((c) => c.status === 'RESOLVED').length;

  const stats = [
    { label: '전체 문의', value: total, icon: MessageCircle, badge: null },
    {
      label: '접수 대기',
      value: pending,
      icon: Clock,
      badge:
        pending > 0
          ? { label: '처리 필요', variant: 'warning' as const }
          : null,
    },
    { label: '처리 중', value: inProgress, icon: MessageCircle, badge: null },
    { label: '처리 완료', value: resolved, icon: CheckCircle2, badge: null },
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
