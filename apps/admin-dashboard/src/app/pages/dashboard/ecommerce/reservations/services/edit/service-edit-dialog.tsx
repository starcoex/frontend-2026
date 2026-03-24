import { useEffect, useState } from 'react';
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

const schema = z.object({
  name: z.string().min(1, '서비스 이름을 입력하세요.'),
  type: z.string().min(1),
  description: z.string().optional(),
  confirmationType: z.string().min(1),
  slotDuration: z.number().min(10),
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

export interface ReservableServiceItem {
  id: number;
  name: string;
  type: string;
  description?: string | null;
  confirmationType: string;
  slotDuration: number;
  maxAdvanceDays: number;
  minAdvanceHours: number;
  basePrice: number;
  depositRate: number;
  refundPolicyId: number;
  requiresPayment: boolean;
  allowWalkIn: boolean;
  isActive: boolean;
  isAvailable: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ReservableServiceItem | null;
  onSuccess: () => void;
}

export function ServiceEditDialog({
  open,
  onOpenChange,
  service,
  onSuccess,
}: Props) {
  const { updateReservableService, fetchRefundPolicies } = useReservations();
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

  // 서비스 데이터로 폼 초기화
  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        type: service.type,
        description: service.description ?? '',
        confirmationType: service.confirmationType,
        slotDuration: service.slotDuration,
        maxAdvanceDays: service.maxAdvanceDays,
        minAdvanceHours: service.minAdvanceHours,
        basePrice: service.basePrice,
        depositRate: service.depositRate,
        refundPolicyId: service.refundPolicyId,
        requiresPayment: service.requiresPayment,
        allowWalkIn: service.allowWalkIn,
        isActive: service.isActive,
        isAvailable: service.isAvailable,
      });
    }
  }, [service, form]);

  const onSubmit = async (data: FormValues) => {
    if (!service || !currentUser) return;

    const res = await updateReservableService({
      id: service.id,
      name: data.name,
      type: data.type,
      description: data.description,
      confirmationType: data.confirmationType,
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
      updatedById: currentUser.id,
    });

    if (res.success) {
      toast.success('서비스가 수정되었습니다.');
      onOpenChange(false);
      onSuccess();
    } else {
      toast.error(res.error?.message ?? '서비스 수정에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>서비스 수정</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>서비스 이름 *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>서비스 타입</FormLabel>
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      {refundPolicies.map((policy) => (
                        <SelectItem key={policy.id} value={String(policy.id)}>
                          {policy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                저장
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
