import { MoreHorizontal, CheckCircle2, Circle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { UserAchievementItem } from '@starcoex-frontend/analytics';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  data: UserAchievementItem[];
  isLoading: boolean;
}

const LEVEL_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  diamond: 'default',
  gold: 'default',
  silver: 'secondary',
  bronze: 'outline',
};

const EXPORT_COLUMNS = [
  { header: '업적', key: 'title' },
  { header: '설명', key: 'description' },
  { header: '등급', key: 'level' },
  { header: '달성여부', key: 'statusLabel' },
];

export function UserAchievementList({ data, isLoading }: Props) {
  const completed = data.filter((d) => d.isCompleted).length;

  const exportData = data.map((item) => ({
    title: item.title,
    description: item.description,
    level: item.level,
    statusLabel: item.isCompleted ? '달성' : '미달성',
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>업적</CardTitle>
            <CardDescription>
              달성 {completed}/{data.length}개
            </CardDescription>
          </div>
          <ExportButton
            data={exportData}
            columns={EXPORT_COLUMNS}
            fileName="achievements"
            pdfTitle="업적 목록"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            업적이 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-start gap-3 rounded-md border px-3 py-2',
                  !item.isCompleted && 'opacity-50'
                )}
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                )}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.title}</span>
                    <Badge
                      variant={LEVEL_VARIANT[item.level] ?? 'outline'}
                      className="text-xs"
                    >
                      {item.level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {item.description}
                  </p>
                </div>
                {/* ⋮ 메뉴 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={item.isCompleted}>
                      {item.isCompleted ? '달성 완료' : '달성 조건 보기'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
