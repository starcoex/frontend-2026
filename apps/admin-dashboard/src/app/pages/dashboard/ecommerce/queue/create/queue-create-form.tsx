import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '@starcoex-frontend/queue';
import { useStores } from '@starcoex-frontend/stores';
import { useReservations } from '@starcoex-frontend/reservations';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QUEUE_ROUTES } from '@/app/constants/queue-routes';
import { useEffect, useState } from 'react';

const FormSchema = z
  .object({
    storeId: z.number().min(1, '매장을 선택하세요.'),
    serviceId: z.number().min(1, '서비스를 선택하세요.'),
    walkInId: z.number().min(1, '워크인을 선택하세요.'),
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
    guestVehicleNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasName = !!data.guestName?.trim();
    const hasPhone = !!data.guestPhone?.trim();
    const hasVehicle = !!data.guestVehicleNumber?.trim();
    if (!hasName && !hasPhone && !hasVehicle) {
      const message = '이름, 전화번호, 차량번호 중 하나는 반드시 입력하세요.';
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['guestName'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['guestPhone'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ['guestVehicleNumber'],
      });
    }
  });

type FormValues = z.infer<typeof FormSchema>;

export function QueueCreateForm() {
  const navigate = useNavigate();
  const { createQueueSessionByAdmin } = useQueue();
  const { stores, fetchStores } = useStores();
  const { fetchReservableServices, fetchWalkIns } = useReservations();

  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [walkIns, setWalkIns] = useState<{ id: number; label: string }[]>([]);
  // ↓ 로딩 상태를 별도로 추적
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [isWalkInsLoading, setIsWalkInsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      storeId: 0,
      serviceId: 0,
      walkInId: 0,
      guestName: '',
      guestPhone: '',
      guestVehicleNumber: '',
    },
  });

  const selectedStoreId = form.watch('storeId');

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    // 매장 변경 시 하위 선택 초기화
    form.setValue('serviceId', 0);
    form.setValue('walkInId', 0);
    setServices([]);
    setWalkIns([]);

    if (!selectedStoreId) return;

    // 서비스 조회
    setIsServicesLoading(true);
    fetchReservableServices({ storeId: selectedStoreId })
      .then((res) => {
        if (res.success && res.data) {
          const list = Array.isArray(res.data)
            ? res.data
            : (res.data as any).services ?? [];
          setServices(list.map((s: any) => ({ id: s.id, name: s.name })));
        }
      })
      .finally(() => setIsServicesLoading(false));

    // 워크인 조회
    setIsWalkInsLoading(true);
    fetchWalkIns({ storeId: selectedStoreId })
      .then((res) => {
        if (res.success && res.data?.walkIns) {
          setWalkIns(
            res.data.walkIns.map((w: any) => ({
              id: w.id,
              label: `#${w.id}${w.guestName ? ` - ${w.guestName}` : ''}`,
            }))
          );
        }
      })
      .finally(() => setIsWalkInsLoading(false));
  }, [selectedStoreId]); // ← fetchReservableServices, fetchWalkIns, form 제거: 무한루프 방지

  async function onSubmit(data: FormValues) {
    const res = await createQueueSessionByAdmin({
      storeId: data.storeId,
      serviceId: data.serviceId,
      walkInId: data.walkInId,
      guestName: data.guestName || undefined,
      guestPhone: data.guestPhone || undefined,
      guestVehicleNumber: data.guestVehicleNumber || undefined,
    });

    if (res.success) {
      toast.success(`대기 티켓 발급 완료: ${res.data?.session?.ticketNumber}`);
      navigate(QUEUE_ROUTES.LIST);
    } else {
      toast.error(res.error?.message ?? '등록에 실패했습니다.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>매장 및 서비스 선택</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 매장 */}
            <FormField
              control={form.control}
              name="storeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>매장 *</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="매장 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stores.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 서비스 */}
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>서비스 *</FormLabel>
                  <Select
                    // ↓ 로딩 중일 때만 disabled, 데이터 0건이어도 매장 선택 후엔 열림
                    disabled={!selectedStoreId || isServicesLoading}
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedStoreId
                              ? '매장을 먼저 선택하세요'
                              : isServicesLoading
                              ? '불러오는 중...'
                              : services.length === 0
                              ? '등록된 서비스 없음'
                              : '서비스 선택'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 워크인 */}
            <FormField
              control={form.control}
              name="walkInId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>워크인 *</FormLabel>
                  <Select
                    // ↓ 동일하게 로딩 중일 때만 disabled
                    disabled={!selectedStoreId || isWalkInsLoading}
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedStoreId
                              ? '매장을 먼저 선택하세요'
                              : isWalkInsLoading
                              ? '불러오는 중...'
                              : walkIns.length === 0
                              ? '등록된 워크인 없음'
                              : '워크인 선택'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {walkIns.map((w) => (
                        <SelectItem key={w.id} value={String(w.id)}>
                          {w.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 고객 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>고객 정보 (비회원)</CardTitle>
            <p className="text-muted-foreground text-sm">
              이름, 전화번호, 차량번호 중 <strong>하나 이상</strong> 입력하세요.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>고객 이름</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="홍길동 (선택)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guestPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>전화번호</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="010-0000-0000 (선택)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guestVehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>차량번호</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="12가 3456 (선택)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(QUEUE_ROUTES.LIST)}
          >
            취소
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? '등록 중...' : '대기 등록'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
