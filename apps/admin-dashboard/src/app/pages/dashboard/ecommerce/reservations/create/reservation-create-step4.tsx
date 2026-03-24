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
import { CircleDollarSign, FileText } from 'lucide-react';
import type { ReservationCreateFormValues } from './reservation-create-schema';

interface Step4Props {
  form: UseFormReturn<ReservationCreateFormValues>;
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

export function ReservationCreateStep4({ form }: Step4Props) {
  const serviceAmount = form.watch('serviceAmount') ?? 0;
  const depositAmount = form.watch('depositAmount') ?? 0;

  // 총액 자동 계산
  const handleServiceAmountChange = (value: number) => {
    form.setValue('serviceAmount', value);
    form.setValue('totalAmount', value + depositAmount);
  };

  const handleDepositAmountChange = (value: number) => {
    form.setValue('depositAmount', value);
    form.setValue('totalAmount', serviceAmount + value);
  };

  return (
    <div className="space-y-4">
      {/* 결제 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CircleDollarSign className="size-4 opacity-60" />
            결제 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>결제 방식 *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="결제 방식 선택" />
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
                      placeholder="0"
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
                      placeholder="0"
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
          </div>

          {/* 총액 표시 */}
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

      {/* 최종 확인 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">예약 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">예약일</dt>
              <dd className="font-medium">
                {form.watch('reservedDate') || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">시간</dt>
              <dd className="font-medium">
                {form.watch('reservedStartTime')
                  ? `${form.watch('reservedStartTime')} ~ ${form.watch(
                      'reservedEndTime'
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
            <Separator />
            <div className="flex justify-between font-semibold">
              <dt>총액</dt>
              <dd>₩{(form.watch('totalAmount') ?? 0).toLocaleString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
