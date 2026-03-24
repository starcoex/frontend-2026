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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useReservations } from '@starcoex-frontend/reservations';
import { useStores } from '@starcoex-frontend/stores';
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common';

const WalkInCreateSchema = z.object({
  storeId: z.number().min(1, '매장을 선택하세요.'),
  serviceId: z.number().min(1, '서비스를 선택하세요.'),
  userId: z.number().min(1, '고객을 선택하세요.'),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  vehicleId: z.number().optional(),
  resourceId: z.number().optional(),
  notes: z.string().optional(),
});

type WalkInCreateFormValues = z.infer<typeof WalkInCreateSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WalkInCreateDrawer({ open, onOpenChange, onSuccess }: Props) {
  const { createWalkIn, fetchReservableServices } = useReservations();
  const { stores, fetchStores } = useStores();
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

  const form = useForm<WalkInCreateFormValues>({
    resolver: zodResolver(WalkInCreateSchema),
    defaultValues: {
      storeId: 0,
      serviceId: 0,
      userId: 0,
      customerName: '',
      customerPhone: '',
      notes: '',
    },
  });

  const storeId = form.watch('storeId');

  useEffect(() => {
    if (open) fetchStores();
  }, [open, fetchStores]);

  useEffect(() => {
    if (open) {
      form.reset();
      setSelectedCustomer(null);
    }
  }, [open, form]);

  useEffect(() => {
    if (!storeId) {
      setServices([]);
      return;
    }
    fetchReservableServices({ storeId }).then((res) => {
      if (res.success && res.data?.services) {
        setServices(res.data.services.map((s) => ({ id: s.id, name: s.name })));
      }
    });
  }, [storeId, fetchReservableServices]);

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

  const onSubmit = async (data: WalkInCreateFormValues) => {
    try {
      const res = await createWalkIn({
        storeId: data.storeId,
        serviceId: data.serviceId,
        customerName: data.customerName || undefined,
        customerPhone: data.customerPhone || undefined,
        vehicleId: data.vehicleId,
        resourceId: data.resourceId,
        notes: data.notes || undefined,
      });

      if (res.success) {
        toast.success('워크인이 등록되었습니다.');
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.error?.message ?? '워크인 등록에 실패했습니다.');
      }
    } catch {
      toast.error('워크인 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>워크인 등록</SheetTitle>
          <SheetDescription>현장 방문 고객을 등록합니다.</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="walk-in-form"
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
                      onValueChange={(v) => {
                        field.onChange(Number(v));
                        form.setValue('serviceId', 0);
                      }}
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

            {/* 서비스 */}
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>서비스 *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                      disabled={!storeId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            storeId ? '서비스 선택' : '매장을 먼저 선택하세요'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name}
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

            {/* 차량 ID */}
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>차량 ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="차량 ID (선택)"
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
                      rows={3}
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
            form="walk-in-form"
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
