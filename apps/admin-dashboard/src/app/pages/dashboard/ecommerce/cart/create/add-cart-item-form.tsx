import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Store,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@starcoex-frontend/cart';
import { useProducts } from '@starcoex-frontend/products';
import { useStores } from '@starcoex-frontend/stores';
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
});

type FormValues = z.infer<typeof FormSchema>;

export default function AddCartItemForm() {
  const navigate = useNavigate();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const {
    products,
    fetchProducts,
    isLoading: isProductsLoading,
  } = useProducts();
  const { stores, fetchStores, isLoading: isStoresLoading } = useStores();

  // ─── 고객 선택 상태 ──────────────────────────────────────────────────────────
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

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
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
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

  const onSubmit = async (data: FormValues) => {
    if (!selectedCustomer) {
      toast.error('고객을 먼저 선택하세요.');
      return;
    }

    const res = await addToCart({
      productId: data.productId,
      storeId: data.storeId,
      quantity: data.quantity,
      ...(data.appliedPromotionId
        ? { appliedPromotionId: data.appliedPromotionId }
        : {}),
    });

    if (res.success) {
      toast.success(
        `${selectedCustomer.name}의 장바구니에 "${
          selectedProduct?.name ?? `상품 #${data.productId}`
        }"이(가) 추가되었습니다.`
      );
      navigate('/admin/cart');
    } else {
      toast.error(res.error?.message ?? '장바구니 추가에 실패했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting || isCartLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 헤더 */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/cart">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              장바구니 상품 추가
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedCustomer}
              title={!selectedCustomer ? '고객을 먼저 선택하세요' : undefined}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  장바구니에 추가
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* 좌측: 상품 검색 */}
          <div className="space-y-4 lg:col-span-4">
            {/* 고객 선택 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  고객 선택 *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerSearch
                  selected={selectedCustomer}
                  onSelect={setSelectedCustomer}
                  onClear={() => setSelectedCustomer(null)}
                  enableCreate={true}
                />
                {!selectedCustomer && (
                  <p className="text-muted-foreground text-xs mt-2">
                    장바구니에 상품을 추가할 고객을 먼저 선택하세요.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 상품 선택 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  상품 선택 *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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

                {productQuery.trim() && !selectedProduct && (
                  <div className="max-h-60 overflow-y-auto rounded-md border divide-y">
                    {isProductsLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <p className="text-muted-foreground px-3 py-4 text-sm text-center">
                        검색 결과가 없습니다.
                      </p>
                    ) : (
                      filteredProducts.slice(0, 50).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full px-3 py-2.5 text-left transition-colors hover:bg-muted"
                          onClick={() => handleSelectProduct(p)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {p.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-muted-foreground text-xs font-mono">
                                  {p.sku}
                                </span>
                                {!p.isAvailable && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px] px-1 py-0"
                                  >
                                    품절
                                  </Badge>
                                )}
                              </div>
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

                {selectedProduct && (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold">
                            {selectedProduct.name}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs font-mono"
                          >
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
                            <span className="text-muted-foreground">
                              선택 스토어 재고:{' '}
                            </span>
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
              </CardContent>
            </Card>
          </div>

          {/* 우측: 스토어 선택 + 요약 */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  스토어 선택 *
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="storeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(v) => field.onChange(Number(v))}
                          disabled={isStoresLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                isStoresLoading
                                  ? '불러오는 중...'
                                  : '스토어 선택'
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
              </CardContent>
            </Card>

            {/* 추가 요약 */}
            {(selectedCustomer || selectedProduct || selectedStoreId) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">추가 요약</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {selectedCustomer && (
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">고객</span>
                      <div className="text-right">
                        <p className="font-medium">{selectedCustomer.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedProduct && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">상품</span>
                      <span className="font-medium truncate max-w-[150px] text-right">
                        {selectedProduct.name}
                      </span>
                    </div>
                  )}
                  {selectedStoreId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">스토어</span>
                      <span className="font-medium">
                        {stores.find((s) => s.id === selectedStoreId)?.name ??
                          `#${selectedStoreId}`}
                      </span>
                    </div>
                  )}
                  {selectedProduct && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">수량</span>
                      <span className="font-medium">
                        {form.watch('quantity')}개
                      </span>
                    </div>
                  )}
                  {selectedProduct && (
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>예상 금액</span>
                      <span>
                        ₩
                        {(
                          (selectedProduct.salePrice ??
                            selectedProduct.basePrice) *
                          (form.watch('quantity') || 1)
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
