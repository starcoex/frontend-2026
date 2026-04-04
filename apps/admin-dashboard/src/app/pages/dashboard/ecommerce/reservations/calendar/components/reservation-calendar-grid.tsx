import { useMemo } from 'react';
import {
  format,
  addDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Reservation } from '@starcoex-frontend/reservations';
import { RESERVATION_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import type { ReservationStatusValue } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import { ReservationCalendarCard } from './reservation-calendar-card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface ReservationCalendarGridProps {
  reservations: Reservation[];
  selectedDate: Date;
  viewMode: 'day' | 'week' | 'month';
  onDelete: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
  onAddClick: (date: string, time: string) => void;
}

const getReservationHour = (dateTimeStr: string): number => {
  try {
    return new Date(dateTimeStr).getHours();
  } catch {
    return -1;
  }
};

const formatDateStr = (date: Date): string => format(date, 'yyyy-MM-dd');

// MonthView 컴포넌트 내부 수정
function MonthView({
  reservations,
  selectedDate,
  onDelete,
  onEdit,
  onAddClick,
}: Omit<ReservationCalendarGridProps, 'viewMode'>) {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calStart = startOfWeek(monthStart, { locale: ko });
    const calEnd = endOfWeek(monthEnd, { locale: ko });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [selectedDate]);

  const getReservationsForDay = (date: Date): Reservation[] => {
    const dateStr = formatDateStr(date);
    return reservations.filter(
      (r) => (r.reservedDate?.slice(0, 10) ?? '') === dateStr
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="border-r py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, idx) => {
          const isCurrentMonth = isSameMonth(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const dayReservations = getReservationsForDay(date);
          const dateStr = formatDateStr(date);
          const MAX_VISIBLE = 3;
          const visibleReservations = dayReservations.slice(0, MAX_VISIBLE);
          const hiddenReservations = dayReservations.slice(MAX_VISIBLE);
          const hiddenCount = hiddenReservations.length;

          return (
            <div
              key={idx}
              className={`group min-h-[120px] border-b border-r p-1.5 last:border-r-0 [&:nth-child(7n)]:border-r-0
                ${!isCurrentMonth ? 'bg-muted/30' : ''}
                ${isToday ? 'bg-primary/[0.03]' : ''}
              `}
            >
              {/* 날짜 숫자 */}
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
                    ${isToday ? 'bg-primary text-primary-foreground' : ''}
                    ${
                      !isCurrentMonth
                        ? 'text-muted-foreground/50'
                        : 'text-foreground'
                    }
                  `}
                >
                  {format(date, 'd')}
                </span>
                {isCurrentMonth && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onAddClick(dateStr, '')}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* 예약 목록 */}
              <div className="space-y-0.5">
                {visibleReservations.map((reservation) => {
                  const config =
                    RESERVATION_STATUS_CONFIG[
                      reservation.status as ReservationStatusValue
                    ];
                  const customerInfo = reservation.customerInfo as Record<
                    string,
                    string
                  > | null;
                  const customerName =
                    customerInfo?.name ?? customerInfo?.customerName ?? '-';
                  return (
                    <div
                      key={reservation.id}
                      className="cursor-pointer truncate rounded px-1 py-0.5 text-[10px] font-medium hover:opacity-80"
                      style={{
                        backgroundColor: getStatusBgColor(config?.variant),
                        color: getStatusTextColor(config?.variant),
                      }}
                      onClick={() => onEdit(reservation)}
                      title={`${customerName} · ${
                        config?.label ?? reservation.status
                      }`}
                    >
                      {customerName}
                    </div>
                  );
                })}

                {/* 더보기 Popover */}
                {hiddenCount > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-full px-1 text-left text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded py-0.5 transition-colors">
                        +{hiddenCount}건 더보기
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3" align="start">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold">
                          {format(date, 'M월 d일 (EEE)', { locale: ko })}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          총 {dayReservations.length}건
                        </Badge>
                      </div>
                      <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
                        {dayReservations.map((reservation) => {
                          const config =
                            RESERVATION_STATUS_CONFIG[
                              reservation.status as ReservationStatusValue
                            ];
                          const customerInfo =
                            reservation.customerInfo as Record<
                              string,
                              string
                            > | null;
                          const customerName =
                            customerInfo?.name ??
                            customerInfo?.customerName ??
                            '-';
                          const customerPhone =
                            customerInfo?.phone ??
                            customerInfo?.customerPhone ??
                            '';
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
                              key={reservation.id}
                              className="flex items-center justify-between rounded-md border px-2.5 py-2 text-xs hover:border-primary/30 transition-colors"
                            >
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-mono text-[10px] text-muted-foreground truncate">
                                  {reservation.reservationNumber}
                                </span>
                                <span className="font-medium truncate">
                                  {customerName}
                                </span>
                                {customerPhone && (
                                  <span className="text-muted-foreground">
                                    {customerPhone}
                                  </span>
                                )}
                                <span className="text-muted-foreground">
                                  {formatTime(reservation.reservedStartTime)} ~{' '}
                                  {formatTime(reservation.reservedEndTime)}
                                </span>
                              </div>
                              <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                                {config && (
                                  <Badge
                                    variant={config.variant}
                                    className="text-[10px] px-1.5 py-0"
                                  >
                                    {config.label}
                                  </Badge>
                                )}
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-[10px]"
                                    onClick={() => onEdit(reservation)}
                                  >
                                    수정
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] text-destructive hover:text-destructive"
                                    onClick={() => onDelete(reservation)}
                                  >
                                    삭제
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 상태 variant → 배경색 매핑
function getStatusBgColor(variant?: string): string {
  switch (variant) {
    case 'success':
      return 'rgb(220 252 231)';
    case 'warning':
      return 'rgb(254 249 195)';
    case 'destructive':
      return 'rgb(254 226 226)';
    case 'secondary':
      return 'rgb(241 245 249)';
    case 'outline':
      return 'rgb(248 250 252)';
    default:
      return 'rgb(219 234 254)';
  }
}

function getStatusTextColor(variant?: string): string {
  switch (variant) {
    case 'success':
      return 'rgb(21 128 61)';
    case 'warning':
      return 'rgb(161 98 7)';
    case 'destructive':
      return 'rgb(185 28 28)';
    case 'secondary':
      return 'rgb(71 85 105)';
    case 'outline':
      return 'rgb(100 116 139)';
    default:
      return 'rgb(29 78 216)';
  }
}

export function ReservationCalendarGrid({
  reservations,
  selectedDate,
  viewMode,
  onDelete,
  onEdit,
  onAddClick,
}: ReservationCalendarGridProps) {
  // 월간 뷰
  if (viewMode === 'month') {
    return (
      <MonthView
        reservations={reservations}
        selectedDate={selectedDate}
        onDelete={onDelete}
        onEdit={onEdit}
        onAddClick={onAddClick}
      />
    );
  }

  // 일간/주간 공통
  const displayDates =
    viewMode === 'day'
      ? [selectedDate]
      : Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));

  const getReservationsForCell = (
    date: Date,
    timeSlot: string
  ): Reservation[] => {
    const slotHour = parseInt(timeSlot.split(':')[0], 10);
    const dateStr = formatDateStr(date);
    return reservations.filter((r) => {
      const reservedDate = r.reservedDate?.slice(0, 10) ?? '';
      if (reservedDate !== dateStr) return false;
      return getReservationHour(r.reservedStartTime) === slotHour;
    });
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex">
        {/* 시간 컬럼 (고정) */}
        <div className="z-10 w-[72px] flex-shrink-0 border-r">
          <div className="flex h-[52px] items-center justify-center border-b px-2">
            <span className="text-xs text-muted-foreground">시간</span>
          </div>
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className="flex h-[110px] items-start justify-center border-b p-2 text-xs text-muted-foreground last:border-b-0"
            >
              {slot}
            </div>
          ))}
        </div>

        {/* 날짜 컬럼들 */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-flex min-w-full">
            {displayDates.map((date, dateIdx) => {
              const isToday = isSameDay(date, new Date());
              return (
                <div
                  key={dateIdx}
                  className={`flex-shrink-0 border-r last:border-r-0 ${
                    viewMode === 'week' ? 'w-[160px]' : 'flex-1 min-w-[200px]'
                  }`}
                >
                  {/* 날짜 헤더 */}
                  <div
                    className={`flex h-[52px] flex-col items-center justify-center border-b px-2 ${
                      isToday ? 'bg-primary/5' : ''
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isToday ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {format(date, 'EEE', { locale: ko })}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isToday ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {format(date, 'M/d')}
                    </span>
                  </div>

                  {/* 시간 슬롯 */}
                  {TIME_SLOTS.map((slot, slotIdx) => {
                    const cellReservations = getReservationsForCell(date, slot);
                    const isEmpty = cellReservations.length === 0;
                    return (
                      <div
                        key={slotIdx}
                        className={`group relative h-[110px] border-b p-1.5 last:border-b-0 ${
                          isEmpty ? 'hover:bg-muted/40' : ''
                        } ${isToday ? 'bg-primary/[0.02]' : ''}`}
                      >
                        {isEmpty && (
                          <div className="flex h-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() =>
                                onAddClick(formatDateStr(date), slot)
                              }
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              추가
                            </Button>
                          </div>
                        )}
                        <div className="space-y-1">
                          {cellReservations.map((reservation) => (
                            <ReservationCalendarCard
                              key={reservation.id}
                              reservation={reservation}
                              onDelete={onDelete}
                              onEdit={onEdit}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
