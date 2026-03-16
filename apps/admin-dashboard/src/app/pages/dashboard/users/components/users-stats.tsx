import { IconInfoCircle } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  UserStatProps,
  userStatsConfig,
} from '@/app/pages/dashboard/users/data/users-data';

interface UsersStatsProps {
  stats: any;
  loading: boolean;
}

export function UsersStats({ stats, loading }: UsersStatsProps) {
  // useUsers.ts의 stats 구조와 일치: flat 객체
  const statsValues = {
    totalUsers: stats?.totalUsers ?? 0,
    activeUsers: stats?.activeUsers ?? 0,
    inactiveUsers: stats?.inactiveUsers ?? 0,
    emailUnverifiedUsers: stats?.emailUnverifiedUsers ?? 0,
  };

  // userStatsConfig 순서와 일치: 전체 → 활성 → 이메일 미인증 → 비활성
  const statValues = [
    statsValues.totalUsers.toLocaleString(),
    statsValues.activeUsers.toLocaleString(),
    statsValues.emailUnverifiedUsers.toLocaleString(),
    statsValues.inactiveUsers.toLocaleString(),
  ];

  const statsData: UserStatProps[] = userStatsConfig.map((config, index) => ({
    ...config,
    stat: loading ? '...' : statValues[index],
  }));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <UserStat key={stat.title} {...stat} />
      ))}
    </div>
  );
}

const UserStat = (props: UserStatProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <props.icon size={16} />
          {props.title}
        </CardTitle>
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger>
              <IconInfoCircle className="text-muted-foreground scale-90 stroke-[1.25]" />
              <span className="sr-only">상세 정보</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{props.desc}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold">{props.stat}</div>
        <p className="text-muted-foreground text-xs">{props.statDesc}</p>
      </CardContent>
    </Card>
  );
};
