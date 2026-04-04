import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Settings2 } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInventory } from '@starcoex-frontend/inventory';
import type { InventoryRow } from './inventory-columns';

const SettingsSchema = z.object({
  minStock: z.number().int().min(0),
  maxStock: z.number().int().min(0),
  reorderPoint: z.number().int().min(0),
  reorderQuantity: z.number().int().min(0),
  storePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  isAvailable: z.boolean(),
});

type SettingsForm = z.infer<typeof SettingsSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: InventoryRow;
}

export function InventorySettingsDrawer({
  open,
  onOpenChange,
  inventory,
}: Props) {
  const { updateStoreInventory } = useInventory();

  const form = useForm<SettingsForm>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      minStock: inventory.minStock,
      maxStock: inventory.maxStock,
      reorderPoint: inventory.reorderPoint,
      reorderQuantity: inventory.reorderQuantity,
      storePrice: inventory.storePrice ?? undefined,
      costPrice: inventory.costPrice ?? undefined,
      isAvailable: inventory.isAvailable,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        minStock: inventory.minStock,
        maxStock: inventory.maxStock,
        reorderPoint: inventory.reorderPoint,
        reorderQuantity: inventory.reorderQuantity,
        storePrice: inventory.storePrice ?? undefined,
        costPrice: inventory.costPrice ?? undefined,
        isAvailable: inventory.isAvailable,
      });
    }
  }, [open, inventory, form]);

  const onSubmit = async (data: SettingsForm) => {
    const res = await updateStoreInventory({
      id: inventory.id,
      minStock: data.minStock,
      maxStock: data.maxStock,
      reorderPoint: data.reorderPoint,
      reorderQuantity: data.reorderQuantity,
      storePrice: data.storePrice,
      costPrice: data.costPrice,
      isAvailable: data.isAvailable,
    });
    if (res.success) {
      toast.success('재고 설정이 수정되었습니다.');
      onOpenChange(false);
    } else {
      toast.error(res.error?.message ?? '설정 수정에 실패했습니다.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="size-5" />
            재고 설정 수정
          </SheetTitle>
          <SheetDescription>
            재고 임계값과 가격을 수정합니다. 실제 재고 수량은 입고 처리로
            변경하세요.
          </SheetDescription>
        </SheetHeader>

        {/* 대상 정보 */}
        <div className="mx-6 mt-4 rounded-lg border bg-muted px-4 py-3">
          <p className="font-semibold text-sm">
            {inventory.product?.name ?? `제품 #${inventory.productId}`}
          </p>
          <p className="text-xs text-muted-foreground">
            매장 #{inventory.storeId} · 현재 재고 {inventory.currentStock}개
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4 px-6 pb-6"
          >
            <Separator />
            <p className="text-sm font-medium">재고 임계값</p>

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
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      이하 시 부족 경고
                    </FormDescription>
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
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                name="reorderPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>재주문 기준점</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      이하 시 재주문
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reorderQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>재주문 수량</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <p className="text-sm font-medium">가격 설정</p>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>매장 전용가</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="기본가 적용"
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
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>원가</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="원가 입력"
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

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label className="cursor-pointer font-medium">
                      판매 가능
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      비활성 시 이 매장에서 판매 중단
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                설정 저장
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
