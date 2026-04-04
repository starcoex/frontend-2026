import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReservations } from '@starcoex-frontend/reservations';
import { useAuth } from '@starcoex-frontend/auth';
import { useState } from 'react';
import type { ConfirmationType } from '@starcoex-frontend/reservations';

const SERVICE_TYPES = [
  { value: 'CAR_WASH', label: '세차' },
  { value: 'CAR_CARE', label: '카케어' },
  { value: 'CAR_REPAIR', label: '정비' },
  { value: 'OIL_CHANGE', label: '오일교환' },
  { value: 'FUEL', label: '주유' },
  { value: 'EV_CHARGING', label: '전기차 충전' },
  { value: 'TABLE', label: '테이블' },
  { value: 'ROOM', label: '룸/공간' },
  { value: 'CONSULTATION', label: '상담' },
  { value: 'EVENT', label: '이벤트' },
] as const;

const CONFIRMATION_TYPES = [
  { value: 'AUTO', label: '자동 확정' },
  { value: 'MANUAL', label: '수동 확정' },
] as const;

const CONFIRMATION_TYPE_VALUES = CONFIRMATION_TYPES.map((t) => t.value);

const schema = z.object({
  name: z.string().min(1, '서비스 이름을 입력하세요.'),
  type: z.string().min(1, '서비스 타입을 선택하세요.'),
  description: z.string().optional(),
  confirmationType: z.enum(CONFIRMATION_TYPE_VALUES as [string, ...string[]]),
  slotDuration: z.number().min(10, '최소 10분 이상이어야 합니다.'),
  maxAdvanceDays: z.number().min(1),
  minAdvanceHours: z.number().min(0),
  basePrice: z.number().min(0),
  depositRate: z.number().min(0).max(1),
  refundPolicyId: z.number().min(1, '환불 정책을 선택하세요.'),
  requiresPayment: z.boolean(),
  allowWalkIn: z.boolean(),
  isActive: z.boolean(),
  isAvailable: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  onSuccess: () => void;
}

export function ServiceCreateDialog({
  open,
  onOpenChange,
  storeId,
  onSuccess,
}: Props) {
  const { createReservableService, fetchRefundPolicies } = useReservations();
  const { currentUser } = useAuth();
  const [refundPolicies, setRefundPolicies] = useState<
    { id: number; name: string }[]
  >([]);

  // 환불 정책 목록 로드
  useEffect(() => {
    if (!open) return;
    fetchRefundPolicies().then((res) => {
      if (res.success && res.data?.refundPolicies) {
        setRefundPolicies(res.data.refundPolicies);
      }
    });
  }, [open, fetchRefundPolicies]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      type: 'CAR_WASH',
      description: '',
      confirmationType: 'AUTO',
      slotDuration: 60,
      maxAdvanceDays: 30,
      minAdvanceHours: 1,
      basePrice: 0,
      depositRate: 0.2,
      refundPolicyId: 0,
      requiresPayment: false,
      allowWalkIn: false,
      isActive: true,
      isAvailable: true,
    },
  });

  // 환불 정책 로드 후 첫 번째 항목 자동 선택
  useEffect(() => {
    if (refundPolicies.length > 0 && form.getValues('refundPolicyId') === 0) {
      form.setValue('refundPolicyId', refundPolicies[0].id);
    }
  }, [refundPolicies, form]);

  const onSubmit = async (data: FormValues) => {
    if (!currentUser) return;

    const operatingHours = {
      mon: '09:00-18:00',
      tue: '09:00-18:00',
      wed: '09:00-18:00',
      thu: '09:00-18:00',
      fri: '09:00-18:00',
      sat: null,
      sun: null,
    };

    const res = await createReservableService({
      storeId,
      name: data.name,
      type: data.type,
      description: data.description,
      confirmationType: data.confirmationType as ConfirmationType,
      slotGenerationType: 'AUTO',
      slotDuration: data.slotDuration,
      maxAdvanceDays: data.maxAdvanceDays,
      minAdvanceHours: data.minAdvanceHours,
      basePrice: data.basePrice,
      depositRate: data.depositRate,
      refundPolicyId: data.refundPolicyId,
      requiresPayment: data.requiresPayment,
      allowWalkIn: data.allowWalkIn,
      isActive: data.isActive,
      isAvailable: data.isAvailable,
      operatingHours,
      createdById: currentUser.id,
      updatedById: currentUser.id,
    });

    if (res.success) {
      toast.success('서비스가 생성되었습니다.');
      onOpenChange(false);
      onSuccess();
      form.reset();
    } else {
      toast.error(res.error?.message ?? '서비스 생성에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>서비스 추가</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 서비스 이름 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>서비스 이름 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: 기본 세차" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 타입 + 비즈니스 타입 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>서비스 타입 *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 설명 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="서비스 설명을 입력하세요"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 슬롯/예약 설정 */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="slotDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>슬롯 단위 (분)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxAdvanceDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대 예약 일수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minAdvanceHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소 예약 시간</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 가격 설정 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>기본 가격 (₩)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depositRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>예약금 비율 (0~1)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 환불 정책 Select */}
            <FormField
              control={form.control}
              name="refundPolicyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>환불 정책 *</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="환불 정책을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {refundPolicies.length === 0 ? (
                        <SelectItem value="0" disabled>
                          등록된 환불 정책이 없습니다
                        </SelectItem>
                      ) : (
                        refundPolicies.map((policy) => (
                          <SelectItem key={policy.id} value={String(policy.id)}>
                            {policy.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 확정 방식 */}
            <FormField
              control={form.control}
              name="confirmationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>확정 방식</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONFIRMATION_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 토글 설정 */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'requiresPayment' as const, label: '결제 필요' },
                { name: 'allowWalkIn' as const, label: '워크인 허용' },
                { name: 'isActive' as const, label: '활성화' },
                { name: 'isAvailable' as const, label: '예약 가능' },
              ].map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border px-3 py-2">
                      <FormLabel className="cursor-pointer">
                        {item.label}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || refundPolicies.length === 0
                }
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                생성
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
