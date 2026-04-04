import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, PackagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { useInventory } from '@starcoex-frontend/inventory';
import type { InventoryRow } from './inventory-columns';

const AddStockSchema = z.object({
  quantity: z.number().int().min(1, { message: '1 이상의 수량을 입력하세요.' }),
  reason: z.string().optional(),
});

type AddStockForm = z.infer<typeof AddStockSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: InventoryRow;
}

export function InventoryAddStockDrawer({
  open,
  onOpenChange,
  inventory,
}: Props) {
  const { addStock } = useInventory();

  const form = useForm<AddStockForm>({
    resolver: zodResolver(AddStockSchema),
    defaultValues: { quantity: 1, reason: '' },
  });

  const onSubmit = async (data: AddStockForm) => {
    const res = await addStock({
      productId: inventory.productId, // inventoryId → productId + storeId
      storeId: inventory.storeId,
      quantity: data.quantity,
      notes: data.reason, // reason → notes
    });
    if (res.success) {
      toast.success(`${data.quantity}개 입고 처리되었습니다.`);
      form.reset();
      onOpenChange(false);
    } else {
      toast.error(res.error?.message ?? '입고 처리에 실패했습니다.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="flex items-center gap-2">
            <PackagePlus className="size-5" />
            입고 처리
          </SheetTitle>
          <SheetDescription>
            입고 수량만큼 현재 재고에 더해집니다.
          </SheetDescription>
        </SheetHeader>

        {/* 현재 재고 현황 */}
        <div className="mx-6 mt-4 rounded-lg border bg-muted px-4 py-3 space-y-1">
          <p className="text-xs text-muted-foreground">현재 재고 현황</p>
          <p className="font-semibold">
            {inventory.product?.name ?? `제품 #${inventory.productId}`}
          </p>
          <p className="text-xs text-muted-foreground">
            매장 #{inventory.storeId}
          </p>
          <div className="flex gap-4 mt-1 text-sm">
            <span>
              현재: <strong>{inventory.currentStock}개</strong>
            </span>
            <span>
              예약:{' '}
              <strong className="text-orange-500">
                {inventory.reservedStock}개
              </strong>
            </span>
            <span>
              가용:{' '}
              <strong className="text-green-600">
                {inventory.availableStock}개
              </strong>
            </span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4 px-6 pb-6"
          >
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>입고 수량 *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    입고 후 재고: {inventory.currentStock} +{' '}
                    {form.watch('quantity') || 0} ={' '}
                    <strong>
                      {inventory.currentStock + (form.watch('quantity') || 0)}개
                    </strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사유 (선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="예: 정기 발주 입고, 반품 재입고..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                입고 처리
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
