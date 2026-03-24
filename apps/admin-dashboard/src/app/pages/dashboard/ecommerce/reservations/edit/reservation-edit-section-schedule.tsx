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
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ReservationEditFormValues } from '@/app/pages/dashboard/ecommerce/reservations/edit/reservation-edit-schema';

interface Props {
  form: UseFormReturn<ReservationEditFormValues>;
  serviceId: number;
}

export function ReservationEditSectionSchedule({ form, serviceId }: Props) {
  const { fetchAvailableSlots, availableSlots, isLoading } = useReservations();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.getValues('reservedDate')
      ? new Date(form.getValues('reservedDate'))
      : undefined
  );

  const selectedSlotId = form.watch('timeSlotId');

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
                    disabled={(date) => date < new Date()}
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
              {form.watch('reservedDate')} {form.watch('reservedStartTime')} ~{' '}
              {form.watch('reservedEndTime')}
            </span>
          </div>

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
                return (
                  <Button
                    key={slot.id}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    disabled={isFull}
                    onClick={() => handleSlotSelect(slot)}
                    className={cn(
                      'flex h-auto flex-col gap-0.5 py-2',
                      isFull && 'opacity-40'
                    )}
                  >
                    <span className="text-xs font-semibold">
                      {slot.startTime}
                    </span>
                    <span className="text-xs opacity-70">~{slot.endTime}</span>
                    <Badge
                      variant={
                        isFull
                          ? 'destructive'
                          : isSelected
                          ? 'secondary'
                          : 'outline'
                      }
                      className="mt-1 px-1 py-0 text-xs"
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
        </CardContent>
      </Card>
    </div>
  );
}
