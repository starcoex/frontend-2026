import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
import { Separator } from '@/components/ui/separator';
import {
  useInventory,
  type StoreInventory,
} from '@starcoex-frontend/inventory';

const FormSchema = z.object({
  volumeLiters: z
    .number({ error: '리터 수를 입력하세요.' })
    .min(0.1, '0.1L 이상이어야 합니다.'),
  deliveryId: z.number().int().optional(),
  notes: z.string().max(200, '200자 이내로 입력하세요.').optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface InventoryAddFuelStockDrawerProps {
  inventory: StoreInventory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryAddFuelStockDrawer({
  inventory,
  open,
  onOpenChange,
}: InventoryAddFuelStockDrawerProps) {
  const { addFuelStock, fetchInventoryById } = useInventory();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { volumeLiters: 0, deliveryId: undefined, notes: '' },
  });

  const isSubmitting = form.formState.isSubmitting;
  const watchedVolume = form.watch('volumeLiters') || 0;
  const currentVolume = Number(inventory.currentVolume ?? 0);
  const maxVolume = Number(inventory.maxVolume ?? 0);
  const afterVolume = currentVolume + (watchedVolume > 0 ? watchedVolume : 0);

  const handleOpenChange = (next: boolean) => {
    if (!next)
      form.reset({ volumeLiters: 0, deliveryId: undefined, notes: '' });
    onOpenChange(next);
  };

  const onSubmit = async (data: FormValues) => {
    const res = await addFuelStock({
      productId: inventory.productId,
      storeId: inventory.storeId,
      volumeLiters: data.volumeLiters,
      deliveryId: data.deliveryId,
      notes: data.notes || undefined,
    });

    if (res.success) {
      toast.success(`${data.volumeLiters}L 유류 입고 완료`, {
        description: `현재 부피: ${afterVolume.toLocaleString()}L`,
      });
      handleOpenChange(false);
      await fetchInventoryById(inventory.id);
    } else {
      toast.error(res.error?.message ?? '유류 입고 처리에 실패했습니다.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle className="flex items-center gap-2">
            <Fuel className="text-primary h-5 w-5" />
            유류 수동 입고
          </SheetTitle>
          <SheetDescription>
            재고 #{inventory.id} · 매장 #{inventory.storeId} · 상품 #
            {inventory.productId}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="add-fuel-stock-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6"
          >
            {/* 현재 부피 현황 */}
            <div className="bg-muted space-y-2 rounded-lg p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">현재 부피</span>
                <span className="font-semibold">
                  {currentVolume.toLocaleString()}
                  <span className="text-muted-foreground ml-1 text-xs">L</span>
                </span>
              </div>
              {maxVolume > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">최대 용량</span>
                  <span className="font-medium">
                    {maxVolume.toLocaleString()}
                    <span className="text-muted-foreground ml-1 text-xs">
                      L
                    </span>
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">입고 후 예상 부피</span>
                <span
                  className={`font-semibold ${
                    maxVolume > 0 && afterVolume > maxVolume
                      ? 'text-warning'
                      : 'text-success'
                  }`}
                >
                  {afterVolume.toLocaleString()}
                  <span className="text-muted-foreground ml-1 text-xs">L</span>
                  {maxVolume > 0 && afterVolume > maxVolume && (
                    <span className="text-warning ml-1 text-xs">
                      (최대 초과)
                    </span>
                  )}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="volumeLiters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>입고 리터 수 *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0.1}
                      step={0.1}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    단위: 리터 (L)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    배달 ID
                    <span className="text-muted-foreground ml-1 text-xs">
                      (선택)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      placeholder="연결할 배달 ID"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : parseInt(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    난방유 배달과 연결할 경우 입력하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>메모</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="입고 사유, 공급업체 등 (선택)"
                      className="resize-none"
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
            form="add-fuel-stock-form"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <Fuel className="mr-2 h-4 w-4" />
                입고 처리
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
