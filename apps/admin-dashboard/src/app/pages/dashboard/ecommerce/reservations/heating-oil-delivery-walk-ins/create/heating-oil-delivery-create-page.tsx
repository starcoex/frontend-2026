import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Loader2,
  User,
  Package,
  Search,
  PlusIcon,
  XIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useHeatingOilDeliveries } from '@starcoex-frontend/reservations';
import { useStores } from '@starcoex-frontend/stores';
import { useProducts } from '@starcoex-frontend/products';
import { useAddress } from '@starcoex-frontend/address';
import { useEffect, useMemo, useState } from 'react';
import {
  HeatingOilDeliveryCreateSchema,
  type HeatingOilDeliveryCreateFormValues,
} from './heating-oil-delivery-create-schema';
import { HEATING_OIL_FUEL_TYPE_LABELS } from '@/app/pages/dashboard/ecommerce/reservations/data/heating-oil-delivery-walk-in-data';
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@/app/pages/dashboard/ecommerce/orders/components/customer-search';
import { AddressSearchInput } from '@/components/address-search';
import type { JusoApiAddress } from '@starcoex-frontend/graphql';

const TIME_SLOT_OPTIONS = [
  { value: '09:00-12:00', label: '오전 (09:00 ~ 12:00)' },
  { value: '12:00-15:00', label: '오후 1 (12:00 ~ 15:00)' },
  { value: '15:00-18:00', label: '오후 2 (15:00 ~ 18:00)' },
  { value: '18:00-21:00', label: '저녁 (18:00 ~ 21:00)' },
];

const PAYMENT_TYPE_OPTIONS = [
  { value: 'PREPAID', label: '선불' },
  { value: 'DEPOSIT', label: '보증금' },
  { value: 'POSTPAID', label: '후불' },
  { value: 'FREE', label: '무료' },
];

export default function HeatingOilDeliveryCreatePage() {
  const navigate = useNavigate();
  const { createDelivery } = useHeatingOilDeliveries();
  const { stores, fetchStores } = useStores();
  const { products, fetchProducts } = useProducts();
  const { saveAddress } = useAddress();

  // 고객 검색
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

  // 주소
  const [selectedAddress, setSelectedAddress] = useState<JusoApiAddress | null>(
    null
  );

  // 상품 검색 (유종별 상품)
  const [productQuery, setProductQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedQty, setSelectedQty] = useState(1);

  interface DeliveryItemDraft {
    productId: number;
    productName: string;
    productSku?: string;
    unitPrice: number;
    quantity: number;
  }
  const [items, setItems] = useState<DeliveryItemDraft[]>([]);

  useEffect(() => {
    fetchStores();
    fetchProducts();
  }, [fetchStores, fetchProducts]);

  const form = useForm<HeatingOilDeliveryCreateFormValues>({
    resolver: zodResolver(HeatingOilDeliveryCreateSchema),
    defaultValues: {
      storeId: 0,
      userId: 0,
      customerName: '',
      customerPhone: '',
      guestEmail: '',
      deliveryAddress: '',
      deliveryAddressDetail: '',
      fuelType: 'KEROSENE',
      orderType: 'STANDARD',
      requestedLiters: 0,
      serviceAmount: 0,
      deliveryFee: 0,
      urgentFee: 0,
      totalAmount: 0,
      paymentType: 'POSTPAID',
      scheduledDate: '',
      scheduledTimeSlot: '',
      isUrgent: false,
      urgentReason: '',
      notes: '',
    },
  });

  const recalcTotal = () => {
    const service = form.getValues('serviceAmount') ?? 0;
    const delivery = form.getValues('deliveryFee') ?? 0;
    const urgent = form.getValues('urgentFee') ?? 0;
    form.setValue('totalAmount', service + delivery + urgent);
  };

  const isUrgent = form.watch('isUrgent');

  // 고객 선택
  const handleSelectCustomer = (customer: SelectedCustomer) => {
    setSelectedCustomer(customer);
    form.setValue('userId', customer.userId, { shouldValidate: true });
    form.setValue('customerName', customer.name, { shouldValidate: true });
    form.setValue('customerPhone', customer.phone, { shouldValidate: true });
    form.setValue('guestEmail', customer.email ?? '');
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    form.setValue('userId', 0);
    form.setValue('customerName', '');
    form.setValue('customerPhone', '');
    form.setValue('guestEmail', '');
  };

  // 주소 선택
  const handleAddressSelect = (address: JusoApiAddress) => {
    setSelectedAddress(address);
    form.setValue('deliveryAddress', address.roadAddr, {
      shouldValidate: true,
    });
    form.setValue('deliveryAddressDetail', '');
    toast.success('주소가 선택되었습니다.');
  };

  // 상품 필터
  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    return products
      .filter((p) => p.isAvailable)
      .filter((p) => {
        if (!q) return true;
        if (p.name.toLowerCase().includes(q)) return true;
        const cat = p.category;
        if (!cat) return false;
        if (Array.isArray(cat))
          return cat.some((c) => c.name.toLowerCase().includes(q));
        return (cat as { name: string }).name.toLowerCase().includes(q);
      });
  }, [products, productQuery]);

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
        productSku: (product as any).sku ?? undefined,
        unitPrice: product.salePrice ?? product.basePrice,
        quantity: selectedQty,
      },
    ]);
    setSelectedProductId(null);
    setProductQuery('');
    setSelectedQty(1);
  };

  const onSubmit = async (data: HeatingOilDeliveryCreateFormValues) => {
    try {
      // 주소 저장
      if (selectedAddress) {
        await saveAddress({
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
          addrDetail: data.deliveryAddressDetail || '',
          status: 'ACTIVE',
          dataSource: 'JUSO_API',
        });
      }

      const res = await createDelivery({
        storeId: data.storeId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        guestEmail: data.guestEmail || undefined,
        deliveryAddress: data.deliveryAddress,
        deliveryAddressDetail: data.deliveryAddressDetail || undefined,
        fuelType: data.fuelType,
        orderType: data.orderType,
        requestedLiters: data.requestedLiters,
        tankCapacity: data.tankCapacity,
        tankCurrentLevel: data.tankCurrentLevel,
        serviceAmount: data.serviceAmount,
        deliveryFee: data.deliveryFee,
        urgentFee: data.urgentFee,
        totalAmount: data.totalAmount,
        paymentType: data.paymentType,
        scheduledDate: data.scheduledDate,
        scheduledTimeSlot: data.scheduledTimeSlot,
        isUrgent: data.isUrgent,
        urgentReason: data.urgentReason || undefined,
        notes: data.notes || undefined,
      });

      if (res.success) {
        toast.success('난방유 배달이 등록되었습니다!');
        navigate('/admin/heating-oil-deliveries');
      } else {
        toast.error(res.error?.message ?? '등록에 실패했습니다.');
      }
    } catch {
      toast.error('난방유 배달 등록 중 오류가 발생했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <PageHead
        title={`난방유 배달 등록 - ${COMPANY_INFO.name}`}
        description="새로운 난방유 배달을 등록하세요."
        keywords={['난방유 배달 등록', COMPANY_INFO.name]}
        og={{
          title: `난방유 배달 등록 - ${COMPANY_INFO.name}`,
          description: '난방유 배달 등록',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />

      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/heating-oil-deliveries">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            난방유 배달 등록
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/heating-oil-deliveries')}
          >
            취소
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                등록 중...
              </>
            ) : (
              '등록하기'
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 lg:grid-cols-5"
        >
          {/* ── 좌측 메인 (3/5) ── */}
          <div className="space-y-4 lg:col-span-3">
            {/* 고객 정보 - CustomerSearch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="size-4 opacity-60" />
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

            {/* 배달 주소 - AddressSearchInput */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">배달 주소 *</CardTitle>
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
                    <p className="mt-0.5 text-xs text-blue-700">
                      우편번호: {selectedAddress.zipNo}
                    </p>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryAddressDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상세 주소</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="101동 201호"
                          disabled={!selectedAddress}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 주문 정보 - 상품 검색 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="size-4 opacity-60" />
                  주문 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>유종 *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(HEATING_OIL_FUEL_TYPE_LABELS).map(
                                ([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requestedLiters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>요청 수량 (L) *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="tankCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>탱크 용량 (L)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            placeholder="선택"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
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
                    name="tankCurrentLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>현재 잔량 (L)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            placeholder="선택"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 상품 검색 */}
                <Separator />
                <div className="space-y-2">
                  <FormLabel>관련 상품 검색</FormLabel>
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
                    <div className="max-h-52 divide-y overflow-y-auto rounded-md border">
                      {filteredProducts.length === 0 ? (
                        <p className="px-3 py-4 text-center text-sm text-muted-foreground">
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
                              <p className="truncate text-sm font-medium">
                                {p.name}
                              </p>
                              <span className="ml-2 shrink-0 text-sm font-semibold">
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

                {items.length > 0 && (
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
                                className="shrink-0 text-xs"
                              >
                                {item.productSku}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 메모 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">메모</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="내부 메모 (선택)"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* ── 우측 설정 (2/5) ── */}
          <div className="space-y-4 lg:col-span-2">
            {/* 매장 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">매장</CardTitle>
              </CardHeader>
              <CardContent>
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
                            <SelectValue placeholder="매장 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {stores.map((store) => (
                              <SelectItem
                                key={store.id}
                                value={String(store.id)}
                              >
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
              </CardContent>
            </Card>

            {/* 배달 일정 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">배달 일정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>배달 날짜 *</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduledTimeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>시간대 *</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="시간대 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOT_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="isUrgent"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <Label htmlFor="isUrgent">긴급 배달</Label>
                      <FormControl>
                        <Switch
                          id="isUrgent"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {isUrgent && (
                  <FormField
                    control={form.control}
                    name="urgentReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>긴급 사유</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="긴급 배달 사유" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* 결제 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">결제 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>결제 방식</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_TYPE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>서비스 금액</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                            recalcTotal();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>배달비</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                            recalcTotal();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isUrgent && (
                  <FormField
                    control={form.control}
                    name="urgentFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>긴급 수수료</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                              recalcTotal();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Separator />
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                  <span className="text-sm font-medium">총액</span>
                  <span className="font-bold">
                    ₩{(form.watch('totalAmount') ?? 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </>
  );
}
