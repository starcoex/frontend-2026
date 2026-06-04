import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  Settings2,
  Star,
  Crown,
  Award,
  TrendingUp,
  TrendingDown,
  TicketX,
  TicketCheck,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { useAuth } from '@starcoex-frontend/auth';
import { generateAvatarFallback } from '@/app/utils/generateAvatarFallback';
import type {
  AdminMembershipDetailOutput,
  AdminStarHistoryOutput,
  AdminCouponListOutput,
  StarHistory,
  RewardCoupon,
} from '@starcoex-frontend/loyalty';
import { LoyaltyTierManager } from '@/app/pages/dashboard/ecommerce/loyalty/components/loyalty-tier-manager';

export default function LoyaltyMemberDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getUserById, currentUser, isLoading, error } = useAuth();
  const {
    adminGetUserMembership,
    adminGetUserStarHistory,
    adminGetUserCoupons,
    adminRevokeCoupon,
  } = useLoyalty();

  const [membershipDetail, setMembershipDetail] =
    useState<AdminMembershipDetailOutput | null>(null);
  const [starHistory, setStarHistory] = useState<AdminStarHistoryOutput | null>(
    null
  );
  const [couponList, setCouponList] = useState<AdminCouponListOutput | null>(
    null
  );
  const [tierManagerOpen, setTierManagerOpen] = useState(false);
  const [revokingCode, setRevokingCode] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const id = parseInt(userId);

    getUserById(id);

    adminGetUserMembership(id).then((res) => {
      if (res.success) setMembershipDetail(res.data ?? null);
    });

    adminGetUserStarHistory({ userId: id, limit: 50, offset: 0 }).then(
      (res) => {
        if (res.success) setStarHistory(res.data ?? null);
      }
    );

    adminGetUserCoupons({ userId: id, limit: 50, offset: 0 }).then((res) => {
      if (res.success) setCouponList(res.data ?? null);
    });
  }, [userId]);

  const handleRevoke = async () => {
    if (!revokingCode) return;
    setIsRevoking(true);
    const res = await adminRevokeCoupon({
      couponCode: revokingCode,
      reason: '관리자 강제 취소',
    });
    setIsRevoking(false);
    setRevokingCode(null);

    if (res.success) {
      toast.success('쿠폰이 취소되었습니다.');
      // 쿠폰 목록 갱신
      if (userId) {
        adminGetUserCoupons({
          userId: parseInt(userId),
          limit: 50,
          offset: 0,
        }).then((r) => {
          if (r.success) setCouponList(r.data ?? null);
        });
      }
    } else {
      toast.error((res as any).error?.message ?? '쿠폰 취소에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            회원 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '회원을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/loyalty')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const membership = currentUser.membership;
  const tier = membership?.currentTier ?? 'WELCOME';

  const statItems = [
    {
      label: '보유 별',
      value: membership?.availableStars ?? 0,
      icon: Star,
      suffix: '개',
    },
    {
      label: '쿠폰 교환 가능',
      value: membership?.exchangeableCoupons ?? 0,
      icon: Award,
      suffix: '개',
    },
    {
      label: '총 활동',
      value: membershipDetail?.totalActivities ?? '-',
      icon: Crown,
      suffix: '건',
    },
    {
      label: '보유 쿠폰',
      value: membershipDetail?.totalCoupons ?? '-',
      icon: Award,
      suffix: '개',
    },
  ];

  const TIER_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
    STAR: 'default',
    SHINE: 'secondary',
    WELCOME: 'outline',
  };

  const COUPON_STATUS_CONFIG: Record<
    string,
    { label: string; variant: 'success' | 'destructive' | 'secondary' }
  > = {
    ACTIVE: { label: '사용 가능', variant: 'success' },
    USED: { label: '사용됨', variant: 'secondary' },
    EXPIRED: { label: '만료됨', variant: 'destructive' },
  };

  return (
    <>
      <PageHead
        title={`${currentUser.name ?? currentUser.email} 등급 관리 - ${
          COMPANY_INFO.name
        }`}
        description="회원 멤버십 등급 상세 정보"
        keywords={['회원 등급', currentUser.email, COMPANY_INFO.name]}
        og={{ title: `회원 등급 관리 - ${COMPANY_INFO.name}`, type: 'website' }}
      />

      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={currentUser.avatarUrl ?? undefined} />
              <AvatarFallback>
                {generateAvatarFallback(currentUser.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{currentUser.name ?? '-'}</h1>
              <p className="text-muted-foreground text-sm">
                {currentUser.email}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={TIER_VARIANT[tier]}>{tier}</Badge>
                {membership?.currentTierDisplayName && (
                  <span className="text-muted-foreground text-xs">
                    {membership.currentTierDisplayName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button onClick={() => setTierManagerOpen(true)}>
            <Settings2 className="mr-2 h-4 w-4" />
            등급 / 별 관리
          </Button>
        </div>

        {/* 스탯 카드 */}
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
                  <span className="text-muted-foreground ml-1 text-sm font-normal">
                    {stat.suffix}
                  </span>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* 탭 */}
        <Tabs defaultValue="membership">
          <TabsList>
            <TabsTrigger value="membership">멤버십 현황</TabsTrigger>
            <TabsTrigger value="stars">
              별 히스토리
              {starHistory && (
                <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                  {starHistory.totalCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="coupons">
              쿠폰 목록
              {couponList && (
                <span className="bg-primary text-primary-foreground ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                  {couponList.totalCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* 멤버십 현황 탭 */}
          <TabsContent value="membership" className="mt-4">
            {membership && (
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">쿠폰 진행률</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        다음 쿠폰까지
                      </span>
                      <span className="font-medium">
                        {membership.starsToNextCoupon.toLocaleString()}별 필요
                      </span>
                    </div>
                    <div className="bg-secondary h-2 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(membership.couponProgress, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs text-right">
                      {Math.round(membership.couponProgress)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">등급 진행률</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {membership.nextTierName
                          ? `${membership.nextTierName} 등급까지`
                          : '최고 등급 달성'}
                      </span>
                      {membership.starsToNextTier != null && (
                        <span className="font-medium">
                          {membership.starsToNextTier.toLocaleString()}별 필요
                        </span>
                      )}
                    </div>
                    <div className="bg-secondary h-2 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${Math.min(membership.tierProgress, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-muted-foreground text-xs text-right">
                      {Math.round(membership.tierProgress)}%
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* 별 히스토리 탭 */}
          <TabsContent value="stars" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">별 적립/사용 내역</CardTitle>
                <CardDescription>
                  최근 {starHistory?.histories.length ?? 0}건 표시
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!starHistory || starHistory.histories.length === 0 ? (
                  <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
                    별 내역이 없습니다.
                  </div>
                ) : (
                  <div className="divide-y">
                    {starHistory.histories.map((history: StarHistory) => {
                      const isPositive = history.amount > 0;
                      return (
                        <div
                          key={history.id}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-8 items-center justify-center rounded-full ${
                                isPositive
                                  ? 'bg-green-100 dark:bg-green-900'
                                  : 'bg-red-100 dark:bg-red-900'
                              }`}
                            >
                              {isPositive ? (
                                <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {history.reason}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {history.category && (
                                  <span className="mr-2">
                                    {history.category}
                                  </span>
                                )}
                                {new Date(history.createdAt).toLocaleDateString(
                                  'ko-KR'
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-semibold ${
                                isPositive
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {history.amount.toLocaleString()}별
                            </p>
                            {history.referenceId && (
                              <p className="text-muted-foreground font-mono text-xs">
                                #{history.referenceId}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 쿠폰 목록 탭 */}
          <TabsContent value="coupons" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">보유 쿠폰 목록</CardTitle>
                <CardDescription>
                  총 {couponList?.totalCount ?? 0}개
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!couponList || couponList.coupons.length === 0 ? (
                  <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
                    보유한 쿠폰이 없습니다.
                  </div>
                ) : (
                  <div className="divide-y">
                    {couponList.coupons.map((coupon: RewardCoupon) => {
                      const statusConfig = COUPON_STATUS_CONFIG[
                        coupon.status
                      ] ?? {
                        label: coupon.status,
                        variant: 'outline' as const,
                      };
                      return (
                        <div
                          key={coupon.id}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                              {coupon.status === 'ACTIVE' ? (
                                <TicketCheck className="size-4 text-green-600" />
                              ) : (
                                <TicketX className="size-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {coupon.name}
                              </p>
                              <p className="text-muted-foreground font-mono text-xs">
                                {coupon.code}
                                {coupon.issueType && (
                                  <span className="ml-2 not-font-mono normal-case">
                                    ({coupon.issueType})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <Badge variant={statusConfig.variant}>
                                {statusConfig.label}
                              </Badge>
                              <p className="text-muted-foreground mt-0.5 text-xs">
                                ~
                                {new Date(coupon.expiresAt).toLocaleDateString(
                                  'ko-KR'
                                )}
                              </p>
                            </div>
                            {coupon.status === 'ACTIVE' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive size-7"
                                onClick={() => setRevokingCode(coupon.code)}
                                title="쿠폰 취소"
                              >
                                <TicketX className="size-3.5" />
                              </Button>
                            )}
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

      {/* 등급/별 관리 다이얼로그 */}
      {currentUser && (
        <LoyaltyTierManager
          user={currentUser}
          open={tierManagerOpen}
          onOpenChange={setTierManagerOpen}
        />
      )}

      {/* 쿠폰 취소 확인 다이얼로그 */}
      <AlertDialog
        open={!!revokingCode}
        onOpenChange={(open) => !open && setRevokingCode(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>쿠폰 강제 취소</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-mono font-semibold">{revokingCode}</span>{' '}
              쿠폰을 강제 취소(EXPIRED 처리)합니다. 이 작업은 되돌릴 수
              없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>닫기</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRevoke}
              disabled={isRevoking}
            >
              {isRevoking ? '취소 중...' : '쿠폰 취소'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
