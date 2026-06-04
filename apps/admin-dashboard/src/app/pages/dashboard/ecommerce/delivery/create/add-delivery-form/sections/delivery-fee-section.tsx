import { UseFormReturn, useWatch } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DeliveryFormValues } from '../add-delivery-form.schema';
import { PRIORITY_OPTIONS } from '../add-delivery-form.constants';
import { DeliveryFeePolicy, useDelivery } from '@starcoex-frontend/delivery';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconCalculator } from '@tabler/icons-react';

interface Props {
  form: UseFormReturn<DeliveryFormValues>;
}

export function DeliveryFeeSection({ form }: Props) {
  const deliveryFee = useWatch({ control: form.control, name: 'deliveryFee' });
  const driverFee = useWatch({ control: form.control, name: 'driverFee' });
  const platformFee = Math.max(0, (deliveryFee ?? 0) - (driverFee ?? 0));

  const { fetchDeliveryFeePolicies, calculateDeliveryFee } = useDelivery();
  const [policies, setPolicies] = useState<DeliveryFeePolicy[]>([]);

  useEffect(() => {
    fetchDeliveryFeePolicies(true).then((res) => {
      // onlyActive: true
      if (res.success && res.data?.policies) setPolicies(res.data.policies);
    });
  }, [fetchDeliveryFeePolicies]);

  // 정책 선택 시 자동 계산
  const handlePolicyChange = useCallback(
    async (policyIdStr: string) => {
      // ✅ "none" 선택 시 정책 해제
      if (policyIdStr === 'none') {
        form.setValue('feePolicyId', undefined);
        return;
      }

      const policyId = parseInt(policyIdStr);
      form.setValue('feePolicyId', policyId);

      const priority = form.getValues('priority');
      const res = await calculateDeliveryFee({ policyId, priority });

      if (res.success && res.data) {
        form.setValue('deliveryFee', res.data.deliveryFee, {
          shouldValidate: true,
        });
        form.setValue('driverFee', res.data.driverFee, {
          shouldValidate: true,
        });
        form.setValue('platformFee', res.data.platformFee);
      }
    },
    [form, calculateDeliveryFee]
  );

  // 수동 재계산
  const handleRecalc = useCallback(async () => {
    const policyId = form.getValues('feePolicyId');
    const priority = form.getValues('priority');
    if (!policyId) return;

    const res = await calculateDeliveryFee({ policyId, priority });
    if (res.success && res.data) {
      form.setValue('deliveryFee', res.data.deliveryFee, {
        shouldValidate: true,
      });
      form.setValue('driverFee', res.data.driverFee, { shouldValidate: true });
      form.setValue('platformFee', res.data.platformFee);
    }
  }, [form, calculateDeliveryFee]);

  return (
    <div className="space-y-4">
      {/* ✅ 신규: 배달비 정책 선택 */}
      <FormField
        control={form.control}
        name="feePolicyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>배달비 정책 (선택)</FormLabel>
            <div className="flex gap-2">
              <Select
                value={field.value ? String(field.value) : 'none'} // ✅ undefined → "none"
                onValueChange={handlePolicyChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="정책 선택 시 자동 계산" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">직접 입력</SelectItem>{' '}
                  {policies.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                      {p.isDefault && ' (기본)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRecalc}
                  title="재계산"
                >
                  <IconCalculator className="h-4 w-4" />
                </Button>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* 요금 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>요금 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="deliveryFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>배송비 (고객) *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    step={100}
                    placeholder="0"
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  고객이 지불하는 배송비
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="driverFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>기사 수령액 *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    step={100}
                    placeholder="0"
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  배달기사에게 지급되는 금액
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* 플랫폼 수수료 자동 계산 */}
          <FormField
            control={form.control}
            name="platformFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>플랫폼 수수료</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={platformFee}
                    type="number"
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormDescription className="text-xs text-blue-600">
                  배송비 − 기사 수령액으로 자동 계산됨
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 요금 요약 */}
          <div className="bg-muted space-y-1 rounded-md p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">배송비</span>
              <span className="font-medium">
                {(deliveryFee ?? 0).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">기사 수령액</span>
              <span className="font-medium">
                {(driverFee ?? 0).toLocaleString()}원
              </span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-semibold">
              <span>플랫폼 수수료</span>
              <span className="text-primary">
                {platformFee.toLocaleString()}원
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 배송 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>배송 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>우선순위 *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="우선순위 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {PRIORITY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 정산 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">정산 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs leading-relaxed">
            기사 수령액은 배송 완료 후{' '}
            <strong>기사별 정산 (DriverSettlement)</strong>에 자동 누적됩니다.
            정산은 관리자 승인 후 지급됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
