import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReservations } from '@starcoex-frontend/reservations';
import { useEffect, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ReservationEditFormValues } from '@/app/pages/dashboard/ecommerce/reservations/edit/reservation-edit-schema';
import {
  formatReservationPeriod,
  formatReservationTime,
} from '@/app/utils/reservation-utils';

interface Props {
  form: UseFormReturn<ReservationEditFormValues>;
  serviceId: number;
  minAdvanceHours?: number; // 서비스 설정값 (기본 1시간)
}

/**
 * "2026-03-29" 날짜 문자열 → 로컬 자정 Date 변환
 * new Date("2026-03-29")는 UTC 기준이라 한국에서 하루 밀림 방지
 */
const parseDateStrToLocal = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return undefined;
  const [year, month, day] = parts;
  const d = new Date(year, month - 1, day);
  return isValid(d) ? d : undefined;
};

/**
 * 슬롯 비활성화 여부 판단 (오늘 날짜인 경우만 시간 비교)
 */
const isSlotPast = (
  selectedDate: Date,
  slotStartTime: string,
  minAdvanceHours: number
): boolean => {
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const selectedMidnight = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  // 오늘이 아닌 미래 날짜는 모두 허용
  if (selectedMidnight > todayMidnight) return false;

  // 슬롯 시작 시간 파싱 (ISO 문자열)
  let slotDateTime: Date;
  try {
    slotDateTime = new Date(slotStartTime);
    if (!isValid(slotDateTime)) return false;
  } catch {
    return false;
  }

  // 현재 시간 + minAdvanceHours 이후여야 선택 가능
  const minAllowedTime = new Date(
    now.getTime() + minAdvanceHours * 60 * 60 * 1000
  );
  return slotDateTime <= minAllowedTime;
};

export function ReservationEditSectionSchedule({
  form,
  serviceId,
  minAdvanceHours = 1,
}: Props) {
  const {
    fetchAvailableSlots,
    fetchReservableServices,
    fetchScheduleBlockedDates,
    availableSlots,
    isLoading,
  } = useReservations();

  const reservedDateValue = form.getValues('reservedDate');

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    parseDateStrToLocal(reservedDateValue)
  );
  const [serviceMinAdvanceHours, setServiceMinAdvanceHours] =
    useState(minAdvanceHours);
  const [blockedDateStrs, setBlockedDateStrs] = useState<Set<string>>(
    new Set()
  );

  const selectedSlotId = form.watch('timeSlotId');
  const currentStart = form.watch('reservedStartTime');
  const currentEnd = form.watch('reservedEndTime');

  // 서비스 minAdvanceHours + 휴무일 불러오기
  useEffect(() => {
    if (!serviceId) return;

    fetchReservableServices({ isActive: true }).then((res) => {
      if (res.success && res.data?.services) {
        const found = res.data.services.find((s: any) => s.id === serviceId);
        if (found?.minAdvanceHours != null) {
          setServiceMinAdvanceHours(found.minAdvanceHours);
        }
      }
    });

    const today = format(new Date(), 'yyyy-MM-dd');
    const future = format(
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    );
    fetchScheduleBlockedDates({
      serviceId,
      dateFrom: today,
      dateTo: future,
    }).then((res) => {
      if (res.success && res.data?.blockedDates) {
        const fullDayBlocked = new Set(
          res.data.blockedDates
            .filter((bd: any) => bd.isFullDay)
            .map((bd: any) => {
              try {
                return format(parseISO(bd.date), 'yyyy-MM-dd');
              } catch {
                return bd.date?.slice(0, 10) ?? '';
              }
            })
        );
        setBlockedDateStrs(fullDayBlocked);
      }
    });
  }, [serviceId, fetchReservableServices, fetchScheduleBlockedDates]);

  useEffect(() => {
    if (serviceId && selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      form.setValue('reservedDate', dateStr);
      fetchAvailableSlots(serviceId, dateStr);
    }
  }, [selectedDate, serviceId]);

  const handleSlotSelect = (slot: (typeof availableSlots)[0]) => {
    form.setValue('timeSlotId', slot.id);
    form.setValue('reservedStartTime', slot.startTime);
    form.setValue('reservedEndTime', slot.endTime);
  };

  return (
    <div className="space-y-4">
      {/* 날짜 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="size-4 opacity-60" />
            예약 날짜
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <FormField
            control={form.control}
            name="reservedDate"
            render={() => (
              <FormItem>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) return true;
                      // 종일 휴무 날짜 비활성화
                      const dateStr = format(date, 'yyyy-MM-dd');
                      return blockedDateStrs.has(dateStr);
                    }}
                    locale={ko}
                    className="rounded-md border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 시간 슬롯 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4 opacity-60" />
            시간 슬롯
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 현재 예약 시간 표시 */}
          <div className="bg-muted mb-4 rounded-md p-3 text-sm">
            <span className="text-muted-foreground">현재 예약 시간: </span>
            <span className="font-semibold">
              {currentStart && currentEnd
                ? formatReservationPeriod(currentStart, currentEnd)
                : '-'}
            </span>
          </div>

          {/* 최소 예약 시간 안내 */}
          {serviceMinAdvanceHours > 0 && (
            <p className="text-muted-foreground mb-3 text-xs">
              ※ 최소 {serviceMinAdvanceHours}시간 전 예약만 가능합니다.
            </p>
          )}

          {!selectedDate ? (
            <p className="text-muted-foreground text-sm">
              날짜를 선택하면 슬롯이 표시됩니다.
            </p>
          ) : isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-muted-foreground text-sm">
                슬롯을 불러오는 중...
              </span>
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              선택한 날짜에 예약 가능한 슬롯이 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isFull = slot.currentBookings >= slot.maxCapacity;

                // ✅ 이전 시간 비활성화 (minAdvanceHours 적용)
                const isPast =
                  selectedDate !== undefined &&
                  isSlotPast(
                    selectedDate,
                    slot.startTime,
                    serviceMinAdvanceHours
                  );

                const isDisabled = isFull || isPast;
                const startStr = formatReservationTime(slot.startTime);
                const endStr = formatReservationTime(slot.endTime);

                return (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && handleSlotSelect(slot)}
                    className={cn(
                      'flex h-auto flex-col gap-0.5 py-2',
                      isDisabled && 'opacity-40 cursor-not-allowed'
                    )}
                    title={
                      isPast
                        ? `최소 ${serviceMinAdvanceHours}시간 전 예약만 가능합니다`
                        : isFull
                        ? '마감된 슬롯입니다'
                        : undefined
                    }
                  >
                    <span className="text-xs font-semibold">{startStr}</span>
                    <span className="text-xs opacity-70">~{endStr}</span>
                    <Badge
                      variant={
                        isFull
                          ? 'destructive'
                          : isPast
                          ? 'secondary'
                          : isSelected
                          ? 'secondary'
                          : 'outline'
                      }
                      className="mt-1 px-1 py-0 text-xs"
                    >
                      {isFull
                        ? '마감'
                        : isPast
                        ? '예약불가'
                        : `${slot.maxCapacity - slot.currentBookings}자리`}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
