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
import { CalendarDays, Clock, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import type { ReservationCreateFormValues } from './reservation-create-schema';
import { useReservations } from '@starcoex-frontend/reservations';
import { useEffect, useState, useMemo } from 'react';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface Step2Props {
  form: UseFormReturn<ReservationCreateFormValues>;
}

// DateTime 문자열에서 HH:mm 추출
const toTimeStr = (dateTimeStr: string) => {
  try {
    return format(new Date(dateTimeStr), 'HH:mm');
  } catch {
    return dateTimeStr;
  }
};

/**
 * 슬롯 비활성화 여부 판단
 * - 선택 날짜가 오늘인 경우에만 시간 비교
 * - slotTime: "HH:mm" 또는 ISO 문자열
 */
const isSlotDisabled = (
  selectedDate: Date,
  slotTime: string,
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

  // 오늘이 아닌 미래 날짜는 항상 허용
  if (selectedMidnight > todayMidnight) return false;

  // 슬롯 시작 시간 파싱 (ISO 또는 HH:mm 모두 대응)
  let slotDateTime: Date;
  try {
    const parsed = new Date(slotTime);
    if (!isNaN(parsed.getTime())) {
      slotDateTime = parsed;
    } else {
      const [h, m] = slotTime.split(':').map(Number);
      slotDateTime = new Date(selectedDate);
      slotDateTime.setHours(h, m, 0, 0);
    }
  } catch {
    return false;
  }

  // 현재 시간 + minAdvanceHours 이후여야 선택 가능
  const minAllowedTime = new Date(
    now.getTime() + minAdvanceHours * 60 * 60 * 1000
  );

  return slotDateTime <= minAllowedTime;
};

export function ReservationCreateStep2({ form }: Step2Props) {
  const {
    fetchAvailableSlots,
    fetchReservableServices,
    fetchScheduleBlockedDates,
    availableSlots,
    isLoading,
  } = useReservations();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [serviceConfig, setServiceConfig] = useState<{
    minAdvanceHours: number;
    slotDuration: number;
  } | null>(null);
  const [blockedDateStrs, setBlockedDateStrs] = useState<Set<string>>(
    new Set()
  );

  const serviceIds = form.watch('serviceIds');
  const serviceId = serviceIds?.[0];
  const storeId = form.watch('storeId');
  const selectedSlotId = form.watch('timeSlotId');

  // 선택된 서비스의 설정값(minAdvanceHours, slotDuration) 불러오기
  useEffect(() => {
    if (!serviceId || !storeId) return;

    fetchReservableServices({ storeId, isActive: true }).then((res) => {
      if (res.success && res.data?.services) {
        const found = res.data.services.find((s: any) => s.id === serviceId);
        if (found) {
          setServiceConfig({
            minAdvanceHours: found.minAdvanceHours ?? 1,
            slotDuration: found.slotDuration ?? 60,
          });
        }
      }
    });

    // 휴무일 조회 (오늘부터 3개월)
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
  }, [serviceId, storeId, fetchReservableServices, fetchScheduleBlockedDates]);
  useEffect(() => {
    if (!serviceId || !selectedDate) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    form.setValue('reservedDate', dateStr);
    form.setValue('reservedStartTime', '');
    form.setValue('reservedEndTime', '');
    form.setValue('timeSlotId', undefined);
    void fetchAvailableSlots(serviceId, dateStr);
  }, [selectedDate, serviceId, fetchAvailableSlots]);

  const handleSlotSelect = (slot: (typeof availableSlots)[0]) => {
    form.setValue('timeSlotId', slot.id);
    form.setValue('reservedStartTime', slot.startTime);
    form.setValue('reservedEndTime', slot.endTime);
  };

  // minAdvanceHours 기준 비활성화 안내 메시지
  const advanceNotice = useMemo(() => {
    if (!serviceConfig) return null;
    const { minAdvanceHours } = serviceConfig;
    if (minAdvanceHours <= 0) return null;
    return `※ 최소 ${minAdvanceHours}시간 전 예약만 가능합니다.`;
  }, [serviceConfig]);

  return (
    <div className="space-y-4">
      {/* 날짜 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="size-4 opacity-60" />
            날짜 선택
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
                {blockedDateStrs.size > 0 && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    🚫 회색 날짜는 휴무일입니다.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 서비스 미선택 경고 */}
      {!serviceId && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">
              ⚠️ 1단계에서 서비스를 선택해야 시간 슬롯을 조회할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 시간 슬롯 선택 */}
      {serviceId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 opacity-60" />
              시간 슬롯 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 최소 예약 시간 안내 */}
            {advanceNotice && (
              <p className="text-muted-foreground mb-3 text-xs">
                {advanceNotice}
              </p>
            )}

            {!selectedDate ? (
              <p className="text-muted-foreground text-sm">
                날짜를 먼저 선택하세요.
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

                  // DB에서 불러온 minAdvanceHours 기준으로 비활성화
                  const isPast =
                    serviceConfig !== null &&
                    selectedDate !== undefined &&
                    isSlotDisabled(
                      selectedDate,
                      slot.startTime,
                      serviceConfig.minAdvanceHours
                    );

                  const isDisabled = isFull || isPast;
                  const startStr = toTimeStr(slot.startTime);
                  const endStr = toTimeStr(slot.endTime);

                  return (
                    <Button
                      key={slot.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      disabled={isDisabled}
                      onClick={() => !isDisabled && handleSlotSelect(slot)}
                      className={cn(
                        'flex flex-col h-auto py-2 gap-0.5',
                        isDisabled && 'opacity-40 cursor-not-allowed'
                      )}
                      title={
                        isPast
                          ? `최소 ${serviceConfig?.minAdvanceHours}시간 전 예약만 가능합니다`
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
                        className="mt-1 text-xs px-1 py-0"
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

            {/* 선택된 슬롯 표시 */}
            {form.watch('reservedStartTime') && (
              <div className="bg-muted mt-4 rounded-md p-3 text-sm">
                ✅ 선택:{' '}
                <span className="font-semibold">
                  {form.watch('reservedDate')}{' '}
                  {toTimeStr(form.watch('reservedStartTime'))} ~{' '}
                  {toTimeStr(form.watch('reservedEndTime'))}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
