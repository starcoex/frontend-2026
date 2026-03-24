import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CircleDollarSign, FileText, Settings2 } from 'lucide-react';
import { RESERVATION_STATUS_OPTIONS } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import { ReservationEditFormValues } from '@/app/pages/dashboard/ecommerce/reservations/edit/reservation-edit-schema';

interface Props {
  form: UseFormReturn<ReservationEditFormValues>;
}

const PAYMENT_TYPE_OPTIONS = [
  { value: 'PREPAID', label: '선불' },
  { value: 'DEPOSIT', label: '보증금' },
  { value: 'POSTPAID', label: '후불' },
  { value: 'FREE', label: '무료' },
] as const;

const CONFIRMATION_TYPE_OPTIONS = [
  { value: 'AUTO', label: '자동 확정' },
  { value: 'MANUAL', label: '수동 확정' },
] as const;

export function ReservationEditSectionPayment({ form }: Props) {
  const serviceAmount = form.watch('serviceAmount') ?? 0;
  const depositAmount = form.watch('depositAmount') ?? 0;
  const additionalAmount = form.watch('additionalAmount') ?? 0;

  const handleServiceAmountChange = (value: number) => {
    form.setValue('serviceAmount', value);
    form.setValue('totalAmount', value + depositAmount + additionalAmount);
  };

  const handleDepositAmountChange = (value: number) => {
    form.setValue('depositAmount', value);
    form.setValue('totalAmount', serviceAmount + value + additionalAmount);
  };

  const handleAdditionalAmountChange = (value: number) => {
    form.setValue('additionalAmount', value);
    form.setValue('totalAmount', serviceAmount + depositAmount + value);
  };

  return (
    <div className="space-y-4">
      {/* 상태 + 확정 방식 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings2 className="size-4 opacity-60" />
            예약 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>예약 상태 *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESERVATION_STATUS_OPTIONS.map((opt) => (
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
            <FormField
              control={form.control}
              name="confirmationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>확정 방식 *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
          </div>

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>변경 사유</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="상태 변경 사유를 입력하세요 (선택)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 결제 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CircleDollarSign className="size-4 opacity-60" />
            결제 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>결제 방식 *</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_TYPE_OPTIONS.map((opt) => (
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

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="serviceAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>서비스 금액 *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      onChange={(e) =>
                        handleServiceAmountChange(
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="depositAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>보증금</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      onChange={(e) =>
                        handleDepositAmountChange(
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>추가 금액</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      onChange={(e) =>
                        handleAdditionalAmountChange(
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <div className="flex items-center justify-between rounded-md bg-muted px-4 py-3">
            <span className="font-medium">총 결제 금액</span>
            <span className="text-lg font-bold">
              ₩{(form.watch('totalAmount') ?? 0).toLocaleString()}
            </span>
          </div>
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
                    placeholder="내부 메모 (선택)"
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
