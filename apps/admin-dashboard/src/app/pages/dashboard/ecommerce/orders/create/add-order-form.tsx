import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Loader2,
  PlusIcon,
  XIcon,
  Search,
  User,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '@starcoex-frontend/orders';
import { useStores } from '@starcoex-frontend/stores';
import { useProducts } from '@starcoex-frontend/products';
import { useAddress } from '@starcoex-frontend/address';
import { useEffect, useMemo, useState } from 'react';
import type { FulfillmentType } from '@starcoex-frontend/orders';
import { AddressSearchInput } from '@/components/address-search';
import type { JusoApiAddress } from '@starcoex-frontend/graphql';
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@/app/pages/dashboard/ecommerce/orders/components/customer-search';

// ─── 처리 방식 옵션 ────────────────────────────────────────────────────────────
const FULFILLMENT_OPTIONS = [
  { value: 'DELIVERY', label: '🚚 배송', description: '주소로 배송' },
  { value: 'PICKUP', label: '🏪 픽업', description: '매장 방문 수령' },
  {
    value: 'ON_SITE',
    label: '⛽ 현장',
    description: '현장 직접 방문 (주유 등)',
  },
] as const;

type UiFulfillmentType = 'DELIVERY' | 'PICKUP' | 'ON_SITE';

// ─── Zod 스키마 ───────────────────────────────────────────────────────────────
const FormSchema = z
  .object({
    storeId: z.number().min(1, { message: '매장을 선택하세요.' }),
    fulfillmentType: z.enum(['DELIVERY', 'PICKUP', 'ON_SITE']),

    // 고객 (CustomerSearch에서 채워짐)
    userId: z.number().min(1, { message: '고객을 선택하세요.' }),
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),
    customerEmail: z.string().email().optional().or(z.literal('')),

    // 배송 주소
    roadAddress: z.string().optional(),
    zipCode: z.string().optional(),
    addressDetail: z.string().optional(),

    deliveryMemo: z.string().optional(),
    pickupTime: z.string().optional(),
    deliveryAmount: z.number().min(0),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType === 'DELIVERY') {
      if (!data.roadAddress || data.roadAddress.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['roadAddress'],
          message: '배송 주소를 검색하여 선택하세요.',
        });
      }
    }
    if (data.fulfillmentType === 'PICKUP' && !data.pickupTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pickupTime'],
        message: '픽업 예정 시간을 입력하세요.',
      });
    }
  });

type FormValues = z.infer<typeof FormSchema>;

interface OrderItemDraft {
  productId: number;
  productName: string;
  productSku?: string; // ✅ code 대신 실제 Product 타입 필드로
  unitPrice: number;
  quantity: number;
}

export default function AddOrderForm() {
  const navigate = useNavigate();
  const { createOrder } = useOrders();
  const { stores, fetchStores } = useStores();
  const { products, fetchProducts } = useProducts();
  const { saveAddress } = useAddress();

  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);
  const [productQuery, setProductQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedQty, setSelectedQty] = useState(1);
  const [items, setItems] = useState<OrderItemDraft[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<JusoApiAddress | null>(
    null
  );

  useEffect(() => {
    fetchStores();
    fetchProducts();
  }, [fetchStores, fetchProducts]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      storeId: 0,
      fulfillmentType: 'DELIVERY',
      userId: 0,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      roadAddress: '',
      zipCode: '',
      addressDetail: '',
      deliveryMemo: '',
      pickupTime: '',
      deliveryAmount: 0,
    },
  });

  const fulfillmentType = form.watch('fulfillmentType') as UiFulfillmentType;

  // ─── 고객 선택/해제 ──────────────────────────────────────────────────────────
  const handleSelectCustomer = (customer: SelectedCustomer) => {
    setSelectedCustomer(customer);
    form.setValue('userId', customer.userId, { shouldValidate: true });
    form.setValue('customerName', customer.name);
    form.setValue('customerPhone', customer.phone);
    form.setValue('customerEmail', customer.email ?? '');
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    form.setValue('userId', 0);
    form.setValue('customerName', '');
    form.setValue('customerPhone', '');
    form.setValue('customerEmail', '');
  };

  // ─── 배송 주소 선택 ──────────────────────────────────────────────────────────
  const handleAddressSelect = (address: JusoApiAddress) => {
    setSelectedAddress(address);
    form.setValue('roadAddress', address.roadAddr, { shouldValidate: true });
    form.setValue('zipCode', address.zipNo);
    toast.success('주소가 선택되었습니다.');
  };

  // ─── 상품 검색 필터 ──────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    return products
      .filter((p) => p.isAvailable)
      .filter((p) => {
        if (!q) return true;
        if (p.name.toLowerCase().includes(q)) return true;

        // category는 Category 객체 또는 배열일 수 있음
        const cat = p.category;
        if (!cat) return false;
        if (Array.isArray(cat)) {
          return cat.some((c) => c.name.toLowerCase().includes(q));
        }
        // 단일 Category 객체
        return (cat as { name: string }).name.toLowerCase().includes(q);
      });
  }, [products, productQuery]);

  // ─── 상품 추가 ───────────────────────────────────────────────────────────────
  const handleAddItem = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    if (items.some((i) => i.productId === product.id)) {
      toast.error('이미 추가된 상품입니다.');
      return;
    }
    setItems((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        // ✅ sku 필드가 있으면 사용, 없으면 생략
        productSku: (product as any).sku ?? undefined,
        unitPrice: product.salePrice ?? product.basePrice,
        quantity: selectedQty,
      },
    ]);
    setSelectedProductId(null);
    setProductQuery('');
    setSelectedQty(1);
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );
  const deliveryAmount = form.watch('deliveryAmount') || 0;

  // ─── 제출 ────────────────────────────────────────────────────────────────────
  async function onSubmit(data: FormValues) {
    if (items.length === 0) {
      toast.error('주문 상품을 1개 이상 추가하세요.');
      return;
    }

    const store = stores.find((s) => s.id === data.storeId);

    try {
      // 배송일 경우 주소 서비스에 저장
      if (data.fulfillmentType === 'DELIVERY' && selectedAddress) {
        const addressRes = await saveAddress({
          roadFullAddr: selectedAddress.roadAddr,
          roadAddrPart1: selectedAddress.roadAddr,
          roadAddrPart2: '',
          jibunAddr: selectedAddress.jibunAddr || '',
          engAddr: selectedAddress.engAddr || '',
          zipNo: selectedAddress.zipNo,
          admCd: selectedAddress.admCd || '',
          siNm: selectedAddress.siNm || '',
          sggNm: selectedAddress.sggNm || '',
          emdNm: selectedAddress.emdNm || '',
          rn: selectedAddress.rn || '',
          rnMgtSn: selectedAddress.rnMgtSn || '',
          bdMgtSn: selectedAddress.bdMgtSn || '',
          bdNm: selectedAddress.bdNm || '',
          buildingType: 'SINGLE_HOUSE',
          buldMnnm: parseInt(selectedAddress.buldMnnm || '0'),
          buldSlno: parseInt(selectedAddress.buldSlno || '0'),
          lnbrMnnm: 0,
          lnbrSlno: 0,
          emdNo: '01',
          addrDetail: data.addressDetail || '',
          status: 'ACTIVE',
          dataSource: 'JUSO_API',
        });
        if (!addressRes.success) {
          toast.error(addressRes.error?.message || '주소 저장에 실패했습니다.');
          return;
        }
      }

      const res = await createOrder({
        storeId: data.storeId,
        storeName: store?.name ?? `매장 #${data.storeId}`,
        fulfillmentType: data.fulfillmentType as FulfillmentType,
        totalAmount,
        deliveryAmount: data.deliveryAmount,
        deliveryMemo: data.deliveryMemo || undefined,
        customerInfo: JSON.stringify({
          userId: data.userId,
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail || undefined,
        }),
        deliveryAddress:
          data.fulfillmentType === 'DELIVERY' && selectedAddress
            ? JSON.stringify({
                address: selectedAddress.roadAddr,
                zipCode: selectedAddress.zipNo,
                detail: data.addressDetail || undefined,
              })
            : undefined,
        pickupTime:
          data.fulfillmentType === 'PICKUP' && data.pickupTime
            ? data.pickupTime
            : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          storeId: data.storeId,
          productSnapshot: JSON.stringify({
            name: item.productName,
            price: item.unitPrice,
          }),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });

      if (res.success) {
        toast.success(res.data?.creationMessage ?? '주문이 등록되었습니다!');
        navigate('/admin/orders');
      } else {
        toast.error(res.error?.message ?? '주문 등록에 실패했습니다.');
      }
    } catch {
      toast.error('주문 등록 중 오류가 발생했습니다.');
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 헤더 */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/orders">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">주문 추가</h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '등록하기'
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* ─── 좌측 ──────────────────────────────────────────────────────── */}
          <div className="space-y-4 lg:col-span-4">
            {/* 고객 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  고객 정보 *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CustomerSearch
                  selected={selectedCustomer}
                  onSelect={handleSelectCustomer}
                  onClear={handleClearCustomer}
                  enableCreate={true}
                />
                {/* userId 검증 에러 표시 */}
                <FormField
                  control={form.control}
                  name="userId"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 배송 정보 */}
            {fulfillmentType === 'DELIVERY' && (
              <Card>
                <CardHeader>
                  <CardTitle>배송 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <FormLabel>주소 검색 *</FormLabel>
                    <AddressSearchInput
                      onSelectAddress={handleAddressSelect}
                      className="mt-2"
                    />
                  </div>
                  {selectedAddress && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
                      <p className="font-medium text-blue-900">
                        {selectedAddress.roadAddr}
                      </p>
                      <p className="text-blue-700 text-xs mt-0.5">
                        우편번호: {selectedAddress.zipNo}
                      </p>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="roadAddress"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상세주소</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="동/호수 등 상세주소"
                            disabled={!selectedAddress}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliveryMemo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>배송 메모</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="문 앞에 놓아주세요"
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* 픽업 정보 */}
            {fulfillmentType === 'PICKUP' && (
              <Card>
                <CardHeader>
                  <CardTitle>픽업 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="pickupTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>픽업 예정 시간 *</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* 현장 정보 */}
            {fulfillmentType === 'ON_SITE' && (
              <Card>
                <CardHeader>
                  <CardTitle>현장 방문 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="deliveryMemo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>현장 메모</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="차량번호, 주유량 등 현장 특이사항"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* 주문 상품 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  주문 상품
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={productQuery}
                      onChange={(e) => {
                        setProductQuery(e.target.value);
                        setSelectedProductId(null);
                      }}
                      placeholder="상품명 또는 카테고리 검색..."
                      className="pl-9"
                    />
                  </div>

                  {productQuery.trim() && (
                    <div className="max-h-52 overflow-y-auto rounded-md border divide-y">
                      {filteredProducts.length === 0 ? (
                        <p className="text-muted-foreground px-3 py-4 text-sm text-center">
                          검색 결과가 없습니다.
                        </p>
                      ) : (
                        filteredProducts.slice(0, 50).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className={`w-full px-3 py-2 text-left transition-colors hover:bg-muted ${
                              selectedProductId === p.id ? 'bg-primary/10' : ''
                            }`}
                            onClick={() => setSelectedProductId(p.id)}
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {p.name}
                              </p>
                              <span className="ml-2 text-sm font-semibold shrink-0">
                                ₩{(p.salePrice ?? p.basePrice).toLocaleString()}
                              </span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={selectedQty}
                      onChange={(e) =>
                        setSelectedQty(parseInt(e.target.value) || 1)
                      }
                      className="w-24"
                      placeholder="수량"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handleAddItem}
                      disabled={!selectedProductId}
                    >
                      <PlusIcon className="mr-1 size-4" />
                      {selectedProductId
                        ? `"${
                            products.find((p) => p.id === selectedProductId)
                              ?.name
                          }" 추가`
                        : '상품을 선택하세요'}
                    </Button>
                  </div>
                </div>

                {items.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4 text-center">
                    위에서 상품을 검색하여 추가하세요.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-medium">
                              {item.productName}
                            </p>
                            {item.productSku && (
                              <Badge
                                variant="secondary"
                                className="text-xs shrink-0"
                              >
                                {item.productSku}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            ₩{item.unitPrice.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                        <div className="ml-2 flex items-center gap-2">
                          <span className="font-medium">
                            ₩{(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            onClick={() =>
                              setItems((prev) =>
                                prev.filter(
                                  (i) => i.productId !== item.productId
                                )
                              )
                            }
                          >
                            <XIcon className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                      <span>상품 합계</span>
                      <span>₩{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ─── 우측 ──────────────────────────────────────────────────────── */}
          <div className="space-y-4 lg:col-span-2">
            {/* 매장 */}
            <Card>
              <CardHeader>
                <CardTitle>매장 *</CardTitle>
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
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="매장 선택" />
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

            {/* 처리 방식 */}
            <Card>
              <CardHeader>
                <CardTitle>처리 방식</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="fulfillmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-2">
                          {FULFILLMENT_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                field.onChange(opt.value);
                                setSelectedAddress(null);
                                form.setValue('roadAddress', '');
                                form.setValue('zipCode', '');
                              }}
                              className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                                field.value === opt.value
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'hover:bg-muted'
                              }`}
                            >
                              <p className="text-sm font-medium">{opt.label}</p>
                              <p className="text-muted-foreground text-xs">
                                {opt.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 금액 */}
            <Card>
              <CardHeader>
                <CardTitle>금액</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fulfillmentType === 'DELIVERY' && (
                  <FormField
                    control={form.control}
                    name="deliveryAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>배송비</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">상품 금액</span>
                    <span>₩{totalAmount.toLocaleString()}</span>
                  </div>
                  {fulfillmentType === 'DELIVERY' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">배송비</span>
                      <span>₩{deliveryAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-1 font-semibold">
                    <span>최종 금액</span>
                    <span>
                      ₩
                      {(
                        totalAmount +
                        (fulfillmentType === 'DELIVERY' ? deliveryAmount : 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
