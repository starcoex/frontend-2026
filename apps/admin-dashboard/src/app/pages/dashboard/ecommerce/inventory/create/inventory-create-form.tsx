import { useEffect, useMemo, useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInventory } from '@starcoex-frontend/inventory';
import { useStores } from '@starcoex-frontend/stores';
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';
import { INVENTORY_ZONE_OPTIONS } from '@/app/pages/dashboard/ecommerce/inventory/data/inventory-data';
import { useProducts } from '@starcoex-frontend/products';
import { Combobox } from '@starcoex-frontend/common';

// ─── react-hook-form 은 문자열/불리언 필드만 담당 ────────────────────────────
const FormSchema = z.object({
  storeId: z.number().min(1, { message: '매장을 선택하세요.' }),
  productId: z.number().min(1, { message: '상품을 선택하세요.' }),
  location: z.string().optional(),
  zone: z.string().optional(),
  unit: z.string().optional(),
  isActive: z.boolean(),
  isAvailable: z.boolean(),
  isSellable: z.boolean(),
});

type FormValues = z.infer<typeof FormSchema>;

// ─── 수량/부피 필드는 별도 state로 관리 ─────────────────────────────────────
interface StockValues {
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  costPrice: string; // input value는 string으로
  storePrice: string;
}

interface FuelValues {
  initialVolumeLiters: number;
  minVolume: string;
  maxVolume: string;
  reorderVolume: string;
}

interface InventoryCreateFormProps {
  defaultProductId?: number;
}

export function InventoryCreateForm({
  defaultProductId,
}: InventoryCreateFormProps) {
  const navigate = useNavigate();
  const { createInventory, addFuelStock, fetchStoreInventories } =
    useInventory();
  const { stores, fetchStores } = useStores();
  const { products, fetchProducts } = useProducts();

  // ─── 수량 state ──────────────────────────────────────────────────────────
  const [stockValues, setStockValues] = useState<StockValues>({
    currentStock: 0,
    minStock: 0,
    maxStock: 1000,
    reorderPoint: 10,
    reorderQuantity: 50,
    costPrice: '',
    storePrice: '',
  });

  // ─── 유류 state ──────────────────────────────────────────────────────────
  const [fuelValues, setFuelValues] = useState<FuelValues>({
    initialVolumeLiters: 0,
    minVolume: '',
    maxVolume: '',
    reorderVolume: '',
  });

  useEffect(() => {
    if (stores.length === 0) fetchStores();
  }, [stores.length, fetchStores]);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  const storeOptions = useMemo(
    () => stores.map((s) => ({ value: String(s.id), label: s.name })),
    [stores]
  );

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: String(p.id),
        label: p.name,
        description: p.sku,
      })),
    [products]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      storeId: 0,
      productId: defaultProductId ?? 0,
      location: '',
      zone: '',
      unit: 'EA',
      isActive: true,
      isAvailable: true,
      isSellable: true,
    },
  });

  const watchedZone = form.watch('zone');
  const isFuel = watchedZone === 'FUEL';

  useEffect(() => {
    if (isFuel) {
      form.setValue('unit', 'LITER');
    } else {
      form.setValue('unit', 'EA');
    }
  }, [isFuel, form]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: FormValues) => {
    try {
      const createRes = await createInventory({
        storeId: data.storeId,
        productId: data.productId,
        currentStock: isFuel ? 0 : stockValues.currentStock,
        minStock: isFuel ? 0 : stockValues.minStock,
        maxStock: isFuel ? 999999 : stockValues.maxStock,
        reorderPoint: isFuel ? 0 : stockValues.reorderPoint,
        reorderQuantity: isFuel ? 1 : stockValues.reorderQuantity,
        costPrice: stockValues.costPrice
          ? parseFloat(stockValues.costPrice)
          : undefined,
        storePrice: stockValues.storePrice
          ? parseFloat(stockValues.storePrice)
          : undefined,
        location: data.location || undefined,
        zone: data.zone || undefined,
        unit: data.unit || undefined,
        isActive: data.isActive,
        isAvailable: data.isAvailable,
        isSellable: data.isSellable,
        ...(isFuel && {
          minVolume: fuelValues.minVolume
            ? parseFloat(fuelValues.minVolume)
            : undefined,
          maxVolume: fuelValues.maxVolume
            ? parseFloat(fuelValues.maxVolume)
            : undefined,
          reorderVolume: fuelValues.reorderVolume
            ? parseFloat(fuelValues.reorderVolume)
            : undefined,
        }),
      });

      if (!createRes.success) {
        toast.error(createRes.error?.message ?? '재고 생성에 실패했습니다.');
        return;
      }

      if (isFuel && fuelValues.initialVolumeLiters > 0) {
        const fuelRes = await addFuelStock({
          productId: data.productId,
          storeId: data.storeId,
          volumeLiters: fuelValues.initialVolumeLiters,
          notes: '초기 유류 재고 입고',
        });

        if (!fuelRes.success) {
          toast.warning('재고는 생성됐으나 초기 유류 입고에 실패했습니다.', {
            description: '상세 페이지에서 유류 입고를 다시 시도하세요.',
          });
          await fetchStoreInventories();
          navigate(INVENTORY_ROUTES.LIST);
          return;
        }

        toast.success('유류 재고가 성공적으로 등록되었습니다.', {
          description: `초기 입고량: ${fuelValues.initialVolumeLiters}L`,
        });
      } else {
        toast.success('재고가 성공적으로 생성되었습니다.');
      }

      await fetchStoreInventories();
      navigate(INVENTORY_ROUTES.LIST);
    } catch {
      toast.error('재고 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 헤더 */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to={INVENTORY_ROUTES.LIST}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">재고 추가</h1>
              <p className="text-muted-foreground text-sm">
                새로운 매장 재고를 등록합니다.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(INVENTORY_ROUTES.LIST)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                '재고 추가'
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* ─── 좌측 메인 (2/3) ─── */}
          <div className="space-y-4 lg:col-span-2">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="storeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>매장 *</FormLabel>
                      <FormControl>
                        <Combobox
                          options={storeOptions}
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(v) => field.onChange(Number(v))}
                          placeholder="매장을 선택하세요"
                          searchPlaceholder="매장 이름 검색..."
                          emptyMessage="매장을 찾을 수 없습니다."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상품 *</FormLabel>
                      <FormControl>
                        <Combobox
                          options={productOptions}
                          value={field.value ? String(field.value) : ''}
                          onValueChange={(v) => field.onChange(Number(v))}
                          placeholder="상품을 선택하세요"
                          searchPlaceholder="상품명 또는 SKU 검색..."
                          emptyMessage="상품을 찾을 수 없습니다."
                          disabled={!!defaultProductId}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        상품명 또는 SKU로 검색할 수 있습니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 재고 수량 기준 — state로 직접 관리 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isFuel ? '유류 용량 기준' : '재고 수량 기준'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isFuel ? (
                  <>
                    <div className="space-y-2">
                      <Label>초기 입고량 (L)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.1}
                        placeholder="0"
                        value={fuelValues.initialVolumeLiters}
                        onChange={(e) =>
                          setFuelValues((prev) => ({
                            ...prev,
                            initialVolumeLiters:
                              parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                      <p className="text-muted-foreground text-xs">
                        등록 시 즉시 입고할 유류량 (0이면 나중에 입고)
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {(
                        [
                          { key: 'minVolume', label: '최소 용량 (L)' },
                          { key: 'maxVolume', label: '최대 용량 (L)' },
                          { key: 'reorderVolume', label: '재주문 시점 (L)' },
                        ] as const
                      ).map(({ key, label }) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            placeholder="0"
                            value={fuelValues[key]}
                            onChange={(e) =>
                              setFuelValues((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(
                        [
                          {
                            key: 'currentStock',
                            label: '초기 재고 *',
                            desc: '등록 시 초기 보유 수량',
                          },
                          {
                            key: 'minStock',
                            label: '최소 재고',
                            desc: '이 수량 이하면 재고 부족 알림',
                          },
                        ] as const
                      ).map(({ key, label, desc }) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <Input
                            type="number"
                            min={0}
                            value={stockValues[key]}
                            onChange={(e) =>
                              setStockValues((prev) => ({
                                ...prev,
                                [key]: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                          <p className="text-muted-foreground text-xs">
                            {desc}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>최대 재고</Label>
                        <Input
                          type="number"
                          min={0}
                          value={stockValues.maxStock}
                          onChange={(e) =>
                            setStockValues((prev) => ({
                              ...prev,
                              maxStock: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>재주문 시점</Label>
                        <Input
                          type="number"
                          min={0}
                          value={stockValues.reorderPoint}
                          onChange={(e) =>
                            setStockValues((prev) => ({
                              ...prev,
                              reorderPoint: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                        <p className="text-muted-foreground text-xs">
                          이 수량 이하면 재주문 알림
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>재주문 수량</Label>
                      <Input
                        type="number"
                        min={0}
                        value={stockValues.reorderQuantity}
                        onChange={(e) =>
                          setStockValues((prev) => ({
                            ...prev,
                            reorderQuantity: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* 가격 설정 — state로 직접 관리 */}
            <Card>
              <CardHeader>
                <CardTitle>가격 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>원가</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0"
                      value={stockValues.costPrice}
                      onChange={(e) =>
                        setStockValues((prev) => ({
                          ...prev,
                          costPrice: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>매장 판매가</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0"
                      value={stockValues.storePrice}
                      onChange={(e) =>
                        setStockValues((prev) => ({
                          ...prev,
                          storePrice: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── 우측 (1/3) ─── */}
          <div className="space-y-4">
            {/* 위치 및 단위 */}
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
                      <FormLabel>보관 위치</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={
                            isFuel
                              ? '예: 주유탱크-1번, 지하탱크-A'
                              : '예: A동-1층-3번 선반'
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {isFuel
                          ? '탱크 번호 또는 보관 위치를 입력하세요.'
                          : '매장 내 보관 위치를 입력하세요.'}
                      </FormDescription>
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
                        <Input
                          {...field}
                          placeholder="EA, LITER, KG 등"
                          readOnly={isFuel}
                          className={isFuel ? 'bg-muted' : ''}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {isFuel
                          ? '유류 구역은 LITER로 자동 설정됩니다.'
                          : '예: EA(개), LITER(리터), KG(킬로그램)'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 판매 상태 */}
            <Card>
              <CardHeader>
                <CardTitle>판매 상태</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Separator />
                {(
                  [
                    {
                      name: 'isActive',
                      label: '활성화',
                      desc: '재고 활성 여부',
                    },
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
          </div>
        </div>
      </form>
    </Form>
  );
}
