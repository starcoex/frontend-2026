import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, XCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// ✅ libs/feature/common 에서 임포트
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { generateAvatarFallback } from '@/app/utils/generateAvatarFallback';
import type { AdminBulkIssueCouponOutput } from '@starcoex-frontend/loyalty';

// ── 공통 쿠폰 필드 스키마 ─────────────────────────────────────────────────────
const couponBaseSchema = {
  couponName: z.string().min(2, '쿠폰명은 최소 2자 이상이어야 합니다.'),
  couponType: z.enum(['WASH', 'DISCOUNT'], {
    message: '쿠폰 타입을 선택해주세요.',
  }),
  expiryDays: z.number().int().min(1, '1일 이상이어야 합니다.'),
  issueReason: z.string().optional(),
};

const singleSchema = z.object({ ...couponBaseSchema });
type SingleForm = z.infer<typeof singleSchema>;

const bulkSchema = z.object({
  ...couponBaseSchema,
  promotionName: z.string().min(2, '프로모션명은 최소 2자 이상이어야 합니다.'),
});
type BulkForm = z.infer<typeof bulkSchema>;

const COUPON_TYPE_OPTIONS = [
  { value: 'WASH', label: '세차권 (WASH)' },
  { value: 'DISCOUNT', label: '할인권 (DISCOUNT)' },
] as const;

// ── 쿠폰 타입 Select 공통 컴포넌트 ───────────────────────────────────────────
function CouponTypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
    >
      {COUPON_TYPE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface LoyaltyCouponManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultUserId?: number;
}

export function LoyaltyCouponManager({
  open,
  onOpenChange,
  defaultUserId,
}: LoyaltyCouponManagerProps) {
  const { adminIssueCoupon, adminBulkIssueCoupons } = useLoyalty();
  const [bulkResult, setBulkResult] =
    useState<AdminBulkIssueCouponOutput | null>(null);

  // ── 단건: 선택된 회원 1명 ────────────────────────────────────────────────────
  const [singleCustomer, setSingleCustomer] = useState<SelectedCustomer | null>(
    defaultUserId
      ? { userId: defaultUserId, name: `사용자 #${defaultUserId}`, phone: '' }
      : null
  );

  // ── 일괄: 선택된 회원 목록 ───────────────────────────────────────────────────
  const [bulkCustomers, setBulkCustomers] = useState<SelectedCustomer[]>([]);

  const addBulkCustomer = (customer: SelectedCustomer) => {
    setBulkCustomers((prev) => {
      if (prev.some((c) => c.userId === customer.userId)) {
        toast.info(`${customer.name}은(는) 이미 추가되어 있습니다.`);
        return prev;
      }
      if (prev.length >= 500) {
        toast.error('최대 500명까지 추가할 수 있습니다.');
        return prev;
      }
      return [...prev, customer];
    });
  };

  const removeBulkCustomer = (userId: number) => {
    setBulkCustomers((prev) => prev.filter((c) => c.userId !== userId));
  };

  // ── 단건 폼 ────────────────────────────────────────────────────────────────
  const singleForm = useForm<SingleForm>({
    resolver: zodResolver(singleSchema),
    defaultValues: {
      couponName: '',
      couponType: 'WASH',
      expiryDays: 30,
      issueReason: '',
    },
  });

  const handleSingleSubmit = async (data: SingleForm) => {
    if (!singleCustomer) {
      toast.error('발급 대상 회원을 선택해주세요.');
      return;
    }
    const res = await adminIssueCoupon({
      userId: singleCustomer.userId,
      couponName: data.couponName,
      couponType: data.couponType,
      expiryDays: data.expiryDays,
      issueReason: data.issueReason || undefined,
    });
    if (res.success && res.data?.success) {
      toast.success(`${singleCustomer.name}에게 쿠폰이 발급되었습니다.`, {
        description: res.data.coupon?.code
          ? `코드: ${res.data.coupon.code}`
          : undefined,
      });
      handleClose();
    } else {
      toast.error(
        res.data?.message ?? (res as any).error?.message ?? '발급 실패'
      );
    }
  };

  // ── 일괄 폼 ────────────────────────────────────────────────────────────────
  const bulkForm = useForm<BulkForm>({
    resolver: zodResolver(bulkSchema),
    defaultValues: {
      couponName: '',
      couponType: 'WASH',
      expiryDays: 30,
      promotionName: '',
      issueReason: '',
    },
  });

  const handleBulkSubmit = async (data: BulkForm) => {
    if (bulkCustomers.length === 0) {
      toast.error('발급 대상 회원을 1명 이상 선택해주세요.');
      return;
    }
    const res = await adminBulkIssueCoupons({
      userIds: bulkCustomers.map((c) => c.userId),
      couponName: data.couponName,
      couponType: data.couponType,
      expiryDays: data.expiryDays,
      promotionName: data.promotionName,
      issueReason: data.issueReason || undefined,
    });
    if (res.success && res.data) {
      setBulkResult(res.data);
      toast.success(
        `${res.data.successCount}/${res.data.totalCount}명 발급 완료`,
        {
          description:
            res.data.failCount > 0 ? `${res.data.failCount}명 실패` : undefined,
        }
      );
    } else {
      toast.error((res as any).error?.message ?? '일괄 발급 실패');
    }
  };

  const handleClose = () => {
    setBulkResult(null);
    setSingleCustomer(
      defaultUserId
        ? { userId: defaultUserId, name: `사용자 #${defaultUserId}`, phone: '' }
        : null
    );
    setBulkCustomers([]);
    singleForm.reset();
    bulkForm.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>쿠폰 발급</DialogTitle>
        </DialogHeader>

        {/* ── 일괄 결과 화면 ── */}
        {bulkResult ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">전체</p>
                <p className="text-2xl font-bold">{bulkResult.totalCount}</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                <p className="text-xs text-green-600 dark:text-green-400">
                  성공
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {bulkResult.successCount}
                </p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
                <p className="text-xs text-red-600 dark:text-red-400">실패</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {bulkResult.failCount}
                </p>
              </div>
            </div>

            {bulkResult.failCount > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-lg border">
                <div className="divide-y">
                  {bulkResult.results
                    .filter((r) => !r.success)
                    .map((r) => (
                      <div
                        key={r.userId}
                        className="flex items-center justify-between px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <XCircle className="size-4 text-red-500" />
                          <span>
                            {bulkCustomers.find((c) => c.userId === r.userId)
                              ?.name ?? `사용자 #${r.userId}`}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {r.errorMessage}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <Button className="w-full" onClick={handleClose}>
              닫기
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="single">
            <TabsList className="w-full">
              <TabsTrigger value="single" className="flex-1">
                단건 발급
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex-1">
                일괄 발급
                {bulkCustomers.length > 0 && (
                  <Badge variant="secondary" className="ml-1.5 text-xs">
                    {bulkCustomers.length}명
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── 단건 발급 탭 ── */}
            <TabsContent value="single" className="mt-4">
              <Form {...singleForm}>
                <form
                  onSubmit={singleForm.handleSubmit(handleSingleSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium">발급 대상 회원 *</p>
                    <CustomerSearch
                      selected={singleCustomer}
                      onSelect={setSingleCustomer}
                      onClear={() => setSingleCustomer(null)}
                      enableCreate={false}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={singleForm.control}
                      name="couponType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>쿠폰 타입 *</FormLabel>
                          <FormControl>
                            <CouponTypeSelect
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={singleForm.control}
                      name="expiryDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>유효기간 (일) *</FormLabel>
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

                  <FormField
                    control={singleForm.control}
                    name="couponName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>쿠폰명 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="예: 무료 프리미엄 세차권"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={singleForm.control}
                    name="issueReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>발급 사유</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="resize-none"
                            rows={2}
                            placeholder="발급 사유 (선택사항)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        singleForm.formState.isSubmitting || !singleCustomer
                      }
                    >
                      {singleForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          발급 중...
                        </>
                      ) : (
                        '쿠폰 발급'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>

            {/* ── 일괄 발급 탭 ── */}
            <TabsContent value="bulk" className="mt-4">
              <Form {...bulkForm}>
                <form
                  onSubmit={bulkForm.handleSubmit(handleBulkSubmit)}
                  className="space-y-4"
                >
                  {/* ✅ 단건과 동일한 CustomerSearch 패턴으로 다중 선택 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        발급 대상 회원 *
                        <span className="text-muted-foreground ml-1 font-normal">
                          ({bulkCustomers.length}/500명)
                        </span>
                      </p>
                      {bulkCustomers.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive h-6 text-xs"
                          onClick={() => setBulkCustomers([])}
                        >
                          전체 제거
                        </Button>
                      )}
                    </div>

                    {/* 회원 검색 — 선택하면 목록에 추가 */}
                    <CustomerSearch
                      selected={null}
                      onSelect={addBulkCustomer}
                      onClear={() => {
                        /* empty */
                      }}
                      enableCreate={false}
                    />

                    {/* 선택된 회원 태그 목록 */}
                    {bulkCustomers.length > 0 && (
                      <div className="max-h-32 overflow-y-auto rounded-lg border p-2">
                        <div className="flex flex-wrap gap-1.5">
                          {bulkCustomers.map((c) => (
                            <div
                              key={c.userId}
                              className="bg-secondary flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                            >
                              <Avatar className="size-4">
                                <AvatarFallback className="text-[8px]">
                                  {generateAvatarFallback(c.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="max-w-[80px] truncate font-medium">
                                {c.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeBulkCustomer(c.userId)}
                                className="text-muted-foreground hover:text-destructive ml-0.5"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {bulkCustomers.length === 0 && (
                      <p className="text-muted-foreground text-xs">
                        위 검색창에서 회원을 검색하여 추가하세요.
                      </p>
                    )}
                  </div>

                  <FormField
                    control={bulkForm.control}
                    name="promotionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>프로모션 이름 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="예: 2025_SPRING_EVENT"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          내부 식별용 — 영문/숫자/언더스코어 권장
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={bulkForm.control}
                      name="couponType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>쿠폰 타입 *</FormLabel>
                          <FormControl>
                            <CouponTypeSelect
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={bulkForm.control}
                      name="expiryDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>유효기간 (일) *</FormLabel>
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

                  <FormField
                    control={bulkForm.control}
                    name="couponName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>쿠폰명 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="예: 봄맞이 프로모션 세차권"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bulkForm.control}
                    name="issueReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>발급 사유</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="resize-none"
                            rows={2}
                            placeholder="발급 사유 (선택사항)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        bulkForm.formState.isSubmitting ||
                        bulkCustomers.length === 0
                      }
                    >
                      {bulkForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          발급 중...
                        </>
                      ) : (
                        `${bulkCustomers.length}명에게 일괄 발급`
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
