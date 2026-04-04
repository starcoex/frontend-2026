import { useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@starcoex-frontend/products';
import { useStores } from '@starcoex-frontend/stores';
import type { InventoryRow } from './inventory-columns';

const InventorySchema = z.object({
  productId: z.number().min(1),
  storeId: z.number().min(1, { message: '매장을 선택하세요.' }),
  stock: z.number().int().min(0, { message: '재고는 0 이상이어야 합니다.' }),
  minStock: z.number().int().min(0),
  maxStock: z.number().int().min(0),
  reorderPoint: z.number().int().min(0),
  reorderQuantity: z.number().int().min(0),
  storePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  isAvailable: z.boolean(),
});

type InventoryFormValues = z.infer<typeof InventorySchema>;

interface InventoryMutateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: number;
  productName?: string;
  basePrice?: number;
  existingInventories?: InventoryRow[];
}

export function InventoryMutateDrawer({
  open,
  onOpenChange,
  productId,
  productName,
  basePrice,
  existingInventories = [],
}: InventoryMutateDrawerProps) {
  const { createInventory, products, fetchProducts } = useProducts();
  const { stores, fetchStores } = useStores();

  useEffect(() => {
    if (open && stores.length === 0) fetchStores();
  }, [open, stores.length, fetchStores]);

  useEffect(() => {
    if (open && !productId && products.length === 0) fetchProducts();
  }, [open, productId, products.length, fetchProducts]);

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(InventorySchema),
    defaultValues: {
      productId: productId ?? 0,
      storeId: 0,
      stock: 0,
      minStock: 0,
      maxStock: 1000,
      reorderPoint: 10,
      reorderQuantity: 50,
      storePrice: undefined,
      costPrice: undefined,
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        productId: productId ?? 0,
        storeId: 0,
        stock: 0,
        minStock: 0,
        maxStock: 1000,
        reorderPoint: 10,
        reorderQuantity: 50,
        storePrice: undefined,
        costPrice: undefined,
        isAvailable: true,
      });
    }
  }, [open, productId, form]);

  const selectedStoreId = form.watch('storeId');
  const registeredStoreIds = new Set(existingInventories.map((i) => i.storeId));

  const resolvedProductName =
    productName ??
    products.find((p) => p.id === form.watch('productId'))?.name ??
    null;

  const resolvedBasePrice =
    basePrice ??
    products.find((p) => p.id === (productId ?? form.watch('productId')))
      ?.basePrice;

  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  async function onSubmit(data: InventoryFormValues) {
    const res = await createInventory({
      productId: data.productId,
      storeId: data.storeId,
      stock: data.stock,
      minStock: data.minStock,
      maxStock: data.maxStock,
      reorderPoint: data.reorderPoint,
      reorderQuantity: data.reorderQuantity,
      storePrice: data.storePrice,
      costPrice: data.costPrice,
      isAvailable: data.isAvailable,
    });
    if (res.success) {
      toast.success(
        '새 매장에 재고가 등록되었습니다. 잠시 후 재고 관리에 반영됩니다.'
      );
      onOpenChange(false);
    } else {
      toast.error(res.error?.message ?? '재고 등록에 실패했습니다.');
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="flex items-center gap-2">
            <PackagePlus className="size-5" />
            신규 재고 등록
          </SheetTitle>
          <SheetDescription>
            선택한 매장에 이 제품의 재고를 처음으로 등록합니다.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-5 px-6 pb-6"
          >
            {/* ── 등록 대상 요약 박스 ── */}
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 px-4 py-3 space-y-1">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                등록 대상
              </p>
              <p className="font-semibold">
                {resolvedProductName ?? '제품 선택 필요'}
              </p>
              {resolvedBasePrice != null && (
                <p className="text-xs text-muted-foreground">
                  기본 판매가 ₩{resolvedBasePrice.toLocaleString()}
                </p>
              )}
            </div>

            {/* ── 제품 선택 (재고 관리 직접 진입 시) ── */}
            {!resolvedProductName && (
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제품 *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="재고를 등록할 제품 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name}
                              <span className="text-muted-foreground ml-1 text-xs">
                                ({p.sku})
                              </span>
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

            <Separator />

            {/* ── 매장 선택 ── */}
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
                        <SelectValue placeholder="재고를 등록할 매장 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => {
                          const alreadyRegistered = registeredStoreIds.has(
                            store.id
                          );
                          return (
                            <SelectItem
                              key={store.id}
                              value={String(store.id)}
                              disabled={alreadyRegistered}
                            >
                              <div className="flex items-center gap-2">
                                <span>{store.name}</span>
                                {store.location && (
                                  <span className="text-muted-foreground text-xs">
                                    ({store.location})
                                  </span>
                                )}
                                {alreadyRegistered && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    이미 등록됨
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {selectedStore && (
                    <div className="mt-1.5 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                      ✓{' '}
                      <strong className="text-foreground">
                        {selectedStore.name}
                      </strong>
                      {selectedStore.location && ` · ${selectedStore.location}`}
                      에{' '}
                      <strong className="text-foreground">
                        {resolvedProductName}
                      </strong>{' '}
                      재고를 등록합니다.
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* ── 초기 입고 수량 ── */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>초기 입고 수량 *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    이 매장에 처음 입고되는 수량입니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── 재고 임계값 ── */}
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
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── 가격 설정 ── */}
            <Separator />
            <p className="text-sm font-medium text-muted-foreground">
              가격 설정 (선택)
            </p>

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
                    <FormDescription className="text-xs">
                      {resolvedBasePrice != null
                        ? `기본가 ₩${resolvedBasePrice.toLocaleString()}`
                        : '비우면 기본 판매가 적용'}
                    </FormDescription>
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

            {/* ── 판매 가능 ── */}
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
                      비활성 시 이 매장에서 해당 제품 판매 중단
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                재고 등록
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
