import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useInventory } from '@starcoex-frontend/inventory';
import type { StoreInventory } from '@starcoex-frontend/inventory';
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';
import { INVENTORY_ZONE_OPTIONS } from '@/app/pages/dashboard/ecommerce/inventory/data/inventory-data';

// ─── Zod 스키마 ───────────────────────────────────────────────────────────────
// UpdateStoreInventoryInput 기준: isActive 없음, 부피 필드 추가
const FormSchema = z.object({
  minStock: z.number().min(0, '0 이상이어야 합니다.'),
  maxStock: z.number().min(1, '1 이상이어야 합니다.'),
  reorderPoint: z.number().min(0, '0 이상이어야 합니다.'),
  reorderQuantity: z.number().min(1, '1 이상이어야 합니다.'),
  costPrice: z.number().min(0).optional(),
  storePrice: z.number().min(0).optional(),
  location: z.string().optional(),
  zone: z.string().optional(),
  unit: z.string().optional(),
  isAvailable: z.boolean(),
  isSellable: z.boolean(),
  // 연료 부피 설정 (선택)
  minVolume: z.number().min(0).optional(),
  maxVolume: z.number().min(0).optional(),
  reorderVolume: z.number().min(0).optional(),
});

type FormValues = z.infer<typeof FormSchema>;

interface InventoryEditFormProps {
  inventory: StoreInventory;
}

export function InventoryEditForm({ inventory }: InventoryEditFormProps) {
  const navigate = useNavigate();
  const { updateStoreInventory } = useInventory();

  const isFuelZone =
    inventory.zone === 'FUEL' || inventory.currentVolume != null;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      minStock: inventory.minStock,
      maxStock: inventory.maxStock,
      reorderPoint: inventory.reorderPoint,
      reorderQuantity: inventory.reorderQuantity,
      costPrice: inventory.costPrice ?? undefined,
      storePrice: inventory.storePrice ?? undefined,
      location: inventory.location ?? '',
      zone: inventory.zone ?? '',
      unit: inventory.unit ?? 'EA',
      isAvailable: inventory.isAvailable,
      isSellable: inventory.isSellable,
      minVolume: inventory.minVolume ?? undefined,
      maxVolume: inventory.maxVolume ?? undefined,
      reorderVolume: inventory.reorderVolume ?? undefined,
    },
  });

  const watchedZone = form.watch('zone');
  const showVolumeFields = isFuelZone || watchedZone === 'FUEL';
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await updateStoreInventory({
        id: inventory.id,
        minStock: data.minStock,
        maxStock: data.maxStock,
        reorderPoint: data.reorderPoint,
        reorderQuantity: data.reorderQuantity,
        costPrice: data.costPrice ?? null,
        storePrice: data.storePrice ?? null,
        location: data.location || null,
        zone: data.zone || null,
        unit: data.unit || undefined,
        isAvailable: data.isAvailable,
        isSellable: data.isSellable,
        ...(showVolumeFields && {
          minVolume: data.minVolume ?? null,
          maxVolume: data.maxVolume ?? null,
          reorderVolume: data.reorderVolume ?? null,
        }),
      });

      if (res.success) {
        toast.success('재고 정보가 수정되었습니다.');
        navigate(INVENTORY_ROUTES.DETAIL.replace(':id', String(inventory.id)));
      } else {
        toast.error(res.error?.message ?? '재고 수정에 실패했습니다.');
      }
    } catch {
      toast.error('재고 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 헤더 */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link
                to={INVENTORY_ROUTES.DETAIL.replace(
                  ':id',
                  String(inventory.id)
                )}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                재고 #{inventory.id} 수정
              </h1>
              <p className="text-muted-foreground text-sm">
                매장 #{inventory.storeId} · 상품 #{inventory.productId}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate(
                  INVENTORY_ROUTES.DETAIL.replace(':id', String(inventory.id))
                )
              }
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장하기'
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* ─── 좌측 메인 (2/3) ── */}
          <div className="space-y-4 lg:col-span-2">
            {/* 재고 수량 기준 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>재고 수량 기준</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="minStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>최소 재고 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          이 수량 이하면 재고 부족 알림
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
                        <FormLabel>최대 재고 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
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
                    name="reorderPoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>재주문 시점 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          이 수량 이하면 재주문 알림
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reorderQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>재주문 수량 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={1}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
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

            {/* 가격 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>가격 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>원가</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder="0"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ''
                                  ? undefined
                                  : parseFloat(e.target.value)
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
                    name="storePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>매장 판매가</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder="0"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ''
                                  ? undefined
                                  : parseFloat(e.target.value)
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

            {/* 연료 부피 설정 (FUEL 구역일 때만) */}
            {showVolumeFields && (
              <Card>
                <CardHeader>
                  <CardTitle>연료 부피 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="minVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>최소 부피 (L)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              step={0.1}
                              placeholder="0"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? undefined
                                    : parseFloat(e.target.value)
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
                      name="maxVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>최대 부피 (L)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              step={0.1}
                              placeholder="0"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? undefined
                                    : parseFloat(e.target.value)
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
                      name="reorderVolume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>재주문 시점 (L)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              step={0.1}
                              placeholder="0"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ''
                                    ? undefined
                                    : parseFloat(e.target.value)
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
            )}
          </div>

          {/* ─── 우측 (1/3) ── */}
          <div className="space-y-4">
            {/* 위치 / 단위 */}
            <Card>
              <CardHeader>
                <CardTitle>위치 및 단위</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="zone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>구역</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? ''}
                          onValueChange={(v) =>
                            field.onChange(v === '__none__' ? '' : v)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="구역 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">선택 안 함</SelectItem>
                            {INVENTORY_ZONE_OPTIONS.map((zone) => (
                              <SelectItem key={zone.value} value={zone.value}>
                                {zone.label}
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
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>위치</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="A동-1층-3번" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>재고 단위</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="EA, LITER, KG 등" />
                      </FormControl>
                      <FormDescription className="text-xs">
                        예: EA(개), LITER(리터), KG(킬로그램)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 판매 상태 (isActive 제외 — 백엔드 미지원) */}
            <Card>
              <CardHeader>
                <CardTitle>판매 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Separator />
                {(
                  [
                    {
                      name: 'isAvailable',
                      label: '판매 가능',
                      desc: '현장 판매 여부',
                    },
                    {
                      name: 'isSellable',
                      label: '온라인 판매',
                      desc: '온라인 주문 허용',
                    },
                  ] as const
                ).map(({ name, label, desc }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between gap-2 py-1">
                        <div>
                          <Label className="font-medium">{label}</Label>
                          <p className="text-muted-foreground text-xs">
                            {desc}
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
                ))}
              </CardContent>
            </Card>

            {/* 현재 재고 현황 (읽기 전용) */}
            <Card>
              <CardHeader>
                <CardTitle>현재 재고 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">현재 재고</span>
                  <span className="font-medium">
                    {inventory.currentStock.toLocaleString()} {inventory.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">예약 재고</span>
                  <span className="font-medium">
                    {inventory.reservedStock.toLocaleString()} {inventory.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">가용 재고</span>
                  <span className="font-medium">
                    {inventory.availableStock.toLocaleString()} {inventory.unit}
                  </span>
                </div>
                {inventory.currentVolume != null && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">현재 부피</span>
                      <span className="font-medium">
                        {inventory.currentVolume.toLocaleString()} L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">가용 부피</span>
                      <span className="font-medium">
                        {(inventory.availableVolume ?? 0).toLocaleString()} L
                      </span>
                    </div>
                  </>
                )}
                <Separator />
                <p className="text-muted-foreground text-xs">
                  * 수량 변경은 입고/출고 처리를 통해 진행하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
