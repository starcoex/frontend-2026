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
import { ArrowLeft, Loader2, User, Package } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useHeatingOilDeliveries } from '@starcoex-frontend/reservations';
import { useStores } from '@starcoex-frontend/stores';
import { useEffect, useState } from 'react';
import {
  HeatingOilDeliveryCreateSchema,
  type HeatingOilDeliveryCreateFormValues,
} from './heating-oil-delivery-create-schema';
import { HEATING_OIL_FUEL_TYPE_LABELS } from '@/app/pages/dashboard/ecommerce/reservations/data/heating-oil-delivery-walk-in-data';
import {
  CustomerSearch,
  type SelectedCustomer,
  AddressFormFields,
} from '@starcoex-frontend/common';
import { useAddressForm } from '@starcoex-frontend/common';

const TIME_SLOT_OPTIONS = [
  { value: '09:00-12:00', label: '오전 (09:00 ~ 12:00)' },
  { value: '12:00-15:00', label: '오후 1 (12:00 ~ 15:00)' },
  { value: '15:00-18:00', label: '오후 2 (15:00 ~ 18:00)' },
  { value: '18:00-21:00', label: '저녁 (18:00 ~ 21:00)' },
];

export default function HeatingOilDeliveryCreatePage() {
  const navigate = useNavigate();
  const { createDelivery } = useHeatingOilDeliveries();
  const { stores, fetchStores } = useStores();
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const form = useForm<HeatingOilDeliveryCreateFormValues>({
    resolver: zodResolver(HeatingOilDeliveryCreateSchema),
    defaultValues: {
      storeId: 0,
      userId: 0,
      productId: undefined,
      customerName: '',
      customerPhone: '',
      guestEmail: '',
      deliveryAddress: '',
      deliveryAddressDetail: '',
      fuelType: 'KEROSENE',
      orderType: 'STANDARD',
      requestedLiters: 0,
      scheduledDate: '',
      scheduledTimeSlot: '',
      isUrgent: false,
      urgentReason: '',
      notes: '',
    },
  });

  const { selectedAddress, handleAddressSelect } = useAddressForm(form);

  const isUrgent = form.watch('isUrgent');

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

  const onSubmit = async (data: HeatingOilDeliveryCreateFormValues) => {
    try {
      const res = await createDelivery({
        storeId: data.storeId,
        productId: data.productId,
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
            {/* 고객 정보 */}
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

            {/* 배달 주소 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">배달 주소 *</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressFormFields
                  form={form}
                  selectedAddress={selectedAddress}
                  onAddressSelect={handleAddressSelect}
                />
                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 주문 정보 */}
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
          </div>
        </form>
      </Form>
    </>
  );
}
