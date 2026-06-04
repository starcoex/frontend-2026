import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { generateAvatarFallback } from '@/app/utils/generateAvatarFallback';
import type {
  User,
  AdminTierChangeReason,
  MembershipTier,
} from '@starcoex-frontend/graphql';

// ───────────────────────────────────────────────────────────────────────────────

const TIER_OPTIONS: { value: MembershipTier; label: string }[] = [
  { value: 'WELCOME', label: 'WELCOME' },
  { value: 'SHINE', label: 'SHINE' },
  { value: 'STAR', label: 'STAR' },
];

const TIER_CHANGE_REASON_OPTIONS: {
  value: AdminTierChangeReason;
  label: string;
}[] = [
  { value: 'MANUAL_ADJUSTMENT', label: '관리자 수동 조정' },
  { value: 'CUSTOMER_SERVICE', label: '고객 서비스 처리' },
  { value: 'PROMOTION', label: '프로모션' },
  { value: 'ERROR_CORRECTION', label: '오류 정정' },
  { value: 'POLICY_CHANGE', label: '정책 변경' },
];

// ── 등급 변경 스키마 ──────────────────────────────────────────────────────────
const tierSchema = z.object({
  newTier: z.enum(['WELCOME', 'SHINE', 'STAR'], {
    message: '등급을 선택해주세요.',
  }),
  reason: z.enum(
    [
      'MANUAL_ADJUSTMENT',
      'CUSTOMER_SERVICE',
      'PROMOTION',
      'ERROR_CORRECTION',
      'POLICY_CHANGE',
    ],
    { message: '변경 사유를 선택해주세요.' }
  ),
  adminNote: z.string().optional(),
  sendNotification: z.boolean(),
});

type TierForm = z.infer<typeof tierSchema>;

// ── 별 조정 스키마 ────────────────────────────────────────────────────────────
const starsSchema = z.object({
  amount: z
    .number({ message: '별 수량을 입력해주세요.' })
    .int('정수만 입력 가능합니다.')
    .refine((v) => v !== 0, '0은 입력할 수 없습니다.'),
  reason: z.string().min(2, '사유는 최소 2자 이상이어야 합니다.'),
  sendNotification: z.boolean(),
});

type StarsForm = z.infer<typeof starsSchema>;

// ── 초기화 스키마 ─────────────────────────────────────────────────────────────
const resetSchema = z.object({
  reason: z.string().min(2, '사유는 최소 2자 이상이어야 합니다.'),
  sendNotification: z.boolean(),
});

type ResetForm = z.infer<typeof resetSchema>;

// ───────────────────────────────────────────────────────────────────────────────

interface LoyaltyTierManagerProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoyaltyTierManager({
  user,
  open,
  onOpenChange,
}: LoyaltyTierManagerProps) {
  const {
    adminAdjustUserTier,
    adminAdjustUserStars,
    adminResetUserMembership,
  } = useLoyalty();
  const [activeTab, setActiveTab] = useState<'tier' | 'stars' | 'reset'>(
    'tier'
  );

  const currentTier = user.membership?.currentTier ?? 'WELCOME';
  const availableStars = user.membership?.availableStars ?? 0;

  // ── 등급 변경 폼 ────────────────────────────────────────────────────────────
  const tierForm = useForm<TierForm>({
    resolver: zodResolver(tierSchema),
    defaultValues: {
      newTier: currentTier as MembershipTier,
      reason: 'MANUAL_ADJUSTMENT',
      adminNote: '',
      sendNotification: true,
    },
  });

  const handleTierSubmit = async (data: TierForm) => {
    const res = await adminAdjustUserTier({
      userId: user.id,
      newTier: data.newTier as MembershipTier,
      reason: data.reason as AdminTierChangeReason,
      adminNote: data.adminNote || undefined,
      sendNotification: data.sendNotification,
    });
    if (res.success) {
      toast.success(
        `${user.name ?? user.email}의 등급이 ${
          data.newTier
        }(으)로 변경되었습니다.`
      );
      onOpenChange(false);
    } else {
      toast.error((res as any).error?.message ?? '등급 변경에 실패했습니다.');
    }
  };

  // ── 별 조정 폼 ──────────────────────────────────────────────────────────────
  const starsForm = useForm<StarsForm>({
    resolver: zodResolver(starsSchema),
    defaultValues: {
      amount: 0,
      reason: '',
      sendNotification: true,
    },
  });

  const handleStarsSubmit = async (data: StarsForm) => {
    const res = await adminAdjustUserStars({
      userId: user.id,
      amount: data.amount,
      reason: data.reason,
      sendNotification: data.sendNotification,
    });
    if (res.success) {
      const action = data.amount > 0 ? '적립' : '차감';
      toast.success(
        `${Math.abs(data.amount)}개 별이 ${action}되었습니다. 현재: ${
          res.data?.currentStars ?? 0
        }개`
      );
      starsForm.reset({ amount: 0, reason: '', sendNotification: true });
      onOpenChange(false);
    } else {
      toast.error((res as any).error?.message ?? '별 조정에 실패했습니다.');
    }
  };

  // ── 멤버십 초기화 폼 ────────────────────────────────────────────────────────
  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      reason: '',
      sendNotification: false,
    },
  });

  const handleResetSubmit = async (data: ResetForm) => {
    const res = await adminResetUserMembership({
      userId: user.id,
      reason: data.reason,
      sendNotification: data.sendNotification,
    });
    if (res.success) {
      toast.success('멤버십이 WELCOME 등급으로 초기화되었습니다.');
      onOpenChange(false);
    } else {
      toast.error((res as any).error?.message ?? '초기화에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>회원 등급 관리</DialogTitle>
        </DialogHeader>

        {/* 회원 정보 요약 */}
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Avatar className="size-10">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback>
              {generateAvatarFallback(user.name ?? '')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name ?? '-'}</p>
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={
                currentTier === 'STAR'
                  ? 'default'
                  : currentTier === 'SHINE'
                  ? 'secondary'
                  : 'outline'
              }
            >
              {currentTier}
            </Badge>
            <span className="text-muted-foreground text-xs">
              ⭐ {availableStars.toLocaleString()}개
            </span>
          </div>
        </div>

        <Separator />

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full">
            <TabsTrigger value="tier" className="flex-1">
              등급 변경
            </TabsTrigger>
            <TabsTrigger value="stars" className="flex-1">
              별 조정
            </TabsTrigger>
            <TabsTrigger value="reset" className="flex-1">
              초기화
            </TabsTrigger>
          </TabsList>

          {/* ── 등급 변경 탭 ────────────────────────────────────────────────── */}
          <TabsContent value="tier" className="mt-4">
            <Form {...tierForm}>
              <form
                onSubmit={tierForm.handleSubmit(handleTierSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={tierForm.control}
                  name="newTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>변경할 등급 *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="등급 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIER_OPTIONS.map((opt) => (
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

                <FormField
                  control={tierForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>변경 사유 *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="사유 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIER_CHANGE_REASON_OPTIONS.map((opt) => (
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

                <FormField
                  control={tierForm.control}
                  name="adminNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>관리자 메모</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          rows={2}
                          placeholder="내부 메모 (선택사항)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={tierForm.control}
                  name="sendNotification"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <FormLabel>알림 발송</FormLabel>
                        <FormDescription className="text-xs">
                          등급 변경 알림을 회원에게 발송합니다.
                        </FormDescription>
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

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={tierForm.formState.isSubmitting}
                  >
                    {tierForm.formState.isSubmitting
                      ? '변경 중...'
                      : '등급 변경'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* ── 별 조정 탭 ──────────────────────────────────────────────────── */}
          <TabsContent value="stars" className="mt-4">
            <Form {...starsForm}>
              <form
                onSubmit={starsForm.handleSubmit(handleStarsSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={starsForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>별 수량 *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          placeholder="양수: 적립 / 음수: 차감"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        현재 보유:{' '}
                        <strong>{availableStars.toLocaleString()}개</strong>
                        {field.value !== 0 && (
                          <span className="ml-2">
                            → 조정 후:{' '}
                            <strong>
                              {Math.max(
                                0,
                                availableStars + (field.value || 0)
                              ).toLocaleString()}
                              개
                            </strong>
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={starsForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>조정 사유 *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          rows={2}
                          placeholder="별 적립/차감 사유를 입력하세요"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={starsForm.control}
                  name="sendNotification"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <FormLabel>알림 발송</FormLabel>
                        <FormDescription className="text-xs">
                          별 조정 알림을 회원에게 발송합니다.
                        </FormDescription>
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

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    disabled={starsForm.formState.isSubmitting}
                  >
                    {starsForm.formState.isSubmitting
                      ? '처리 중...'
                      : '별 조정'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* ── 초기화 탭 ───────────────────────────────────────────────────── */}
          <TabsContent value="reset" className="mt-4">
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <p className="text-destructive font-medium">⚠️ 주의</p>
              <p className="text-muted-foreground mt-1 text-xs">
                멤버십을 초기화하면 등급이 WELCOME으로 리셋됩니다. 이 작업은
                되돌릴 수 없습니다.
              </p>
            </div>

            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(handleResetSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={resetForm.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>초기화 사유 *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none"
                          rows={2}
                          placeholder="초기화 사유를 입력하세요"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={resetForm.control}
                  name="sendNotification"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <FormLabel>알림 발송</FormLabel>
                        <FormDescription className="text-xs">
                          초기화 알림을 회원에게 발송합니다.
                        </FormDescription>
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

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={resetForm.formState.isSubmitting}
                  >
                    {resetForm.formState.isSubmitting
                      ? '초기화 중...'
                      : '멤버십 초기화'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
