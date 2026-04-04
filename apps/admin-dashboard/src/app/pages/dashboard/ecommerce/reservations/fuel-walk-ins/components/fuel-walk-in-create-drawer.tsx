import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useFuelWalkIns } from '@starcoex-frontend/reservations';
import { useStores } from '@starcoex-frontend/stores';
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common';
import { FUEL_TYPE_LABELS } from '@/app/pages/dashboard/ecommerce/reservations/data/fuel-walk-in-data';

type RequestType = 'LITER' | 'AMOUNT' | 'FULL';

const FuelWalkInCreateSchema = z.object({
  storeId: z.number().min(1, '매장을 선택하세요.'),
  userId: z.number().min(1, '고객을 선택하세요.'),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'PREMIUM_GASOLINE', 'KEROSENE']),
  requestType: z.enum(['LITER', 'AMOUNT', 'FULL']),
  requestedLiters: z.number().min(0).optional(),
  requestedAmount: z.number().min(0).optional(),
  isPrepaid: z.boolean(),
  vehicleId: z.number().optional(),
  resourceId: z.number().optional(),
  productId: z.number().optional(),
  notes: z.string().optional(),
});

type FuelWalkInCreateFormValues = z.infer<typeof FuelWalkInCreateSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function FuelWalkInCreateDrawer({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { createFuelWalkIn } = useFuelWalkIns();
  const { stores, fetchStores } = useStores();
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

  useEffect(() => {
    if (open) fetchStores();
  }, [open, fetchStores]);

  const form = useForm<FuelWalkInCreateFormValues>({
    resolver: zodResolver(FuelWalkInCreateSchema),
    defaultValues: {
      storeId: 0,
      userId: 0,
      customerName: '',
      customerPhone: '',
      fuelType: 'GASOLINE',
      requestType: 'FULL',
      requestedLiters: undefined,
      requestedAmount: undefined,
      isPrepaid: false,
      vehicleId: undefined,
      resourceId: undefined,
      productId: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
      setSelectedCustomer(null);
    }
  }, [open, form]);

  const requestType = form.watch('requestType');
  const isPrepaid = form.watch('isPrepaid');

  const handleSelectCustomer = (customer: SelectedCustomer) => {
    setSelectedCustomer(customer);
    form.setValue('userId', customer.userId, { shouldValidate: true });
    form.setValue('customerName', customer.name);
    form.setValue('customerPhone', customer.phone);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    form.setValue('userId', 0);
    form.setValue('customerName', '');
    form.setValue('customerPhone', '');
  };

  const onSubmit = async (data: FuelWalkInCreateFormValues) => {
    try {
      const requestedAmount =
        data.requestType === 'AMOUNT' ? data.requestedAmount : undefined;

      const res = await createFuelWalkIn({
        storeId: data.storeId,
        fuelType: data.fuelType,
        requestedAmount,
        isPrepaid: data.isPrepaid,
        productId: data.productId,
        customerName: data.customerName || undefined,
        customerPhone: data.customerPhone || undefined,
        vehicleId: data.vehicleId,
        resourceId: data.resourceId,
        notes: data.notes || undefined,
      });

      if (res.success) {
        toast.success('주유 워크인이 등록되었습니다.');
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.error?.message ?? '등록에 실패했습니다.');
      }
    } catch {
      toast.error('주유 워크인 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>주유 워크인 등록</SheetTitle>
          <SheetDescription>현장 주유 고객을 등록합니다.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="fuel-walk-in-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6"
          >
            {/* 매장 */}
            <FormField
              control={form.control}
              name="storeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>매장 *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="매장 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={String(store.id)}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* 고객 정보 — CustomerSearch */}
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-medium">
                <User className="size-4 opacity-60" />
                고객 정보 *
              </p>
              <CustomerSearch
                selected={selectedCustomer}
                onSelect={handleSelectCustomer}
                onClear={handleClearCustomer}
                enableCreate={true}
              />
              <FormField
                control={form.control}
                name="userId"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* 주유 정보 */}
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              주유 정보
            </p>

            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>유종 *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(FUEL_TYPE_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 요청 방식 */}
            <FormField
              control={form.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>요청 방식 *</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { value: 'LITER', label: '리터 지정' },
                          { value: 'AMOUNT', label: '금액 지정' },
                          { value: 'FULL', label: '가득' },
                        ] as { value: RequestType; label: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                            field.value === opt.value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 리터 지정 입력 — {…field} spread 없이 명시적 props */}
            {requestType === 'LITER' && (
              <FormField
                control={form.control}
                name="requestedLiters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>요청 리터 (L) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.1}
                        placeholder="예: 30"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {isPrepaid
                        ? '현재 단가로 금액을 계산하여 선결제합니다.'
                        : '주유 후 실제 리터로 정산됩니다.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 금액 지정 입력 — {…field} spread 없이 명시적 props */}
            {requestType === 'AMOUNT' && (
              <FormField
                control={form.control}
                name="requestedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>요청 금액 (원) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        placeholder="예: 50000"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {isPrepaid
                        ? '선결제 후 미달 주유 시 차액이 환불됩니다.'
                        : '주유 후 해당 금액만큼 결제합니다.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isPrepaid && requestType === 'FULL' && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                ⚠️ 가득 + 선결제: 최대 용량 기준 예상 금액을 선결제하며, 실제
                주유 확정 후 차액이 환불됩니다.
              </div>
            )}

            <Separator />

            {/* 결제 정보 */}
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              결제 정보
            </p>

            {/* 결제 시점 표시 (읽기 전용) */}
            <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <span>결제 시점</span>
              <Badge variant={isPrepaid ? 'default' : 'secondary'}>
                {isPrepaid ? '선결제' : '후결제'}
              </Badge>
            </div>

            <Separator />

            {/* 차량 ID — {…field} spread 없이 명시적 props */}
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>차량 ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="차량 ID (선택)"
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* 메모 */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>메모</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="특이사항을 입력하세요"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className="gap-2 px-4 sm:px-6">
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <Button
            form="fuel-walk-in-form"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? '등록 중...' : '등록'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
