import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Package, Search, Store, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@starcoex-frontend/cart';
import { useProducts } from '@starcoex-frontend/products';
import { useStores } from '@starcoex-frontend/stores';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const FormSchema = z.object({
  productId: z
    .number({ message: '상품을 선택하세요.' })
    .min(1, '상품을 선택하세요.'),
  storeId: z
    .number({ message: '스토어를 선택하세요.' })
    .min(1, '스토어를 선택하세요.'),
  quantity: z
    .number({ message: '수량은 숫자여야 합니다.' })
    .min(1, '수량은 1 이상이어야 합니다.')
    .max(999, '수량은 999 이하여야 합니다.'),
  appliedPromotionId: z.number().optional(),
  isDirectCheckout: z.boolean(),
});

type FormValues = z.infer<typeof FormSchema>;

interface AddCartItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCartItemDialog = ({
  open,
  onOpenChange,
}: AddCartItemDialogProps) => {
  const { addToCart, isLoading: isCartLoading } = useCart();
  const {
    products,
    fetchProducts,
    isLoading: isProductsLoading,
  } = useProducts();
  const { stores, fetchStores, isLoading: isStoresLoading } = useStores();

  const [productQuery, setProductQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[number] | null
  >(null);

  useEffect(() => {
    fetchProducts();
    fetchStores();
  }, [fetchProducts, fetchStores]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productId: undefined,
      storeId: undefined,
      quantity: 1,
      appliedPromotionId: undefined,
      isDirectCheckout: false,
    },
  });

  const selectedStoreId = form.watch('storeId');

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    return products
      .filter((p) => p.isAvailable)
      .filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        );
      });
  }, [products, productQuery]);

  const selectedProductInventory = useMemo(() => {
    if (!selectedProduct || !selectedStoreId) return null;
    return (
      selectedProduct.inventories?.find(
        (inv) => inv.storeId === selectedStoreId
      ) ?? null
    );
  }, [selectedProduct, selectedStoreId]);

  const handleSelectProduct = (product: (typeof products)[number]) => {
    setSelectedProduct(product);
    form.setValue('productId', product.id, { shouldValidate: true });
    setProductQuery(product.name);
  };

  const handleClearProduct = () => {
    setSelectedProduct(null);
    form.setValue('productId', undefined as never);
    setProductQuery('');
  };

  const handleClose = () => {
    form.reset();
    setSelectedProduct(null);
    setProductQuery('');
    onOpenChange(false);
  };

  const onSubmit = async (data: FormValues) => {
    const res = await addToCart({
      productId: data.productId,
      storeId: data.storeId,
      quantity: data.quantity,
      ...(data.appliedPromotionId
        ? { appliedPromotionId: data.appliedPromotionId }
        : {}),
      isDirectCheckout: data.isDirectCheckout,
    });

    if (res.success) {
      toast.success(
        `"${
          selectedProduct?.name ?? `상품 #${data.productId}`
        }"이(가) 장바구니에 추가되었습니다.`
      );
      handleClose();
    } else {
      toast.error(res.error?.message ?? '상품 추가에 실패했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting || isCartLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => !isSubmitting && !o && handleClose()}
    >
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            장바구니 상품 추가
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ─── 상품 검색 ────────────────────────────────────────────────── */}
            <div className="space-y-2">
              <FormLabel>상품 선택 *</FormLabel>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={productQuery}
                  onChange={(e) => {
                    setProductQuery(e.target.value);
                    if (
                      selectedProduct &&
                      e.target.value !== selectedProduct.name
                    ) {
                      handleClearProduct();
                    }
                  }}
                  placeholder="상품명 또는 SKU 검색..."
                  className="pl-9"
                  disabled={isProductsLoading}
                />
              </div>

              {/* 검색 결과 드롭다운 */}
              {productQuery.trim() && !selectedProduct && (
                <div className="max-h-48 overflow-y-auto rounded-md border divide-y">
                  {isProductsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-muted-foreground px-3 py-3 text-sm text-center">
                      검색 결과가 없습니다.
                    </p>
                  ) : (
                    filteredProducts.slice(0, 30).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="w-full px-3 py-2 text-left transition-colors hover:bg-muted"
                        onClick={() => handleSelectProduct(p)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {p.name}
                            </p>
                            <span className="text-muted-foreground text-xs font-mono">
                              {p.sku}
                            </span>
                          </div>
                          <span className="text-sm font-semibold shrink-0">
                            ₩{(p.salePrice ?? p.basePrice).toLocaleString()}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* 선택된 상품 */}
              {selectedProduct && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">
                          {selectedProduct.name}
                        </p>
                        <Badge variant="outline" className="text-xs font-mono">
                          {selectedProduct.sku}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        기본가: ₩{selectedProduct.basePrice.toLocaleString()}
                        {selectedProduct.salePrice != null && (
                          <span className="text-primary ml-2 font-medium">
                            할인가: ₩
                            {selectedProduct.salePrice.toLocaleString()}
                          </span>
                        )}
                      </p>
                      {selectedProductInventory && (
                        <p className="text-xs mt-1">
                          <span className="text-muted-foreground">재고: </span>
                          <span
                            className={
                              selectedProductInventory.stock <=
                              selectedProductInventory.minStock
                                ? 'text-destructive font-medium'
                                : 'text-green-600 font-medium'
                            }
                          >
                            {selectedProductInventory.stock}개
                          </span>
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 shrink-0 text-muted-foreground"
                      onClick={handleClearProduct}
                    >
                      변경
                    </Button>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="productId"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ─── 스토어 선택 ──────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="storeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5" />
                    스토어 선택 *
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                      disabled={isStoresLoading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isStoresLoading ? '불러오는 중...' : '스토어 선택'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((s) => (
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

            {/* ─── 수량 ─────────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>수량 *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={selectedProductInventory?.stock ?? 999}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  {selectedProductInventory && (
                    <FormDescription>
                      최대 주문 가능: {selectedProductInventory.stock}개
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ─── 직접 결제 ────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="isDirectCheckout"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-1.5 text-sm">
                      <Zap className="h-3.5 w-3.5" />
                      즉시 결제
                    </FormLabel>
                    <p className="text-muted-foreground text-xs">
                      장바구니를 거치지 않고 바로 결제 처리합니다.
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

            {/* ─── 프로모션 ID ──────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="appliedPromotionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>프로모션 ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="선택사항"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? undefined
                            : parseInt(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    프로모션 적용 시 ID를 입력하세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    추가 중...
                  </>
                ) : (
                  '추가하기'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
