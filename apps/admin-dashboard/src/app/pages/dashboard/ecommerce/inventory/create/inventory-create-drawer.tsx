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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInventory } from '@starcoex-frontend/inventory';
import { useStores } from '@starcoex-frontend/stores';
import {
  INVENTORY_MAX_STOCK_DEFAULT,
  INVENTORY_REORDER_DEFAULT,
  INVENTORY_ZONE_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/inventory/data/inventory-data';

const FormSchema = z.object({
  storeId: z.number().min(1, { message: '매장을 선택하세요.' }),
  productId: z.number().min(1, { message: '상품 ID를 입력하세요.' }),
  currentStock: z.number().min(0, { message: '재고는 0 이상이어야 합니다.' }),
  minStock: z.number().min(0),
  maxStock: z.number().min(1),
  reorderPoint: z.number().min(0),
  reorderQuantity: z.number().min(1),
  costPrice: z.number().min(0).optional(),
  storePrice: z.number().min(0).optional(),
  location: z.string().optional(),
  zone: z.string().optional(),
  isActive: z.boolean(),
  isAvailable: z.boolean(),
  isSellable: z.boolean(),
});

type FormValues = z.infer<typeof FormSchema>;

interface InventoryCreateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProductId?: number;
}

export function InventoryCreateDrawer({
  open,
  onOpenChange,
  defaultProductId,
}: InventoryCreateDrawerProps) {
  const { createInventory } = useInventory();
  const { stores, fetchStores } = useStores();

  useEffect(() => {
    if (open && stores.length === 0) {
      fetchStores();
    }
  }, [open, stores.length, fetchStores]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      storeId: 0,
      productId: defaultProductId ?? 0,
      currentStock: 0,
      minStock: 0,
      maxStock: INVENTORY_MAX_STOCK_DEFAULT,
      reorderPoint: 10,
      reorderQuantity: INVENTORY_REORDER_DEFAULT,
      costPrice: undefined,
      storePrice: undefined,
      location: '',
      zone: '',
      isActive: true,
      isAvailable: true,
      isSellable: true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        storeId: 0,
        productId: defaultProductId ?? 0,
        currentStock: 0,
        minStock: 0,
        maxStock: INVENTORY_MAX_STOCK_DEFAULT,
        reorderPoint: 10,
        reorderQuantity: INVENTORY_REORDER_DEFAULT,
        costPrice: undefined,
        storePrice: undefined,
        location: '',
        zone: '',
        isActive: true,
        isAvailable: true,
        isSellable: true,
      });
    }
  }, [open, defaultProductId, form]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormValues) => {
    const res = await createInventory({
      storeId: data.storeId,
      productId: data.productId,
      currentStock: data.currentStock,
      minStock: data.minStock,
      maxStock: data.maxStock,
      reorderPoint: data.reorderPoint,
      reorderQuantity: data.reorderQuantity,
      costPrice: data.costPrice,
      storePrice: data.storePrice,
      location: data.location || undefined,
      zone: data.zone || undefined,
      isActive: data.isActive,
      isAvailable: data.isAvailable,
      isSellable: data.isSellable,
    });

    if (res.success) {
      toast.success('재고가 성공적으로 생성되었습니다.');
      onOpenChange(false);
    } else {
      toast.error(res.error?.message ?? '재고 생성에 실패했습니다.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>재고 추가</SheetTitle>
          <SheetDescription>
            매장별 상품 재고를 새로 등록합니다.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4 px-1"
          >
            {/* 매장 선택 */}
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
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 상품 ID */}
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품 ID *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      disabled={!!defaultProductId}
                      className={defaultProductId ? 'bg-muted' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 재고 수량 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>초기 재고 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최소 재고</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
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
                name="maxStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>최대 재고</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reorderPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>재주문 시점</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      이 수량 이하면 재주문 알림
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 가격 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>원가</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : parseFloat(e.target.value)
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
                name="storePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>매장 판매가</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ''
                              ? undefined
                              : parseFloat(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 위치 / 구역 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>위치</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="A동-1층-3번" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>구역</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ''}
                        onValueChange={(v) =>
                          field.onChange(v === '__none__' ? '' : v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="구역 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">선택 안 함</SelectItem>
                          {INVENTORY_ZONE_OPTIONS.map((zone) => (
                            <SelectItem key={zone.value} value={zone.value}>
                              {zone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 상태 토글 */}
            <div className="space-y-3 rounded-lg border p-4">
              {(
                [
                  { name: 'isActive', label: '활성화' },
                  { name: 'isAvailable', label: '판매 가능' },
                  { name: 'isSellable', label: '온라인 판매' },
                ] as const
              ).map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <Label>{label}</Label>
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

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  '재고 추가'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
