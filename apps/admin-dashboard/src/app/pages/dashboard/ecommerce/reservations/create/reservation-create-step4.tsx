import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Settings2 } from 'lucide-react';
import type { ReservationCreateFormValues } from './reservation-create-schema';
import {
  formatReservationDate,
  formatReservationTime,
} from '@/app/utils/reservation-utils';

interface Step4Props {
  form: UseFormReturn<ReservationCreateFormValues>;
}

const CONFIRMATION_TYPE_OPTIONS = [
  { value: 'AUTO', label: '자동 확정' },
  { value: 'MANUAL', label: '수동 확정' },
] as const;

export function ReservationCreateStep4({ form }: Step4Props) {
  return (
    <div className="space-y-4">
      {/* 확정 방식 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings2 className="size-4 opacity-60" />
            예약 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="confirmationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>확정 방식 *</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="확정 방식 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONFIRMATION_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 예약 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">예약 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">예약일</dt>
              <dd className="font-medium">
                {form.watch('reservedDate')
                  ? formatReservationDate(form.watch('reservedDate'))
                  : '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">시간</dt>
              <dd className="font-medium">
                {form.watch('reservedStartTime')
                  ? `${formatReservationTime(
                      form.watch('reservedStartTime')
                    )} ~ ${formatReservationTime(
                      form.watch('reservedEndTime')
                    )}`
                  : '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">고객명</dt>
              <dd className="font-medium">
                {form.watch('customerName') || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">연락처</dt>
              <dd className="font-medium">
                {form.watch('customerPhone') || '-'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* 메모 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 opacity-60" />
            메모
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="내부 메모를 입력하세요 (선택)"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
