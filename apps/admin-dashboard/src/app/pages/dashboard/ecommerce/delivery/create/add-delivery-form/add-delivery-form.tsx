import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useDelivery } from '@starcoex-frontend/delivery';
import { useStores } from '@starcoex-frontend/stores';
import { useOrders } from '@starcoex-frontend/orders';
import { useReservations } from '@starcoex-frontend/reservations';
import { DELIVERY_ROUTES } from '@/app/constants/delivery-routes';

import {
  DeliveryFormSchema,
  type DeliveryFormValues,
  type DeliverySourceData,
} from './add-delivery-form.schema';
import { DeliverySourceSection } from './sections/delivery-source-section';
import { DeliveryInfoSection } from './sections/delivery-info-section';
import { DeliveryAddressSection } from './sections/delivery-address-section';
import { DeliveryFeeSection } from './sections/delivery-fee-section';

// ── 자동 주입 추적 상태 ────────────────────────────────────────────────────

interface AutoInjectedState {
  itemCount: boolean;
  totalQuantity: boolean;
  customerNotes: boolean;
  pickupAddress: boolean;
  deliveryAddress: boolean;
}

export default function AddDeliveryForm() {
  const navigate = useNavigate();
  const { createDelivery } = useDelivery();
  const { stores, fetchStores } = useStores();
  const { orders, fetchOrders } = useOrders();
  const { reservations, fetchReservations } = useReservations();

  const [autoInjected, setAutoInjected] = useState<AutoInjectedState>({
    itemCount: false,
    totalQuantity: false,
    customerNotes: false,
    pickupAddress: false,
    deliveryAddress: false,
  });
  const [autoSourceLabel, setAutoSourceLabel] = useState('');

  useEffect(() => {
    fetchStores();
    fetchOrders();
    fetchReservations({ page: 1, limit: 100 });
  }, [fetchStores, fetchOrders, fetchReservations]);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(DeliveryFormSchema),
    mode: 'onChange',
    defaultValues: {
      sourceType: 'order',
      orderId: undefined,
      reservationId: undefined,
      storeId: '',
      deliveryFee: 0,
      driverFee: 0,
      platformFee: 0,
      itemCount: 1,
      totalQuantity: undefined,
      priority: 'NORMAL',
      specialInstructions: '',
      customerNotes: '',
      pickupRoadAddress: '',
      pickupAddressDetail: '',
      pickupZipCode: '',
      deliveryRoadAddress: '',
      deliveryAddressDetail: '',
      deliveryZipCode: '',
      sameAsDelivery: false,
    },
  });
  const sourceType = form.watch('sourceType');
  const isManualMode = sourceType === 'manual';

  // ✅ 매장/주소 객체에서 도로명 주소 문자열을 안전하게 추출
  function extractRoadAddress(value: unknown): string {
    if (typeof value === 'string' && value.trim()) return value;
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      // 주소 객체 형태: { roadAddr, roadAddress, address, ... }
      for (const key of ['roadAddr', 'roadAddress', 'address', 'fullAddress']) {
        if (typeof obj[key] === 'string' && (obj[key] as string).trim()) {
          return obj[key] as string;
        }
      }
    }
    return '';
  }

  function extractZipCode(value: unknown): string {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      for (const key of ['zipNo', 'zipCode', 'zip']) {
        if (typeof obj[key] === 'string') return obj[key] as string;
      }
    }
    return '';
  }

  // ── 매장 선택 시 픽업 주소 자동 주입 ─────────────────────────────────────
  const storeId = form.watch('storeId');
  const prevStoreIdRef = useRef('');

  useEffect(() => {
    if (!storeId || storeId === prevStoreIdRef.current) return;
    prevStoreIdRef.current = storeId;

    const store = stores.find((s) => String(s.id) === storeId);
    if (!store) return;

    // ✅ store.address 가 문자열이든 객체든 안전하게 추출
    const storeRaw = store as unknown as Record<string, unknown>;
    const roadAddress = extractRoadAddress(
      storeRaw['address'] ??
        storeRaw['roadAddress'] ??
        storeRaw['addressInfo'] ??
        ''
    );
    const zipCode = extractZipCode(
      storeRaw['zipCode'] ??
        storeRaw['zipNo'] ??
        (storeRaw['address'] && typeof storeRaw['address'] === 'object'
          ? (storeRaw['address'] as Record<string, unknown>)['zipNo']
          : '')
    );

    if (roadAddress) {
      form.setValue('pickupRoadAddress', roadAddress, { shouldValidate: true });
      if (zipCode) form.setValue('pickupZipCode', zipCode);
      setAutoInjected((prev) => ({ ...prev, pickupAddress: true }));
    }
  }, [storeId, stores, form]);

  // ── 소스(주문/예약) 선택 시 자동 주입 ────────────────────────────────────
  const handleSourceSelect = useCallback(
    (data: DeliverySourceData, label: string) => {
      setAutoSourceLabel(label);
      const injected: AutoInjectedState = {
        itemCount: false,
        totalQuantity: false,
        customerNotes: false,
        pickupAddress: autoInjected.pickupAddress,
        deliveryAddress: false,
      };

      if (data.storeId) {
        form.setValue('storeId', String(data.storeId));
      }
      if (data.itemCount !== undefined) {
        form.setValue('itemCount', data.itemCount, { shouldValidate: true });
        injected.itemCount = true;
      }
      if (data.totalWeight !== undefined) {
        form.setValue('totalQuantity', data.totalWeight);
        injected.totalQuantity = true;
      }
      if (data.customerNotes) {
        form.setValue('customerNotes', data.customerNotes);
        injected.customerNotes = true;
      }
      if (data.deliveryRoadAddress) {
        form.setValue('deliveryRoadAddress', data.deliveryRoadAddress, {
          shouldValidate: true,
        });
        form.setValue('deliveryZipCode', data.deliveryZipCode ?? '');
        form.setValue(
          'deliveryAddressDetail',
          data.deliveryAddressDetail ?? ''
        );
        injected.deliveryAddress = true;
      }

      setAutoInjected(injected);
    },
    [form, autoInjected.pickupAddress]
  );

  // ── 플랫폼 수수료 자동 계산 ──────────────────────────────────────────────
  const deliveryFee = form.watch('deliveryFee');
  const driverFee = form.watch('driverFee');

  useEffect(() => {
    form.setValue(
      'platformFee',
      Math.max(0, (deliveryFee ?? 0) - (driverFee ?? 0))
    );
  }, [deliveryFee, driverFee, form]);

  // ── 제출 ─────────────────────────────────────────────────────────────────
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: DeliveryFormValues) {
    const selectedReservation = reservations.find(
      (r) => r.id === data.reservationId
    );
    const resolvedOrderId =
      data.sourceType === 'order'
        ? data.orderId!
        : (selectedReservation as { orderId?: number })?.orderId ?? 0;

    const res = await createDelivery({
      orderId: resolvedOrderId,
      storeId: parseInt(data.storeId),
      deliveryFee: data.deliveryFee,
      driverFee: data.driverFee,
      platformFee: data.platformFee ?? 0,
      itemCount: data.itemCount,
      totalWeight: data.totalQuantity,
      priority: data.priority,
      specialInstructions: data.specialInstructions || undefined,
      customerNotes: data.customerNotes || undefined,
      pickupAddress: {
        roadAddress: data.pickupRoadAddress,
        addressDetail: data.pickupAddressDetail,
        zipCode: data.pickupZipCode,
      },
      deliveryAddress: {
        roadAddress: data.deliveryRoadAddress,
        addressDetail: data.deliveryAddressDetail,
        zipCode: data.deliveryZipCode,
      },
    });

    if (res.success) {
      toast.success(
        res.data?.creationMessage ?? '배송이 성공적으로 등록되었습니다!'
      );
      navigate(DELIVERY_ROUTES.LIST);
    } else {
      toast.error(res.error?.message ?? '배송 등록에 실패했습니다.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 헤더 */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to={DELIVERY_ROUTES.LIST}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">배송 추가</h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(DELIVERY_ROUTES.LIST)}
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
          {/* ── 좌측 4칸 ── */}
          <div className="space-y-4 lg:col-span-4">
            <DeliverySourceSection
              form={form}
              orders={orders}
              reservations={reservations}
              onSourceSelect={(data) =>
                handleSourceSelect(
                  data,
                  form.getValues('sourceType') === 'order' ? '주문' : '예약'
                )
              }
            />
            <DeliveryInfoSection
              form={form}
              stores={stores}
              autoInjected={{
                itemCount: autoInjected.itemCount,
                totalQuantity: autoInjected.totalQuantity,
                customerNotes: autoInjected.customerNotes,
              }}
              autoSourceLabel={autoSourceLabel}
              isManualMode={isManualMode}
            />
            <DeliveryAddressSection
              form={form}
              pickupAutoInjected={autoInjected.pickupAddress}
              deliveryAutoInjected={autoInjected.deliveryAddress}
            />
          </div>

          {/* ── 우측 2칸 ── */}
          <div className="space-y-4 lg:col-span-2">
            <DeliveryFeeSection form={form} />
          </div>
        </div>
      </form>
    </Form>
  );
}
