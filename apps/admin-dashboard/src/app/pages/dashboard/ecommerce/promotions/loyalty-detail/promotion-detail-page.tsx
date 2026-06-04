import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  Pencil,
  PlayCircle,
  PauseCircle,
  Tag,
  Users,
  BarChart3,
  Clock,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { usePromotions } from '@starcoex-frontend/promotions';
import type {
  Promotion,
  PromotionRule,
  PromotionStatus,
} from '@starcoex-frontend/promotions';
import {
  DISCOUNT_TYPE_OPTIONS,
  PROMOTION_TYPE_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/promotions/data/promotion-data';

// ── 상태 설정 ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  PromotionStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  DRAFT: { label: '초안', variant: 'outline' },
  PENDING_APPROVAL: { label: '승인 대기', variant: 'secondary' },
  APPROVED: { label: '승인됨', variant: 'secondary' },
  ACTIVE: { label: '활성', variant: 'default' },
  PAUSED: { label: '일시 정지', variant: 'secondary' },
  ENDED: { label: '종료됨', variant: 'outline' },
  CANCELLED: { label: '취소됨', variant: 'destructive' },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const getTypeLabel = (type: string) =>
  PROMOTION_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;

const getDiscountLabel = (type: string, value: number) => {
  if (type === 'PERCENTAGE') return `${value}%`;
  if (type === 'FIXED') return `₩${value.toLocaleString()}`;
  return DISCOUNT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
};

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export default function PromotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    fetchPromotionById,
    changePromotionStatus,
    deletePromotion,
    isLoading,
    error,
  } = usePromotions();

  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusDialogTarget, setStatusDialogTarget] =
    useState<PromotionStatus | null>(null);
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPromotionById(parseInt(id)).then((res) => {
      if (res.success && res.data) setPromotion(res.data);
    });
  }, [id]);

  // ── 상태 변경 ───────────────────────────────────────────────────────────────
  const handleStatusChange = async () => {
    if (!promotion || !statusDialogTarget) return;
    setIsStatusChanging(true);
    const res = await changePromotionStatus({
      id: promotion.id,
      status: statusDialogTarget,
    });
    setIsStatusChanging(false);
    setStatusDialogTarget(null);

    if (res.success && res.data?.promotion) {
      setPromotion(res.data.promotion);
      toast.success(
        `프로모션이 ${STATUS_CONFIG[statusDialogTarget].label} 상태로 변경되었습니다.`
      );
    } else {
      toast.error((res as any).error?.message ?? '상태 변경에 실패했습니다.');
    }
  };

  // ── 삭제 ────────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!promotion) return;
    setIsDeleting(true);
    const res = await deletePromotion({ id: promotion.id, hardDelete: false });
    setIsDeleting(false);
    setDeleteDialogOpen(false);

    if (res.success) {
      toast.success('프로모션이 삭제되었습니다.');
      navigate('/admin/promotions');
    } else {
      toast.error((res as any).error?.message ?? '삭제에 실패했습니다.');
    }
  };

  // ── 로딩 / 에러 ─────────────────────────────────────────────────────────────
  if (isLoading && !promotion) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            프로모션 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '프로모션을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/promotions')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // ── 파생 값 ─────────────────────────────────────────────────────────────────
  const statusConfig = STATUS_CONFIG[promotion.status];
  const canActivate =
    promotion.status === 'PAUSED' || promotion.status === 'APPROVED';
  const canPause = promotion.status === 'ACTIVE';
  const usageRate =
    promotion.totalLimit && promotion.totalLimit > 0
      ? Math.min((promotion.currentUsage / promotion.totalLimit) * 100, 100)
      : null;

  const statItems = [
    {
      label: '현재 사용 횟수',
      value: promotion.currentUsage,
      icon: BarChart3,
      suffix: '회',
    },
    {
      label: '총 사용 제한',
      value: promotion.totalLimit ?? '무제한',
      icon: Users,
      suffix: promotion.totalLimit ? '회' : '',
    },
    {
      label: '사용자당 제한',
      value: promotion.perUserLimit,
      icon: Tag,
      suffix: '회',
    },
    {
      label: '우선순위',
      value: promotion.priority,
      icon: Layers,
      suffix: '',
    },
  ];

  return (
    <>
      <PageHead
        title={`${promotion.name} - ${COMPANY_INFO.name}`}
        description="프로모션 상세 정보"
        keywords={['프로모션', promotion.name, COMPANY_INFO.name]}
        og={{
          title: `${promotion.name} - ${COMPANY_INFO.name}`,
          description: '프로모션 상세 정보',
          type: 'website',
        }}
      />

      <div className="space-y-6">
        {/* ── 헤더 ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold">{promotion.name}</h1>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              {promotion.autoApply && (
                <Badge variant="outline">자동 적용</Badge>
              )}
              {promotion.stackable && (
                <Badge variant="outline">중복 적용 가능</Badge>
              )}
            </div>
            {promotion.code && (
              <p className="text-muted-foreground font-mono text-sm">
                코드: {promotion.code}
              </p>
            )}
            {promotion.description && (
              <p className="text-muted-foreground text-sm">
                {promotion.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {canActivate && (
              <Button
                variant="outline"
                onClick={() => setStatusDialogTarget('ACTIVE')}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                활성화
              </Button>
            )}
            {canPause && (
              <Button
                variant="outline"
                onClick={() => setStatusDialogTarget('PAUSED')}
              >
                <PauseCircle className="mr-2 h-4 w-4" />
                일시 정지
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/promotions/${promotion.id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              수정
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              삭제
            </Button>
          </div>
        </div>

        {/* ── 스탯 카드 ──────────────────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statItems.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription className="flex items-center gap-1.5">
                  <stat.icon className="size-4 opacity-60" />
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-2xl">
                  {typeof stat.value === 'number'
                    ? stat.value.toLocaleString()
                    : stat.value}
                  {stat.suffix && (
                    <span className="text-muted-foreground ml-1 text-sm font-normal">
                      {stat.suffix}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* ── 탭 ─────────────────────────────────────────────────────────────── */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">기본 정보</TabsTrigger>
            <TabsTrigger value="rules">
              프로모션 규칙
              {promotion.rules.length > 0 && (
                <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                  {promotion.rules.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="usage">
              사용 이력
              {promotion.usages.length > 0 && (
                <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                  {promotion.usages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── 기본 정보 탭 ─────────────────────────────────────────────────── */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* 할인 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">할인 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">프로모션 타입</span>
                    <span className="font-medium">
                      {getTypeLabel(promotion.type)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">할인</span>
                    <span className="font-medium">
                      {getDiscountLabel(
                        promotion.discountType,
                        promotion.discountValue
                      )}
                    </span>
                  </div>
                  {promotion.maxDiscount != null && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          최대 할인 금액
                        </span>
                        <span className="font-medium">
                          ₩{promotion.maxDiscount.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                  {promotion.minOrderAmount != null && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          최소 주문 금액
                        </span>
                        <span className="font-medium">
                          ₩{promotion.minOrderAmount.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 적용 기간 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">적용 기간</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">시작</span>
                    <span className="font-medium">
                      {formatDate(promotion.startDate)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">종료</span>
                    <span className="font-medium">
                      {formatDate(promotion.endDate)}
                    </span>
                  </div>
                  {promotion.dailyLimit != null && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">일일 제한</span>
                        <span className="font-medium">
                          {promotion.dailyLimit.toLocaleString()}회
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 사용 현황 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">사용 현황</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">사용 횟수</span>
                    <span className="font-medium">
                      {promotion.currentUsage.toLocaleString()}
                      {promotion.totalLimit
                        ? ` / ${promotion.totalLimit.toLocaleString()}`
                        : ''}
                    </span>
                  </div>
                  {usageRate !== null && (
                    <>
                      <div className="bg-secondary h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${usageRate}%` }}
                        />
                      </div>
                      <p className="text-muted-foreground text-xs text-right">
                        {Math.round(usageRate)}%
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 적용 범위 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">적용 범위</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">매장</span>
                    <span className="font-medium">
                      {promotion.appliesToAllStores
                        ? '전체 매장'
                        : `${promotion.applicableStoreIds.length}개 매장`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">상품</span>
                    <span className="font-medium">
                      {promotion.appliesToAllProducts
                        ? '전체 상품'
                        : `${promotion.applicableProductIds.length}개 상품`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">카테고리</span>
                    <span className="font-medium">
                      {promotion.appliesToAllCategories
                        ? '전체 카테고리'
                        : `${promotion.applicableCategoryIds.length}개 카테고리`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">대상 고객</span>
                    <span className="font-medium">
                      {promotion.targetCustomers}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* 마케팅 메시지 */}
              {promotion.marketingMessage && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">마케팅 메시지</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{promotion.marketingMessage}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ── 프로모션 규칙 탭 ─────────────────────────────────────────────── */}
          <TabsContent value="rules" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">프로모션 규칙</CardTitle>
                <CardDescription>
                  총 {promotion.rules.length}개 규칙
                </CardDescription>
              </CardHeader>
              <CardContent>
                {promotion.rules.length === 0 ? (
                  <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
                    등록된 규칙이 없습니다.
                  </div>
                ) : (
                  <div className="divide-y">
                    {promotion.rules.map((rule: PromotionRule) => (
                      <div key={rule.id} className="py-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{rule.name}</p>
                            <Badge
                              variant={rule.isActive ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {rule.isActive ? '활성' : '비활성'}
                            </Badge>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            우선순위 {rule.priority}
                          </span>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2">
                          <div className="bg-muted rounded-md p-3">
                            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                              조건 (Condition)
                            </p>
                            <pre className="text-xs overflow-auto whitespace-pre-wrap break-all">
                              {JSON.stringify(rule.condition, null, 2)}
                            </pre>
                          </div>
                          <div className="bg-muted rounded-md p-3">
                            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                              액션 (Action)
                            </p>
                            <pre className="text-xs overflow-auto whitespace-pre-wrap break-all">
                              {JSON.stringify(rule.action, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── 사용 이력 탭 ─────────────────────────────────────────────────── */}
          <TabsContent value="usage" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">사용 이력</CardTitle>
                <CardDescription>
                  최근 {promotion.usages.length}건 표시
                </CardDescription>
              </CardHeader>
              <CardContent>
                {promotion.usages.length === 0 ? (
                  <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
                    사용 이력이 없습니다.
                  </div>
                ) : (
                  <div className="divide-y">
                    {promotion.usages.map((usage) => {
                      const isRefunded =
                        usage.status === 'REFUNDED' ||
                        usage.status === 'CANCELLED';
                      return (
                        <div
                          key={usage.id}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-8 items-center justify-center rounded-full ${
                                isRefunded
                                  ? 'bg-red-100 dark:bg-red-900'
                                  : 'bg-green-100 dark:bg-green-900'
                              }`}
                            >
                              <Clock
                                className={`size-4 ${
                                  isRefunded
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {usage.userId
                                  ? `사용자 #${usage.userId}`
                                  : usage.guestEmail ?? '비회원'}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                주문 #{usage.orderId} ·{' '}
                                {formatDate(usage.usedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                              -₩{usage.discountAmount.toLocaleString()}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {usage.finalAmount.toLocaleString()}원 결제
                            </p>
                            <Badge
                              variant={isRefunded ? 'destructive' : 'outline'}
                              className="mt-0.5 text-xs"
                            >
                              {usage.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── 상태 변경 확인 다이얼로그 ────────────────────────────────────────── */}
      <AlertDialog
        open={!!statusDialogTarget}
        onOpenChange={(open) => !open && setStatusDialogTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로모션 상태 변경</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{promotion.name}</span> 프로모션을{' '}
              <span className="font-semibold">
                {statusDialogTarget
                  ? STATUS_CONFIG[statusDialogTarget].label
                  : ''}
              </span>{' '}
              상태로 변경합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusChange}
              disabled={isStatusChanging}
            >
              {isStatusChanging ? '변경 중...' : '변경'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── 삭제 확인 다이얼로그 ─────────────────────────────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로모션 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{promotion.name}</span> 프로모션을
              삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
