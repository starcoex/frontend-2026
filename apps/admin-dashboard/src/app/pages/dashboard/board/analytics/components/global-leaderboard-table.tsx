import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { LeaderboardEntryOutput } from '@starcoex-frontend/analytics';
import { ExportButton, useDetailDrawer } from '@starcoex-frontend/common';

interface Props {
  data: LeaderboardEntryOutput[];
  isLoading: boolean;
}

const RANK_STYLES: Record<number, string> = {
  1: 'text-yellow-500 font-bold',
  2: 'text-slate-400 font-bold',
  3: 'text-orange-500 font-bold',
};

const EXPORT_COLUMNS = [
  { header: '순위', key: 'rank' },
  { header: '닉네임', key: 'anonymousName' },
  { header: '배지', key: 'badge' },
  { header: '점수', key: 'scoreFormatted' },
  { header: '절약액', key: 'savingsFormatted' },
  { header: '상위 %', key: 'percentileFormatted' },
];

// ─── 상세 드로어 ──────────────────────────────────────────────────────────────
function LeaderboardDetailDrawer({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entry: LeaderboardEntryOutput | null;
}) {
  const navigate = useNavigate();
  if (!entry) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle className="flex items-center gap-2">
            <span className={cn(RANK_STYLES[entry.rank] ?? 'font-bold')}>
              #{entry.rank}
            </span>
            {entry.anonymousName}
          </SheetTitle>
          <SheetDescription>{entry.badge}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">랭킹 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              {[
                { label: '순위', value: `#${entry.rank}` },
                { label: '점수', value: `${entry.score.toLocaleString()}점` },
                {
                  label: '절약액',
                  value: `${entry.savings.toLocaleString()}원`,
                  className: 'text-emerald-500',
                },
                { label: '상위', value: `상위 ${entry.percentile}%` },
                { label: '배지', value: entry.badge },
              ].map(({ label, value, className }) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className={cn('font-medium', className)}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <SheetFooter className="flex-col gap-2 px-4 sm:px-6">
          <Button
            className="w-full"
            onClick={() => navigate(`/admin/users/${entry.userId}`)}
          >
            사용자 관리로 이동
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              닫기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── 모바일 카드 아이템 ───────────────────────────────────────────────────────
function LeaderboardMobileItem({
  entry,
  onDetail,
}: {
  entry: LeaderboardEntryOutput;
  onDetail: (entry: LeaderboardEntryOutput) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-2">
      {/* 순위 */}
      <span
        className={cn(
          'w-8 shrink-0 text-center text-sm',
          RANK_STYLES[entry.rank] ?? 'text-muted-foreground'
        )}
      >
        {entry.rank}
      </span>
      {/* 닉네임 + 배지 */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{entry.anonymousName}</p>
        <p className="text-xs text-muted-foreground">{entry.badge}</p>
      </div>
      {/* 점수 + 절약 */}
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold">
          {entry.score.toLocaleString()}점
        </p>
        <p className="text-xs text-emerald-500">
          {entry.savings.toLocaleString()}원
        </p>
      </div>
      {/* 액션 */}
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDetail(entry)}>
              상세보기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function GlobalLeaderboardTable({ data, isLoading }: Props) {
  const navigate = useNavigate();
  const { selected, open, setOpen, openDrawer } =
    useDetailDrawer<LeaderboardEntryOutput>();

  const exportData = data.map((entry) => ({
    rank: entry.rank,
    anonymousName: entry.anonymousName,
    badge: entry.badge,
    scoreFormatted: `${entry.score.toLocaleString()}점`,
    savingsFormatted: `${entry.savings.toLocaleString()}원`,
    percentileFormatted: `상위 ${entry.percentile}%`,
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>글로벌 리더보드</CardTitle>
              <CardDescription>전체 절약액 기준 상위 랭킹</CardDescription>
            </div>
            <ExportButton
              data={exportData}
              columns={EXPORT_COLUMNS}
              fileName="leaderboard"
              pdfTitle="글로벌 리더보드"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
              데이터가 없습니다.
            </div>
          ) : (
            <>
              {/* ── 모바일 (sm 미만) ── */}
              <div className="flex sm:hidden flex-col gap-2">
                {data.map((entry) => (
                  <LeaderboardMobileItem
                    key={entry.userId}
                    entry={entry}
                    onDetail={openDrawer}
                  />
                ))}
              </div>

              {/* ── 데스크탑 테이블 (sm 이상) ── */}
              <div className="hidden sm:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">순위</TableHead>
                      <TableHead>닉네임</TableHead>
                      <TableHead>배지</TableHead>
                      <TableHead className="text-right">점수</TableHead>
                      <TableHead className="text-right">절약액</TableHead>
                      <TableHead className="text-right">상위 %</TableHead>
                      <TableHead className="w-8" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((entry) => (
                      <TableRow key={entry.userId}>
                        <TableCell
                          className={cn(
                            'text-center',
                            RANK_STYLES[entry.rank] ?? 'text-muted-foreground'
                          )}
                        >
                          {entry.rank}
                        </TableCell>
                        <TableCell className="font-medium">
                          {entry.anonymousName}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs">{entry.badge}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.score.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-emerald-500">
                          {entry.savings.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-muted-foreground text-right text-xs">
                          상위 {entry.percentile}%
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openDrawer(entry)}
                              >
                                상세보기
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/users/${entry.userId}`)
                                }
                              >
                                사용자 관리로 이동
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <LeaderboardDetailDrawer
        open={open}
        onOpenChange={setOpen}
        entry={selected}
      />
    </>
  );
}
