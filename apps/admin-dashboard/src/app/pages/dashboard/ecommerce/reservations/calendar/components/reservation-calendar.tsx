import { useState, useEffect, useMemo } from 'react';
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useReservations } from '@starcoex-frontend/reservations';
import type { Reservation } from '@starcoex-frontend/reservations';
import {
  RESERVATION_STATUS_OPTIONS,
  RESERVATION_STATUS_CONFIG,
} from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import type { ReservationStatusValue } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import { ReservationCalendarGrid } from './reservation-calendar-grid';
import { ReservationCalendarList } from './reservation-calendar-list';
import { format as formatDate } from 'date-fns';

type ViewMode = 'grid' | 'list';
type DateViewMode = 'day' | 'week' | 'month';

export function ReservationCalendar() {
  const navigate = useNavigate();
  const { reservations, fetchReservations, deleteReservation, isLoading } =
    useReservations();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [dateViewMode, setDateViewMode] = useState<DateViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);
  // 상태 뱃지 클릭 시 해당 상태의 예약 리스트를 표시하는 패널 상태
  const [statusPanelStatus, setStatusPanelStatus] =
    useState<ReservationStatusValue | null>(null);

  useEffect(() => {
    fetchReservations({});
  }, [fetchReservations]);

  // 날짜 네비게이션
  const goToPrev = () => {
    if (dateViewMode === 'day') setSelectedDate((prev) => subDays(prev, 1));
    else if (dateViewMode === 'week')
      setSelectedDate((prev) => subWeeks(prev, 1));
    else setSelectedDate((prev) => subMonths(prev, 1));
  };

  const goToNext = () => {
    if (dateViewMode === 'day') setSelectedDate((prev) => addDays(prev, 1));
    else if (dateViewMode === 'week')
      setSelectedDate((prev) => addWeeks(prev, 1));
    else setSelectedDate((prev) => addMonths(prev, 1));
  };

  const goToToday = () => setSelectedDate(new Date());

  // 표시 날짜 라벨
  const dateLabel = useMemo(() => {
    if (dateViewMode === 'day') {
      return format(selectedDate, 'yyyy년 M월 d일 (EEE)', { locale: ko });
    }
    if (dateViewMode === 'month') {
      return format(selectedDate, 'yyyy년 M월', { locale: ko });
    }
    const weekStart = startOfWeek(selectedDate, { locale: ko });
    const weekEnd = addDays(weekStart, 6);
    return `${format(weekStart, 'yyyy년 M월 d일', { locale: ko })} ~ ${format(
      weekEnd,
      'M월 d일',
      { locale: ko }
    )}`;
  }, [selectedDate, dateViewMode]);

  // 상태 필터 적용된 예약 목록
  const filteredReservations = useMemo(() => {
    if (statusFilter === 'ALL') return reservations;
    return reservations.filter((r) => r.status === statusFilter);
  }, [reservations, statusFilter]);

  // 상태별 카운트
  const statusCounts = useMemo(() => {
    const counts: Partial<Record<ReservationStatusValue, number>> = {};
    reservations.forEach((r) => {
      const s = r.status as ReservationStatusValue;
      counts[s] = (counts[s] ?? 0) + 1;
    });
    return counts;
  }, [reservations]);

  // 상태 패널에 표시할 예약 목록
  const statusPanelReservations = useMemo(() => {
    if (!statusPanelStatus) return [];
    return reservations.filter((r) => r.status === statusPanelStatus);
  }, [reservations, statusPanelStatus]);

  const handleDelete = async () => {
    if (!reservationToDelete) return;
    const res = await deleteReservation(reservationToDelete.id);
    if (res.success) {
      toast.success('예약이 삭제되었습니다.');
      fetchReservations({});
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
    setReservationToDelete(null);
  };

  const handleEdit = (reservation: Reservation) => {
    navigate(`/admin/reservations/${reservation.id}/edit`);
  };

  const handleAddClick = (date: string, time: string) => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (time) params.set('time', time);
    navigate(
      `/admin/reservations/create${params.size > 0 ? `?${params}` : ''}`
    );
  };

  // 상태 뱃지 클릭 핸들러
  const handleStatusBadgeClick = (status: ReservationStatusValue) => {
    if (statusPanelStatus === status) {
      // 같은 상태 재클릭 시 패널 닫기
      setStatusPanelStatus(null);
    } else {
      setStatusPanelStatus(status);
    }
  };

  const isCurrentPeriodToday =
    dateViewMode === 'day' ? isToday(selectedDate) : false;

  return (
    <>
      <div className="space-y-4">
        {/* 상단 컨트롤 */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* 왼쪽: 날짜 네비게이션 */}
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={dateViewMode}
              onValueChange={(v) => setDateViewMode(v as DateViewMode)}
            >
              <SelectTrigger className="h-9 w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">일간</SelectItem>
                <SelectItem value="week">주간</SelectItem>
                <SelectItem value="month">월간</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center rounded-lg border">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none border-r"
                onClick={goToPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[180px] px-3 text-center text-sm lg:min-w-[240px]">
                {dateLabel}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none border-l"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {!isCurrentPeriodToday && (
              <Button variant="outline" size="sm" onClick={goToToday}>
                오늘
              </Button>
            )}
          </div>

          {/* 오른쪽: 필터 + 뷰 전환 + 새로고침 + 추가 */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="전체 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  전체 ({reservations.length})
                </SelectItem>
                {RESERVATION_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                    {statusCounts[opt.value as ReservationStatusValue] !=
                      null && (
                      <span className="ml-1 text-muted-foreground">
                        ({statusCounts[opt.value as ReservationStatusValue]})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => fetchReservations({})}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>

            <div className="flex items-center rounded-md border">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button size="sm" onClick={() => handleAddClick('', '')}>
              <Plus className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">예약 추가</span>
            </Button>
          </div>
        </div>

        {/* 상태 요약 뱃지 */}
        {Object.keys(statusCounts).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {(
              Object.entries(statusCounts) as [ReservationStatusValue, number][]
            )
              .filter(([, count]) => count > 0)
              .map(([status, count]) => {
                const config = RESERVATION_STATUS_CONFIG[status];
                const isActive = statusPanelStatus === status;
                return (
                  <Badge
                    key={status}
                    variant={
                      isActive ? config?.variant ?? 'default' : 'outline'
                    }
                    className="cursor-pointer text-xs transition-all hover:opacity-80"
                    onClick={() => handleStatusBadgeClick(status)}
                  >
                    {config?.label ?? status}: {count}
                    {isActive && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
          </div>
        )}

        {/* 상태 클릭 시 해당 예약 리스트 패널 */}
        {statusPanelStatus && (
          <Card className="border-primary/20 bg-primary/[0.02]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Badge
                    variant={
                      RESERVATION_STATUS_CONFIG[statusPanelStatus]?.variant ??
                      'default'
                    }
                  >
                    {RESERVATION_STATUS_CONFIG[statusPanelStatus]?.label ??
                      statusPanelStatus}
                  </Badge>
                  <span>예약 목록</span>
                  <span className="text-muted-foreground font-normal text-sm">
                    ({statusPanelReservations.length}건)
                  </span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setStatusPanelStatus(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {statusPanelReservations.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  해당 상태의 예약이 없습니다.
                </p>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {statusPanelReservations.map((r) => {
                    const customerInfo = r.customerInfo as Record<
                      string,
                      string
                    > | null;
                    const customerName =
                      customerInfo?.name ?? customerInfo?.customerName ?? '-';
                    const customerPhone =
                      customerInfo?.phone ?? customerInfo?.customerPhone ?? '';
                    const formatTime = (dt: string) => {
                      try {
                        return new Date(dt).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        });
                      } catch {
                        return dt;
                      }
                    };
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm hover:border-primary/30 transition-colors"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-mono text-xs text-muted-foreground truncate">
                            {r.reservationNumber}
                          </span>
                          <span className="font-medium truncate">
                            {customerName}
                          </span>
                          {customerPhone && (
                            <span className="text-xs text-muted-foreground">
                              {customerPhone}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-0.5 ml-4 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {(() => {
                              try {
                                return formatDate(
                                  new Date(r.reservedDate),
                                  'M/d (EEE)',
                                  { locale: ko }
                                );
                              } catch {
                                return r.reservedDate;
                              }
                            })()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(r.reservedStartTime)} ~{' '}
                            {formatTime(r.reservedEndTime)}
                          </span>
                          <div className="flex gap-1 mt-0.5">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleEdit(r)}
                            >
                              수정
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                              onClick={() => setReservationToDelete(r)}
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* 그리드 뷰 */}
        {viewMode === 'grid' && (
          <ReservationCalendarGrid
            reservations={filteredReservations}
            selectedDate={selectedDate}
            viewMode={dateViewMode}
            onDelete={setReservationToDelete}
            onEdit={handleEdit}
            onAddClick={handleAddClick}
          />
        )}

        {/* 리스트 뷰 */}
        {viewMode === 'list' && (
          <ReservationCalendarList
            reservations={filteredReservations}
            onDelete={setReservationToDelete}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={!!reservationToDelete}
        onOpenChange={(open) => !open && setReservationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>예약 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              예약 번호{' '}
              <strong>{reservationToDelete?.reservationNumber}</strong>을(를)
              삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
