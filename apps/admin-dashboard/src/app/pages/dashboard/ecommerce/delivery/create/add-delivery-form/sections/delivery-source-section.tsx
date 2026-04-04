import { useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { Check, ChevronsUpDown, PencilLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Order } from '@starcoex-frontend/orders';
import type { Reservation } from '@starcoex-frontend/reservations';
import type {
  DeliveryFormValues,
  DeliverySourceData,
} from '../add-delivery-form.schema';
import { SOURCE_TYPE_OPTIONS } from '../add-delivery-form.constants';

interface Props {
  form: UseFormReturn<DeliveryFormValues>;
  orders: Order[];
  reservations: Reservation[];
  onSourceSelect: (data: DeliverySourceData) => void;
}

// ✅ 고객 이름 안전 추출 헬퍼
function getCustomerName(customerInfo: unknown): string {
  if (!customerInfo || typeof customerInfo !== 'object') return '';
  const ci = customerInfo as Record<string, unknown>;
  return (
    (typeof ci['name'] === 'string' ? ci['name'] : '') ||
    (typeof ci['customerName'] === 'string' ? ci['customerName'] : '') ||
    ''
  );
}

// ✅ 고객 전화번호 안전 추출 헬퍼
function getCustomerPhone(customerInfo: unknown): string {
  if (!customerInfo || typeof customerInfo !== 'object') return '';
  const ci = customerInfo as Record<string, unknown>;
  return (
    (typeof ci['phone'] === 'string' ? ci['phone'] : '') ||
    (typeof ci['phoneNumber'] === 'string' ? ci['phoneNumber'] : '') ||
    ''
  );
}

export function DeliverySourceSection({
  form,
  orders,
  reservations,
  onSourceSelect,
}: Props) {
  const [orderOpen, setOrderOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);

  const sourceType = useWatch({ control: form.control, name: 'sourceType' });
  const selectedOrderId = useWatch({ control: form.control, name: 'orderId' });
  const selectedReservationId = useWatch({
    control: form.control,
    name: 'reservationId',
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const selectedReservation = reservations.find(
    (r) => r.id === selectedReservationId
  );

  // ── 주문 선택 핸들러 ─────────────────────────────────────────────────────
  const handleOrderSelect = (val: string) => {
    const orderId = parseInt(val);
    form.setValue('orderId', orderId);
    setOrderOpen(false);

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const addr = (order.deliveryAddress ?? {}) as {
      roadAddr?: string;
      addressDetail?: string;
      zipNo?: string;
    };

    const totalWeight = order.items?.reduce((acc, item) => {
      const w = (item.productSnapshot as { weight?: number })?.weight ?? 0;
      return acc + w * item.quantity;
    }, 0);

    const customerNotes =
      (order.customerInfo as { notes?: string; deliveryMemo?: string })
        ?.notes ??
      order.deliveryMemo ??
      undefined;

    onSourceSelect({
      storeId: order.storeId,
      itemCount: order.items?.length ?? 1,
      totalWeight: totalWeight && totalWeight > 0 ? totalWeight : undefined,
      customerNotes,
      deliveryRoadAddress: addr.roadAddr,
      deliveryAddressDetail: addr.addressDetail,
      deliveryZipCode: addr.zipNo,
    });
  };

  // ── 예약 선택 핸들러 ─────────────────────────────────────────────────────
  const handleReservationSelect = (val: string) => {
    const reservationId = parseInt(val);
    form.setValue('reservationId', reservationId);
    setReservationOpen(false);

    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) return;

    const ci = reservation.customerInfo as {
      roadAddr?: string;
      addressDetail?: string;
      zipNo?: string;
      notes?: string;
    };

    onSourceSelect({
      storeId: reservation.storeId,
      customerNotes: reservation.specialRequests ?? ci.notes ?? undefined,
      deliveryRoadAddress: ci.roadAddr,
      deliveryAddressDetail: ci.addressDetail,
      deliveryZipCode: ci.zipNo,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>배송 출처</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 출처 유형 */}
        <FormField
          control={form.control}
          name="sourceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>출처 유형 *</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue('orderId', undefined);
                  form.setValue('reservationId', undefined);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {SOURCE_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* ── 주문 선택 (Combobox) ── */}
        {sourceType === 'order' && (
          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주문 선택 *</FormLabel>
                <Popover open={orderOpen} onOpenChange={setOrderOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {selectedOrder
                          ? (() => {
                              const name = getCustomerName(
                                selectedOrder.customerInfo
                              );
                              return `#${selectedOrder.orderNumber}${
                                name ? ` · ${name}` : ''
                              }`;
                            })()
                          : '주문을 검색하세요'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="주문번호 또는 고객명 검색..." />
                      <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {orders.map((order) => {
                            const name = getCustomerName(order.customerInfo);
                            const phone = getCustomerPhone(order.customerInfo);
                            return (
                              <CommandItem
                                key={order.id}
                                value={`${order.orderNumber} ${name} ${phone}`}
                                onSelect={() =>
                                  handleOrderSelect(String(order.id))
                                }
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === order.id
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-medium">
                                      #{order.orderNumber}
                                    </span>
                                    {name && (
                                      <span className="font-medium text-sm">
                                        {name}
                                      </span>
                                    )}
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {order.status}
                                    </Badge>
                                  </div>
                                  {phone && (
                                    <span className="text-muted-foreground text-xs">
                                      {phone}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />

                {selectedOrder && (
                  <div className="bg-muted mt-2 space-y-1 rounded-md p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">주문번호</span>
                      <span className="font-mono font-medium">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>
                    {getCustomerName(selectedOrder.customerInfo) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">고객명</span>
                        <span className="font-medium">
                          {getCustomerName(selectedOrder.customerInfo)}
                        </span>
                      </div>
                    )}
                    {getCustomerPhone(selectedOrder.customerInfo) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">연락처</span>
                        <span>
                          {getCustomerPhone(selectedOrder.customerInfo)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">아이템 수</span>
                      <Badge variant="secondary">
                        {selectedOrder.items?.length ?? 0}개
                      </Badge>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">상태</span>
                      <span>{selectedOrder.status}</span>
                    </div>
                    {selectedOrder.deliveryMemo && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">배송 메모</span>
                        <span className="text-xs">
                          {selectedOrder.deliveryMemo}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </FormItem>
            )}
          />
        )}

        {/* ── 수기 입력 안내 ── */}
        {sourceType === 'manual' && (
          <div className="rounded-lg border border-dashed border-orange-300 bg-orange-50 p-4">
            <div className="flex items-start gap-2">
              <PencilLine className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-800">
                  수기 입력 모드
                </p>
                <p className="text-xs text-orange-700">
                  주문/예약 없이 직접 배송 정보를 입력합니다.
                  <br />
                  아래 <strong>배송 기본 정보</strong>에서 매장을 직접 선택하고,
                  <strong> 주소 정보</strong>에서 픽업/배송 주소를 입력해
                  주세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── 예약 선택 (Combobox) ── */}
        {sourceType === 'reservation' && (
          <FormField
            control={form.control}
            name="reservationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>예약 선택 *</FormLabel>
                <Popover
                  open={reservationOpen}
                  onOpenChange={setReservationOpen}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {selectedReservation
                          ? (() => {
                              const name = getCustomerName(
                                selectedReservation.customerInfo
                              );
                              return `#${
                                selectedReservation.reservationNumber
                              }${name ? ` · ${name}` : ''}`;
                            })()
                          : '예약을 검색하세요'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="예약번호 또는 고객명 검색..." />
                      <CommandList>
                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                        <CommandGroup>
                          {reservations.map((r) => {
                            const name = getCustomerName(r.customerInfo);
                            const phone = getCustomerPhone(r.customerInfo);
                            return (
                              <CommandItem
                                key={r.id}
                                value={`${r.reservationNumber} ${name} ${phone} ${r.reservedDate}`}
                                onSelect={() =>
                                  handleReservationSelect(String(r.id))
                                }
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === r.id
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-medium">
                                      #{r.reservationNumber}
                                    </span>
                                    {name && (
                                      <span className="font-medium text-sm">
                                        {name}
                                      </span>
                                    )}
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {r.status}
                                    </Badge>
                                  </div>
                                  <div className="text-muted-foreground flex gap-2 text-xs">
                                    {phone && <span>{phone}</span>}
                                    <span>{r.reservedDate}</span>
                                  </div>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />

                {selectedReservation && (
                  <div className="bg-muted mt-2 space-y-1 rounded-md p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">예약번호</span>
                      <span className="font-mono font-medium">
                        {selectedReservation.reservationNumber}
                      </span>
                    </div>
                    {getCustomerName(selectedReservation.customerInfo) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">고객명</span>
                        <span className="font-medium">
                          {getCustomerName(selectedReservation.customerInfo)}
                        </span>
                      </div>
                    )}
                    {getCustomerPhone(selectedReservation.customerInfo) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">연락처</span>
                        <span>
                          {getCustomerPhone(selectedReservation.customerInfo)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">예약일</span>
                      <span className="font-medium">
                        {selectedReservation.reservedDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">상태</span>
                      <Badge variant="secondary">
                        {selectedReservation.status}
                      </Badge>
                    </div>
                    {selectedReservation.specialRequests && (
                      <>
                        <Separator className="my-1" />
                        <div>
                          <span className="text-muted-foreground">
                            고객 요청
                          </span>
                          <p className="mt-0.5 text-xs">
                            {selectedReservation.specialRequests}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
}
