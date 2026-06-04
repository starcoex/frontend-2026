import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings2, FileText } from 'lucide-react';
import type { PromotionFormValues } from './promotion-form-schema';
import {
  PROMOTION_STATUS_OPTIONS,
  PROMOTION_TYPE_OPTIONS,
  DISCOUNT_TYPE_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/promotions/data/promotion-data';

interface Step4Props {
  form: UseFormReturn<PromotionFormValues>;
  usedPriorities: number[];
  // ✅ 부모에서 주입 — priority 값으로 판단하지 않음
  isEdit: boolean;
}

const formatDateTime = (iso: string) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export function PromotionCreateStep4({
  form,
  usedPriorities,
  isEdit,
}: Step4Props) {
  const priorityValue = form.watch('priority');

  const usedPrioritySet = new Set(usedPriorities);
  const nextPriority = (() => {
    let n = 0;
    while (usedPrioritySet.has(n)) n++;
    return n;
  })();

  // ✅ 수정 시 자기 자신의 priority는 중복 허용
  const isDuplicateCheckSet = isEdit
    ? new Set(
        [...usedPriorities].filter((p) => p !== form.getValues('priority'))
      )
    : usedPrioritySet;
  const isPriorityDuplicate = isDuplicateCheckSet.has(priorityValue);

  const autoApply = form.watch('autoApply');

  // 요약 표시용
  const values = form.watch();
  const typeLabel =
    PROMOTION_TYPE_OPTIONS.find((o) => o.value === values.type)?.label ??
    values.type;
  const discountLabel = (() => {
    if (values.discountType === 'PERCENTAGE') return `${values.discountValue}%`;
    if (values.discountType === 'FIXED')
      return `₩${(values.discountValue ?? 0).toLocaleString()}`;
    return (
      DISCOUNT_TYPE_OPTIONS.find((o) => o.value === values.discountType)
        ?.label ?? ''
    );
  })();

  return (
    <div className="space-y-4">
      {/* 상태 & 옵션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings2 className="size-4 opacity-60" />
            상태 및 적용 옵션
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>프로모션 상태 *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROMOTION_STATUS_OPTIONS.filter(
                      (o) => o.value !== 'ALL'
                    ).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <Label className="text-sm">활성화</Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <Label className="text-sm">고객 노출</Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stackable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <Label className="text-sm">중복 적용</Label>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* 자동 적용 */}
          <FormField
            control={form.control}
            name="autoApply"
            render={({ field }) => (
              <FormItem className="flex items-start justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <Label>자동 적용</Label>
                  <p className="text-muted-foreground text-xs">
                    조건 충족 시 자동으로 적용됩니다.
                  </p>
                  {field.value && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      ⚠️ 자동 적용 시 프로모션 코드가 생성되지 않습니다.
                    </p>
                  )}
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

          {/* 우선순위 */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>우선순위</FormLabel>
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
                  사용 중:{' '}
                  {usedPriorities.length > 0
                    ? [...usedPrioritySet].sort((a, b) => a - b).join(', ')
                    : '없음'}
                  {' · '}제안: <strong>{nextPriority}</strong>
                  {' · '}높을수록 먼저 적용됩니다.
                </FormDescription>
                {isPriorityDuplicate && (
                  <p className="text-destructive text-xs">
                    이미 사용 중인 우선순위입니다.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* 적용 범위 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">적용 범위</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {(
            [
              { name: 'appliesToAllStores', label: '전체 매장' },
              { name: 'appliesToAllProducts', label: '전체 상품' },
              { name: 'appliesToAllCategories', label: '전체 카테고리' },
            ] as const
          ).map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <Label className="text-sm">{label}</Label>
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

      {/* 최종 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-4 opacity-60" />
            최종 확인
          </CardTitle>
          <CardDescription>저장 전 내용을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">프로모션명</dt>
              <dd className="font-medium">{values.name || '-'}</dd>
            </div>
            <Separator />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">타입</dt>
              <dd className="font-medium">{typeLabel}</dd>
            </div>
            <Separator />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">할인</dt>
              <dd className="font-medium">{discountLabel}</dd>
            </div>
            <Separator />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">기간</dt>
              <dd className="font-medium text-right">
                {formatDateTime(values.startDate)}
                <br />
                <span className="text-muted-foreground">~</span>{' '}
                {formatDateTime(values.endDate)}
              </dd>
            </div>
            <Separator />
            <div className="flex justify-between">
              <dt className="text-muted-foreground">자동 적용</dt>
              <dd className="font-medium">{autoApply ? '예' : '아니오'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
