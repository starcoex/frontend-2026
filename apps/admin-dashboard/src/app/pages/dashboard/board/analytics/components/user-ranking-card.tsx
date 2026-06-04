import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRankingOutput } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: UserRankingOutput | null;
  isLoading: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  diamond: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  silver: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  bronze:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  newbie: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const EXPORT_COLUMNS = [
  { header: '구분', key: 'type' },
  { header: '순위', key: 'rank' },
  { header: '점수', key: 'scoreFormatted' },
  { header: '배지', key: 'badge' },
  { header: '상위 %', key: 'percentileFormatted' },
];

export function UserRankingCard({ data, isLoading }: Props) {
  const total = data?.total;
  const monthly = data?.monthly;

  const exportData = [
    {
      type: '전체 랭킹',
      rank: total?.rank != null ? `#${total.rank}` : '-',
      scoreFormatted: `${total?.score?.toLocaleString() ?? 0}점`,
      badge: total?.badge ?? '-',
      percentileFormatted:
        total?.percentile != null ? `상위 ${total.percentile}%` : '-',
    },
    {
      type: '월간 랭킹',
      rank: monthly?.rank != null ? `#${monthly.rank}` : '-',
      scoreFormatted: `${monthly?.score?.toLocaleString() ?? 0}점`,
      badge: monthly?.badge ?? '-',
      percentileFormatted:
        monthly?.percentile != null ? `상위 ${monthly.percentile}%` : '-',
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />내 랭킹
          </CardTitle>
          <ExportButton
            data={exportData}
            columns={EXPORT_COLUMNS}
            fileName="my-ranking"
            pdfTitle="내 랭킹"
          />
        </div>
        <CardDescription>전체 및 월간 랭킹 정보</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            {/* 전체 랭킹 */}
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground mb-1 text-xs">전체 랭킹</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {total?.rank != null ? `#${total.rank}` : '-'}
                  </span>
                  {total?.badge && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        BADGE_STYLES[total.badge] ?? BADGE_STYLES['newbie']
                      )}
                    >
                      {total.badge}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {total?.score?.toLocaleString() ?? 0}점
                  </p>
                  {total?.percentile != null && (
                    <p className="text-muted-foreground text-xs">
                      상위 {total.percentile}%
                    </p>
                  )}
                </div>
              </div>
              {total?.message && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {total.message}
                </p>
              )}
            </div>

            {/* 월간 랭킹 */}
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground mb-1 text-xs">월간 랭킹</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {monthly?.rank != null ? `#${monthly.rank}` : '-'}
                  </span>
                  {monthly?.badge && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        BADGE_STYLES[monthly.badge] ?? BADGE_STYLES['newbie']
                      )}
                    >
                      {monthly.badge}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {monthly?.score?.toLocaleString() ?? 0}점
                  </p>
                  {monthly?.percentile != null && (
                    <p className="text-muted-foreground text-xs">
                      상위 {monthly.percentile}%
                    </p>
                  )}
                </div>
              </div>
            </div>

            {total?.totalUsers != null && (
              <p className="text-muted-foreground text-center text-xs">
                전체 {total.totalUsers.toLocaleString()}명 중
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
