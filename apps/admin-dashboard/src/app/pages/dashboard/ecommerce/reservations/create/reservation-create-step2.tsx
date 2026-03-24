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
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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

export function ReservationCreateStep2({ form }: Step2Props) {
  const { fetchAvailableSlots, availableSlots, isLoading } = useReservations();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // ✅ serviceIds[0] 으로 변경
  const serviceIds = form.watch('serviceIds');
  const serviceId = serviceIds?.[0];
  const selectedSlotId = form.watch('timeSlotId');

  useEffect(() => {
    if (!serviceId || !selectedDate) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    form.setValue('reservedDate', dateStr);
    form.setValue('reservedStartTime', '');
    form.setValue('reservedEndTime', '');
    form.setValue('timeSlotId', undefined);
    fetchAvailableSlots(serviceId, dateStr).then((res) => {});
  }, [selectedDate, serviceId, fetchAvailableSlots]);

  const handleSlotSelect = (slot: (typeof availableSlots)[0]) => {
    form.setValue('timeSlotId', slot.id);
    form.setValue('reservedStartTime', slot.startTime);
    form.setValue('reservedEndTime', slot.endTime);
  };

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
                      return date < today;
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
                  const startStr = toTimeStr(slot.startTime);
                  const endStr = toTimeStr(slot.endTime);

                  return (
                    <Button
                      key={slot.id}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      disabled={isFull}
                      onClick={() => handleSlotSelect(slot)}
                      className={cn(
                        'flex flex-col h-auto py-2 gap-0.5',
                        isFull && 'opacity-40'
                      )}
                    >
                      <span className="text-xs font-semibold">{startStr}</span>
                      <span className="text-xs opacity-70">~{endStr}</span>
                      <Badge
                        variant={
                          isFull
                            ? 'destructive'
                            : isSelected
                            ? 'secondary'
                            : 'outline'
                        }
                        className="mt-1 text-xs px-1 py-0"
                      >
                        {isFull
                          ? '마감'
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
