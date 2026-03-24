import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, PackagePlus } from 'lucide-react';
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
  quantity: z
    .number({ error: '수량을 입력하세요.' })
    .int('정수로 입력하세요.')
    .min(1, '1 이상이어야 합니다.'),
  notes: z.string().max(200, '200자 이내로 입력하세요.').optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface InventoryAddStockDrawerProps {
  inventory: StoreInventory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryAddStockDrawer({
  inventory,
  open,
  onOpenChange,
}: InventoryAddStockDrawerProps) {
  const { addStock, fetchInventoryById, fetchLowStockInventories } =
    useInventory();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { quantity: 1, notes: '' },
  });

  const isSubmitting = form.formState.isSubmitting;
  const watchedQty = form.watch('quantity') || 0;
  const afterStock = inventory.currentStock + (watchedQty > 0 ? watchedQty : 0);

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset({ quantity: 1, notes: '' });
    onOpenChange(next);
  };

  const onSubmit = async (data: FormValues) => {
    const res = await addStock({
      productId: inventory.productId,
      storeId: inventory.storeId,
      quantity: data.quantity,
      notes: data.notes || undefined,
    });

    if (res.success) {
      toast.success(`${data.quantity}${inventory.unit} 입고 완료`, {
        description: `현재 재고: ${afterStock.toLocaleString()}${
          inventory.unit
        }`,
      });
      handleOpenChange(false);
      await fetchInventoryById(inventory.id);
      await fetchLowStockInventories();
    } else {
      toast.error(res.error?.message ?? '입고 처리에 실패했습니다.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle className="flex items-center gap-2">
            <PackagePlus className="text-primary h-5 w-5" />
            수동 입고
          </SheetTitle>
          <SheetDescription>
            재고 #{inventory.id} · 매장 #{inventory.storeId} · 상품 #
            {inventory.productId}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="add-stock-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6"
          >
            {/* 현재 재고 현황 */}
            <div className="bg-muted space-y-2 rounded-lg p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">현재 재고</span>
                <span className="font-semibold">
                  {inventory.currentStock.toLocaleString()}
                  <span className="text-muted-foreground ml-1 text-xs">
                    {inventory.unit}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">최대 재고</span>
                <span className="font-medium">
                  {inventory.maxStock.toLocaleString()}
                  <span className="text-muted-foreground ml-1 text-xs">
                    {inventory.unit}
                  </span>
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">입고 후 예상 재고</span>
                <span
                  className={`font-semibold ${
                    afterStock > inventory.maxStock
                      ? 'text-warning'
                      : 'text-success'
                  }`}
                >
                  {afterStock.toLocaleString()}
                  <span className="text-muted-foreground ml-1 text-xs">
                    {inventory.unit}
                  </span>
                  {afterStock > inventory.maxStock && (
                    <span className="text-warning ml-1 text-xs">
                      (최대 초과)
                    </span>
                  )}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>입고 수량 *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    단위: {inventory.unit}
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
          <Button form="add-stock-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <PackagePlus className="mr-2 h-4 w-4" />
                입고 처리
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
