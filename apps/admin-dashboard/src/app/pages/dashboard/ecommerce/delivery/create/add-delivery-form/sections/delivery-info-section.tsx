import { UseFormReturn, useWatch } from 'react-hook-form';
import { Building2, Package, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
// ✅ 실제 Store 타입 import
import type { Store } from '@starcoex-frontend/stores';
import type { DeliveryFormValues } from '../add-delivery-form.schema';
import {
  DEFAULT_QUANTITY_UNIT,
  STORE_QUANTITY_UNIT,
} from '../add-delivery-form.constants';

interface Props {
  form: UseFormReturn<DeliveryFormValues>;
  stores: Store[];
  autoInjected: {
    itemCount: boolean;
    totalQuantity: boolean;
    customerNotes: boolean;
  };
  autoSourceLabel: string;
  /** 수기 입력 모드 여부 — true이면 매장 직접 선택 UI 표시 */
  isManualMode: boolean;
}

// ✅ 어떤 형태로 와도 안전하게 문자열 추출
function safeString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  // GraphQL 관계 객체 { __typename, id, code, name } 형태
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj['code'] === 'string') return obj['code'];
    if (typeof obj['name'] === 'string') return obj['name'];
  }
  return '';
}

function AutoBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-blue-600">
      <Sparkles className="h-3 w-3" />
      {label}에서 자동 입력됨 (수정 가능)
    </span>
  );
}

export function DeliveryInfoSection({
  form,
  stores,
  autoInjected,
  autoSourceLabel,
  isManualMode,
}: Props) {
  const selectedStoreId = useWatch({ control: form.control, name: 'storeId' });

  const selectedStore = stores.find((s) => String(s.id) === selectedStoreId);

  // ✅ Store의 serviceType 관련 필드를 안전하게 추출
  // stores.types.ts의 실제 Store 타입 확인 후 올바른 필드명 사용
  const rawServiceType =
    (selectedStore as unknown as Record<string, unknown>)?.[
      'serviceTypeCode'
    ] ??
    (selectedStore as unknown as Record<string, unknown>)?.['serviceType'] ??
    '';
  const serviceType = safeString(rawServiceType);

  const quantityUnit =
    STORE_QUANTITY_UNIT[serviceType] ?? DEFAULT_QUANTITY_UNIT;
  const isFuelType = serviceType === 'FUEL' || serviceType === 'HEATING_OIL';

  // ✅ 매장 주소도 안전하게 추출
  const storeAddress = safeString(
    (selectedStore as unknown as Record<string, unknown>)?.['address'] ??
      (selectedStore as unknown as Record<string, unknown>)?.['roadAddress'] ??
      ''
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>배송 기본 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 출발 매장 */}
        {isManualMode ? (
          /* 수기 모드: 드롭다운으로 직접 선택 */
          <FormField
            control={form.control}
            name="storeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>출발 매장 *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="매장을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {stores.map((store) => {
                        const typeCode = safeString(
                          (store as unknown as Record<string, unknown>)[
                            'serviceTypeCode'
                          ] ??
                            (store as unknown as Record<string, unknown>)[
                              'serviceType'
                            ]
                        );
                        return (
                          <SelectItem key={store.id} value={String(store.id)}>
                            <span>{store.name}</span>
                            {typeCode && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {typeCode}
                              </Badge>
                            )}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
                {storeAddress && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    📍 {storeAddress}
                  </p>
                )}
              </FormItem>
            )}
          />
        ) : (
          /* 주문/예약 모드: 자동 주입된 매장 읽기 전용 표시 */
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">
              출발 매장 *
            </label>
            {selectedStore ? (
              <div className="rounded-md border bg-muted px-3 py-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-sm">
                    {selectedStore.name}
                  </span>
                  {serviceType && (
                    <Badge variant="outline" className="text-xs">
                      {serviceType}
                    </Badge>
                  )}
                </div>
                {storeAddress && (
                  <p className="text-muted-foreground mt-1 text-xs pl-6">
                    📍 {storeAddress}
                  </p>
                )}
                {autoSourceLabel && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-blue-600 pl-6">
                    <Sparkles className="h-3 w-3" />
                    {autoSourceLabel}에서 자동 불러옴
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                주문 또는 예약을 선택하면 매장이 자동으로 설정됩니다.
              </div>
            )}
            <input type="hidden" {...form.register('storeId')} />
          </div>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* 아이템 수 */}
          <FormField
            control={form.control}
            name="itemCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이템 수 *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Package className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      className="pl-9"
                      placeholder="1"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                </FormControl>
                {autoInjected.itemCount && (
                  <AutoBadge label={autoSourceLabel} />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 총 수량/무게 */}
          <FormField
            control={form.control}
            name="totalQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  총 {isFuelType ? '용량' : '무게'}{' '}
                  <span className="text-muted-foreground font-normal text-xs">
                    ({quantityUnit})
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    step={isFuelType ? 1 : 0.1}
                    placeholder={isFuelType ? '0' : '0.0'}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : parseFloat(e.target.value)
                      )
                    }
                  />
                </FormControl>
                {autoInjected.totalQuantity && (
                  <AutoBadge label={autoSourceLabel} />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 특별 지시사항 */}
        <FormField
          control={form.control}
          name="specialInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>특별 지시사항</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="배송 시 특별히 주의할 사항을 입력하세요"
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 고객 요청사항 */}
        <FormField
          control={form.control}
          name="customerNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>고객 요청사항</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="고객이 요청한 사항을 입력하세요"
                  rows={2}
                />
              </FormControl>
              {autoInjected.customerNotes && (
                <AutoBadge label={autoSourceLabel} />
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
