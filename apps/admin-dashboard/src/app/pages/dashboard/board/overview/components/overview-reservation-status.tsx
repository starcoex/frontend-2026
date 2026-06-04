import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ExportButton, useDetailDrawer } from '@starcoex-frontend/common';

interface Reservation {
  id: number;
  reservedDate: string;
  status: string;
}
interface WalkIn {
  id: number;
  status: string;
}

interface Props {
  reservations: Reservation[];
  walkIns: WalkIn[];
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '예약일시', key: 'reservedDate' },
  { header: '상태', key: 'status' },
];

// ─── 상세 드로어 ──────────────────────────────────────────────────────────────
function ReservationDetailDrawer({
  open,
  onOpenChange,
  reservation,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reservation: Reservation | null;
}) {
  const navigate = useNavigate();
  if (!reservation) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>예약 상세</SheetTitle>
          <SheetDescription>예약 #{reservation.id}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">예약 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">예약 ID</dt>
                <dd className="font-medium">#{reservation.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">예약일시</dt>
                <dd className="font-medium">
                  {format(
                    new Date(reservation.reservedDate),
                    'yyyy.MM.dd HH:mm',
                    { locale: ko }
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상태</dt>
                <dd>
                  <Badge variant="outline">{reservation.status}</Badge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 px-4 sm:px-6">
          <Button
            className="w-full"
            onClick={() => navigate(`/admin/reservations/${reservation.id}`)}
          >
            상세 페이지로 이동
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              navigate(`/admin/reservations/${reservation.id}/edit`)
            }
          >
            수정
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" className="w-full">
              닫기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function OverviewReservationStatus({
  reservations,
  walkIns,
  isLoading,
}: Props) {
  const navigate = useNavigate();
  const { selected, open, setOpen, openDrawer } =
    useDetailDrawer<Reservation>();

  const waiting = walkIns.filter((w) => w.status === 'WAITING').length;
  const inProgress = walkIns.filter((w) => w.status === 'IN_PROGRESS').length;

  const exportData = reservations.map((r) => ({
    reservedDate: format(new Date(r.reservedDate), 'yyyy.MM.dd HH:mm', {
      locale: ko,
    }),
    status: r.status,
  }));

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>예약 & 워크인</CardTitle>
              <CardDescription>오늘 예약 및 워크인 현황</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <ExportButton
                data={exportData}
                columns={EXPORT_COLUMNS}
                fileName="reservations"
                pdfTitle="예약 현황"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => navigate('/admin/reservations')}
              >
                전체보기
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md border p-3 text-center">
                  <p className="text-muted-foreground text-xs">대기</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {waiting}
                  </p>
                </div>
                <div className="rounded-md border p-3 text-center">
                  <p className="text-muted-foreground text-xs">진행중</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {inProgress}
                  </p>
                </div>
                <div className="rounded-md border p-3 text-center">
                  <p className="text-muted-foreground text-xs">오늘 예약</p>
                  <p className="text-2xl font-bold">{reservations.length}</p>
                </div>
              </div>

              <div className="space-y-2">
                {reservations.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span className="text-sm">
                      {format(new Date(r.reservedDate), 'MM.dd HH:mm', {
                        locale: ko,
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{r.status}</Badge>
                      {/* ⋮ 메뉴 */}
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
                          <DropdownMenuItem onClick={() => openDrawer(r)}>
                            상세보기
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/reservations/${r.id}/edit`)
                            }
                          >
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              navigate(`/admin/reservations/${r.id}`)
                            }
                          >
                            취소
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {reservations.length === 0 && (
                  <p className="text-muted-foreground text-center text-sm">
                    오늘 예약이 없습니다.
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ReservationDetailDrawer
        open={open}
        onOpenChange={setOpen}
        reservation={selected}
      />
    </>
  );
}
