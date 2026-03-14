import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useProducts } from '@starcoex-frontend/products';
import { useStores } from '@starcoex-frontend/stores';
import type { InventoryRow } from './inventory-columns';

const InventorySchema = z.object({
  productId: z.number().min(1),
  storeId: z.number().min(1, { message: '매장을 선택하세요.' }),
  stock: z.number().int().min(0, { message: '재고는 0 이상이어야 합니다.' }),
  minStock: z.number().int().min(0),
  maxStock: z.number().int().min(0),
  storePrice: z.number().min(0).optional(),
  isAvailable: z.boolean(),
});

type InventoryFormValues = z.infer<typeof InventorySchema>;

interface InventoryMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory?: InventoryRow;
  productId?: number;
}

export function InventoryMutateDrawer({
  open,
  onOpenChange,
  inventory,
  productId,
}: InventoryMutateDrawerProps) {
  const { createInventory, updateInventory } = useProducts();
  const { stores, fetchStores } = useStores();
  const isEdit = !!inventory;

  // 매장 목록 로드
  useEffect(() => {
    if (open && stores.length === 0) {
      fetchStores();
    }
  }, [open, stores.length, fetchStores]);

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      productId: inventory?.productId ?? productId ?? 0,
      storeId: inventory?.storeId ?? 0,
      stock: inventory?.stock ?? 0,
      minStock: inventory?.minStock ?? 0,
      maxStock: inventory?.maxStock ?? 1000,
      storePrice: inventory?.storePrice ?? undefined,
      isAvailable: inventory?.isAvailable ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        productId: inventory?.productId ?? productId ?? 0,
        storeId: inventory?.storeId ?? 0,
        stock: inventory?.stock ?? 0,
        minStock: inventory?.minStock ?? 0,
        maxStock: inventory?.maxStock ?? 1000,
        storePrice: inventory?.storePrice ?? undefined,
        isAvailable: inventory?.isAvailable ?? true,
      });
    }
  }, [open, inventory, productId, form]);

  async function onSubmit(data: InventoryFormValues) {
    if (isEdit && inventory) {
      const res = await updateInventory({
        id: inventory.id,
        stock: data.stock,
        minStock: data.minStock,
        maxStock: data.maxStock,
        storePrice: data.storePrice,
        isAvailable: data.isAvailable,
      });
      if (res.success) {
        toast.success('재고가 수정되었습니다.');
        onOpenChange(false);
      } else {
        toast.error(res.error?.message ?? '재고 수정에 실패했습니다.');
      }
    } else {
      const res = await createInventory({
        productId: data.productId,
        storeId: data.storeId,
        stock: data.stock,
        minStock: data.minStock,
        maxStock: data.maxStock,
        storePrice: data.storePrice,
        isAvailable: data.isAvailable,
      });
      if (res.success) {
        toast.success('재고가 등록되었습니다.');
        onOpenChange(false);
      } else {
        toast.error(res.error?.message ?? '재고 등록에 실패했습니다.');
      }
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? '재고 수정' : '재고 등록'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? `${
                  stores.find((s) => s.id === inventory?.storeId)?.name ??
                  `매장 #${inventory?.storeId}`
                } 재고를 수정합니다.`
              : '새 매장 재고를 등록합니다.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4 px-1"
          >
            {/* 매장 선택 (등록 시에만) */}
            {!isEdit && (
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
                          <SelectValue placeholder="매장을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {stores.map((store) => (
                            <SelectItem key={store.id} value={String(store.id)}>
                              {store.name}
                              {store.location && (
                                <span className="text-muted-foreground ml-1 text-xs">
                                  ({store.location})
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>현재 재고 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="storePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>매장 가격</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="기본 가격 적용"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : e.target.valueAsNumber
                          )
                        }
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
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소 재고</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대 재고</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="isAvailable" className="cursor-pointer">
                    판매 가능
                  </Label>
                  <FormControl>
                    <Switch
                      id="isAvailable"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEdit ? '저장하기' : '등록하기'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
