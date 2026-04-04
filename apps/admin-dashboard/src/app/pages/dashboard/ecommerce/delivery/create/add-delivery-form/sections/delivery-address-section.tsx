import { useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddressFormFields } from '@starcoex-frontend/common';
import type { JusoApiAddress } from '@starcoex-frontend/graphql';
import type { DeliveryFormValues } from '../add-delivery-form.schema';

interface Props {
  form: UseFormReturn<DeliveryFormValues>;
  pickupAutoInjected: boolean;
  deliveryAutoInjected: boolean;
}

export function DeliveryAddressSection({
  form,
  pickupAutoInjected,
  deliveryAutoInjected,
}: Props) {
  const [sameAddress, setSameAddress] = useState(false);
  const [pickupSelected, setPickupSelected] = useState<JusoApiAddress | null>(
    null
  );
  const [deliverySelected, setDeliverySelected] =
    useState<JusoApiAddress | null>(null);

  // ✅ 안전한 문자열 변환 헬퍼
  const safeStr = (val: unknown): string => {
    if (typeof val === 'string') return val;
    if (val == null) return '';
    if (typeof val === 'object') {
      const obj = val as Record<string, unknown>;
      if (typeof obj['roadAddr'] === 'string') return obj['roadAddr'];
      if (typeof obj['address'] === 'string') return obj['address'];
    }
    return '';
  };

  const pickupRoadAddress = useWatch({
    control: form.control,
    name: 'pickupRoadAddress',
  });
  const deliveryRoadAddress = useWatch({
    control: form.control,
    name: 'deliveryRoadAddress',
  });

  const pickupAddrStr = safeStr(pickupRoadAddress);
  const deliveryAddrStr = safeStr(deliveryRoadAddress);

  // ── 픽업 주소 선택 핸들러 ──────────────────────────────────────────────
  const handlePickupSelect = (address: JusoApiAddress) => {
    setPickupSelected(address);
    form.setValue('pickupRoadAddress', address.roadAddr, {
      shouldValidate: true,
    });
    form.setValue('pickupZipCode', address.zipNo);
    form.setValue('pickupAddressDetail', '');

    if (sameAddress) {
      setDeliverySelected(address);
      form.setValue('deliveryRoadAddress', address.roadAddr, {
        shouldValidate: true,
      });
      form.setValue('deliveryZipCode', address.zipNo);
      form.setValue('deliveryAddressDetail', '');
    }
  };

  // ── 배송 주소 선택 핸들러 ──────────────────────────────────────────────
  const handleDeliverySelect = (address: JusoApiAddress) => {
    setDeliverySelected(address);
    form.setValue('deliveryRoadAddress', address.roadAddr, {
      shouldValidate: true,
    });
    form.setValue('deliveryZipCode', address.zipNo);
    form.setValue('deliveryAddressDetail', '');
    setSameAddress(false);
  };

  // ── 픽업 = 배송 동일 체크박스 ─────────────────────────────────────────
  const handleSameAddress = (checked: boolean) => {
    setSameAddress(checked);
    if (checked && pickupAddrStr) {
      setDeliverySelected(pickupSelected);
      form.setValue('deliveryRoadAddress', pickupAddrStr, {
        shouldValidate: true,
      });
      form.setValue(
        'deliveryZipCode',
        safeStr(form.getValues('pickupZipCode'))
      );
      form.setValue(
        'deliveryAddressDetail',
        safeStr(form.getValues('pickupAddressDetail'))
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>주소 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pickup" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="pickup" className="flex-1 gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              픽업 주소
              {pickupAddrStr && (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              )}
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex-1 gap-2">
              <MapPin className="h-3.5 w-3.5 text-destructive" />
              배송 주소
              {deliveryAddrStr && (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── 픽업 주소 탭 ── */}
          <TabsContent value="pickup" className="mt-4 space-y-3">
            {pickupAutoInjected && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Sparkles className="h-3 w-3" />
                매장 주소에서 자동 입력됨 (수정 가능)
              </div>
            )}

            {/*
              ✅ AddressFormFields 내부에 주소 표시 + 검색 UI가 포함됨
                 → 별도 미리보기 박스 제거, 상세주소 Input도 여기서 렌더링
            */}
            <AddressFormFields
              form={
                {
                  ...form,
                  setValue: (
                    name: string,
                    value: unknown,
                    options?: object
                  ) => {
                    const mapped: Record<string, keyof DeliveryFormValues> = {
                      roadAddress: 'pickupRoadAddress',
                      zipCode: 'pickupZipCode',
                      addressDetail: 'pickupAddressDetail',
                    };
                    form.setValue(
                      (mapped[name] ?? name) as keyof DeliveryFormValues,
                      value as any,
                      options
                    );
                  },
                } as any
              }
              selectedAddress={pickupSelected}
              onAddressSelect={handlePickupSelect}
            />
          </TabsContent>

          {/* ── 배송 주소 탭 ── */}
          <TabsContent value="delivery" className="mt-4 space-y-3">
            {/* 픽업지와 동일 체크박스 */}
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Checkbox
                id="sameAddress"
                checked={sameAddress}
                onCheckedChange={(checked) =>
                  handleSameAddress(checked as boolean)
                }
                disabled={!pickupAddrStr}
              />
              <label
                htmlFor="sameAddress"
                className="cursor-pointer text-sm font-medium"
              >
                픽업 주소와 동일
              </label>
              {!pickupAddrStr && (
                <span className="text-muted-foreground text-xs">
                  (픽업 주소를 먼저 입력하세요)
                </span>
              )}
            </div>

            {sameAddress && pickupAddrStr ? (
              /* 동일 주소 요약만 표시 — 입력 UI 숨김 */
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <Badge variant="outline" className="mb-1 text-xs">
                      픽업 주소와 동일
                    </Badge>
                    <p className="text-sm font-medium text-blue-900">
                      {pickupAddrStr}
                    </p>
                    {safeStr(form.getValues('pickupZipCode')) && (
                      <p className="text-xs text-blue-700">
                        우편번호: {safeStr(form.getValues('pickupZipCode'))}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {deliveryAutoInjected && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Sparkles className="h-3 w-3" />
                    주문/예약에서 자동 입력됨 (수정 가능)
                  </div>
                )}
                {/*
                  ✅ 마찬가지로 AddressFormFields만 사용
                     → 별도 미리보기 박스·상세주소 Input 제거
                */}
                <AddressFormFields
                  form={
                    {
                      ...form,
                      setValue: (
                        name: string,
                        value: unknown,
                        options?: object
                      ) => {
                        const mapped: Record<string, keyof DeliveryFormValues> =
                          {
                            roadAddress: 'deliveryRoadAddress',
                            zipCode: 'deliveryZipCode',
                            addressDetail: 'deliveryAddressDetail',
                          };
                        form.setValue(
                          (mapped[name] ?? name) as keyof DeliveryFormValues,
                          value as any,
                          options
                        );
                      },
                    } as any
                  }
                  selectedAddress={deliverySelected}
                  onAddressSelect={handleDeliverySelect}
                />
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* 주소 입력 현황 요약 */}
        <Separator className="mt-4" />
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full ${
                pickupAddrStr ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-muted-foreground">픽업 주소</span>
            <span className="truncate font-medium">
              {pickupAddrStr ? pickupAddrStr.slice(0, 15) + '...' : '미입력'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full ${
                deliveryAddrStr ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-muted-foreground">배송 주소</span>
            <span className="truncate font-medium">
              {deliveryAddrStr
                ? deliveryAddrStr.slice(0, 15) + '...'
                : '미입력'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
