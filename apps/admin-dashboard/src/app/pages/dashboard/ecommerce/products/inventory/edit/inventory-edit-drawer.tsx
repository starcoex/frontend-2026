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
import { useProducts } from '@starcoex-frontend/products';

// ProductInventory 타입 (edit-product-form에서 사용하는 재고)
interface ProductInventoryItem {
  id: number;
  productId: number;
  storeId: number;
  stock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  storePrice?: number | null;
  costPrice?: number | null;
  isAvailable: boolean;
}

const EditSchema = z.object({
  minStock: z.number().int().min(0),
  maxStock: z.number().int().min(0),
  reorderPoint: z.number().int().min(0),
  reorderQuantity: z.number().int().min(0),
  storePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  isAvailable: z.boolean(),
});

type EditForm = z.infer<typeof EditSchema>;

interface InventoryEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: ProductInventoryItem | null;
  storeName?: string;
  productName?: string;
}

export function InventoryEditDrawer({
  open,
  onOpenChange,
  inventory,
  storeName,
  productName,
}: InventoryEditDrawerProps) {
  const { updateInventory } = useProducts();

  const form = useForm<EditForm>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      minStock: 0,
      maxStock: 1000,
      reorderPoint: 10,
      reorderQuantity: 50,
      storePrice: undefined,
      costPrice: undefined,
      isAvailable: true,
    },
  });

  // inventory 변경 시 폼 초기화
  useEffect(() => {
    if (open && inventory) {
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

  const onSubmit = async (data: EditForm) => {
    if (!inventory) return;

    const res = await updateInventory({
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

  if (!inventory) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="size-5" />
            재고 설정 수정
          </SheetTitle>
          <SheetDescription>
            재고 임계값과 가격을 수정합니다.
            <br />
            실제 재고 수량 변경은 재고 관리 페이지에서 하세요.
          </SheetDescription>
        </SheetHeader>

        {/* 대상 정보 */}
        <div className="mx-6 mt-4 rounded-lg border bg-muted px-4 py-3 space-y-1">
          <p className="font-semibold text-sm">
            {productName ?? `제품 #${inventory.productId}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {storeName ?? `매장 #${inventory.storeId}`} · 현재 재고{' '}
            <strong>{inventory.stock}개</strong>
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
