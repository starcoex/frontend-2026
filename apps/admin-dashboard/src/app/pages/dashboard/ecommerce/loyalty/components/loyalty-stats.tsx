import { useMemo } from 'react';
import { Star, Crown, Award, Users } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { User } from '@starcoex-frontend/graphql';

export function LoyaltyStats({ users }: { users: User[] }) {
  const stats = useMemo(() => {
    const usersWithMembership = users.filter((u) => u.membership);
    const welcome = usersWithMembership.filter(
      (u) => u.membership?.currentTier === 'WELCOME'
    ).length;
    const shine = usersWithMembership.filter(
      (u) => u.membership?.currentTier === 'SHINE'
    ).length;
    const star = usersWithMembership.filter(
      (u) => u.membership?.currentTier === 'STAR'
    ).length;
    const totalStars = usersWithMembership.reduce(
      (sum, u) => sum + (u.membership?.availableStars ?? 0),
      0
    );
    return {
      total: usersWithMembership.length,
      welcome,
      shine,
      star,
      totalStars,
    };
  }, [users]);

  const statItems = [
    {
      label: '전체 멤버',
      value: stats.total.toLocaleString(),
      icon: Users,
      badge: null,
    },
    {
      label: 'WELCOME 등급',
      value: stats.welcome.toLocaleString(),
      icon: Award,
      badge:
        stats.total > 0
          ? {
              label: `${Math.round((stats.welcome / stats.total) * 100)}%`,
              variant: 'outline' as const,
            }
          : null,
    },
    {
      label: 'SHINE 등급',
      value: stats.shine.toLocaleString(),
      icon: Star,
      badge:
        stats.total > 0
          ? {
              label: `${Math.round((stats.shine / stats.total) * 100)}%`,
              variant: 'secondary' as const,
            }
          : null,
    },
    {
      label: 'STAR 등급',
      value: stats.star.toLocaleString(),
      icon: Crown,
      badge:
        stats.star > 0
          ? { label: '최고 등급', variant: 'default' as const }
          : null,
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
