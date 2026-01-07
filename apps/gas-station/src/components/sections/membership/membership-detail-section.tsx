import { useState, useEffect } from 'react';
import {
  Star,
  Zap,
  Gift,
  Car,
  Crown,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Loader2,
  Ticket,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { useAuth } from '@starcoex-frontend/auth';
import { Link, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

// ============================================================================
// 별 적립 방법 데이터 생성 함수
// ============================================================================
const createEarnMethods = (earningRates?: {
  GAS: number;
  OIL: number;
  CAR_CARE: number;
}) => [
  {
    title: '주유 결제',
    desc: '결제 금액 1만원당',
    point: `${earningRates?.GAS ?? 1} Star`,
    icon: Zap,
  },
  {
    title: '프리미엄 세차',
    desc: '세차/광택 이용 시 (2배 적립)',
    point: `${earningRates?.CAR_CARE ?? 2} Stars`,
    icon: Car,
  },
  {
    title: '친구 초대',
    desc: '친구 가입 시마다',
    point: '10 Stars',
    icon: Gift,
  },
  {
    title: '리뷰 작성',
    desc: '포토 리뷰 작성 시',
    point: '5 Stars',
    icon: Star,
  },
];

// ============================================================================
// 등급별 혜택 데이터 생성 함수
// ============================================================================
const createTierBenefits = (thresholds?: { SHINE: number; STAR: number }) => [
  {
    value: 'welcome',
    title: 'WELCOME',
    sub: '누구나 가입 즉시 적용',
    badge: '조건 없음',
    benefits: [
      {
        title: '리터당 10원 상시 할인',
        desc: '실적 조건 없이 무제한 적용',
      },
      {
        title: '웰컴 쿠폰팩 증정',
        desc: '무료 세차권 1매 + 생일 축하 쿠폰',
      },
    ],
  },
  {
    value: 'shine',
    title: 'SHINE',
    sub: '합리적인 드라이버의 선택',
    badge: `Star ${thresholds?.SHINE ?? 50} 이상`,
    benefits: [
      {
        title: '리터당 50원 파격 할인',
        desc: 'WELCOME 등급 대비 5배 혜택',
      },
      {
        title: '정기 무료 세차',
        desc: '별 12개 적립 시마다 무료 세차권 자동 발급',
      },
    ],
  },
  {
    value: 'star',
    title: 'STAR (VIP)',
    sub: '최고의 품격을 누리는 오너',
    badge: `Star ${thresholds?.STAR ?? 200} 이상`,
    benefits: [
      {
        title: '리터당 100원 할인',
        desc: '업계 최고 수준의 유류비 절감 혜택',
      },
      {
        title: '프리미엄 발렛 & 케어',
        desc: '주유 발렛 무료 + 연 1회 광택/코팅 서비스',
      },
      {
        title: '세차장 우선 진입 (Priority Lane)',
        desc: '대기 시간 없는 전용 레인 이용 권한',
      },
    ],
  },
];

// ============================================================================
// 탭 데이터 생성 함수
// ============================================================================
const createTabItems = (thresholds?: { SHINE: number; STAR: number }) => [
  { value: 'welcome', label: 'WELCOME', sub: '가입 즉시' },
  { value: 'shine', label: 'SHINE', sub: `Star ${thresholds?.SHINE ?? 50}+` },
  { value: 'star', label: 'STAR', sub: `Star ${thresholds?.STAR ?? 200}+` },
];

// ============================================================================
// 메인 컴포넌트
// ============================================================================
export const MembershipDetailSection = () => {
  const location = useLocation();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('welcome');

  // location.state로 전달된 탭 선택
  useEffect(() => {
    const state = location.state as { selectedTier?: string } | null;

    if (state?.selectedTier) {
      setSelectedTab(state.selectedTier);

      // 최상단에서 시작 후 섹션으로 스크롤
      window.scrollTo({ top: 0, behavior: 'instant' });

      const timeoutId = setTimeout(() => {
        const section = document.getElementById('tier-benefits-section');
        if (section) {
          const headerOffset = 100;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 100);

      // state 초기화 (뒤로가기 시 중복 실행 방지)
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [location.state]);

  // 훅에서 데이터 가져오기
  const {
    // 설정 (비로그인 가능)
    config,
    configLoading,
    fetchMembershipConfig,
    // 멤버십 (로그인 필요)
    membership,
    coupons,
    isLoading: isLoyaltyLoading,
    // 서버 계산 필드
    starsToNextCoupon,
    couponProgress,
    starsToNextTier,
    tierProgress,
    nextTierName,
    currentTierDisplayName,
    daysUntilReview,
  } = useLoyalty();

  const { isAuthenticated, currentUser, isLoading: isAuthLoading } = useAuth();

  // 컴포넌트 마운트 시 설정 로드
  useEffect(() => {
    fetchMembershipConfig();
  }, [fetchMembershipConfig]);

  // 캐러셀 상태 업데이트
  useEffect(() => {
    if (!carouselApi) return;

    const updateScrollState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateScrollState();
    carouselApi.on('select', updateScrollState);
    carouselApi.on('reInit', updateScrollState);
  }, [carouselApi]);

  // 설정 기반 데이터 생성
  const earnMethods = createEarnMethods(config?.earningRates);
  const tierBenefits = createTierBenefits(config?.tierThresholds);
  const tabItems = createTabItems(config?.tierThresholds);

  // 웰컴 쿠폰 확인
  const welcomeCoupons = coupons.filter(
    (c) => c.issueType === 'WELCOME' && c.status === 'ACTIVE'
  );
  const hasWelcomeCoupon = welcomeCoupons.length > 0;

  // 로딩 상태
  const isLoading = isLoyaltyLoading || isAuthLoading || configLoading;

  // 설정값
  const welcomeStars = config?.welcomeStars ?? 5;
  const couponCost = config?.couponCost ?? 12;
  const starsAfterWelcome = couponCost - welcomeStars;
  const starExpiryYears = config?.starExpiryYears ?? 1;

  // 활성 쿠폰 수
  const activeCouponsCount = coupons.filter(
    (c) => c.status === 'ACTIVE'
  ).length;

  // 전체 로딩 중
  if (configLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
      {/* 1. Hero Section: 로그인 상태에 따라 다르게 표시 */}
      <div className="text-center mb-20">
        <Badge
          variant="outline"
          className="mb-6 px-4 py-1 text-sm border-primary text-primary"
        >
          StarCoex Premium Membership
        </Badge>

        {isAuthenticated ? (
          /* ✅ 로그인 상태: 현재 멤버십 현황 표시 */
          <>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              {currentUser?.name || '회원'}님의
              <br className="hidden md:block" />{' '}
              <span className="text-primary">멤버십 현황</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              주유할 때마다 쌓이는 별로 더 높은 혜택을 경험하세요.
            </p>

            {/* 멤버십 현황 카드 */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <Card className="overflow-hidden border-2">
                  {/* 등급 배너 */}
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                          <Crown className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-muted-foreground">
                            현재 등급
                          </p>
                          <h3 className="text-2xl font-bold">
                            {currentTierDisplayName}
                          </h3>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setIsGradeModalOpen(true)}
                      >
                        상세 보기
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* 별 & 쿠폰 현황 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 text-center">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">
                          {membership?.availableStars ?? 0}
                        </p>
                        <p className="text-xs text-muted-foreground">보유 별</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 text-center">
                        <Ticket className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold">
                          {activeCouponsCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          보유 쿠폰
                        </p>
                      </div>
                    </div>

                    {/* 웰컴 혜택 안내 (해당되는 경우) */}
                    {(hasWelcomeCoupon || starsToNextCoupon > 0) && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800 dark:text-green-200">
                            {hasWelcomeCoupon ? '웰컴 혜택' : '다음 쿠폰까지'}
                          </span>
                        </div>

                        {hasWelcomeCoupon && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-600">
                              <Gift className="h-3 w-3 mr-1" />
                              웰컴 쿠폰
                            </Badge>
                            <span className="text-sm text-green-700 dark:text-green-300">
                              {welcomeCoupons[0].name} 사용 가능!
                            </span>
                          </div>
                        )}

                        {starsToNextCoupon > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-green-700 dark:text-green-300 mb-1">
                              <span>다음 쿠폰까지</span>
                              <span>{starsToNextCoupon}별 남음</span>
                            </div>
                            <Progress
                              value={couponProgress}
                              className="h-2 bg-green-200 dark:bg-green-900"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* 다음 등급 진행률 - 서버 계산 필드 사용 */}
                    {nextTierName ? (
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            {nextTierName} 등급까지
                          </span>
                          <span className="font-medium">
                            {membership?.tierStars ?? 0} /{' '}
                            {(membership?.tierStars ?? 0) +
                              (starsToNextTier ?? 0)}
                            별
                          </span>
                        </div>
                        <Progress value={tierProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          <span className="font-bold text-foreground">
                            {starsToNextTier}별
                          </span>{' '}
                          더 모으면 {nextTierName} 등급!
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium py-2">
                        <Trophy className="w-4 h-4" />
                        <span>최고 등급을 달성하셨습니다!</span>
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="flex gap-3">
                      <Button asChild variant="outline" className="flex-1">
                        <Link to="/dashboard/coupons">내 쿠폰</Link>
                      </Button>
                      <Button asChild className="flex-1">
                        <Link to="/dashboard/coupons/exchange">쿠폰 교환</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        ) : (
          /* ✅ 비로그인 상태: 가입 유도 */
          <>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              가입만 해도
              <br className="hidden md:block" />{' '}
              <span className="text-primary">즉시 등급 UP</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              복잡한 조건 없이, 가입 즉시 WELCOME 등급의 혜택을 누리세요.
              <br />
              주유할 때마다 쌓이는 별로 더 높은 혜택을 경험할 수 있습니다.
            </p>

            {/* 웰컴 혜택 안내 카드 */}
            <div className="max-w-xl mx-auto mb-10">
              <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800 dark:text-green-200">
                      지금 가입하면 받는 웰컴 혜택
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Badge
                      variant="secondary"
                      className="text-sm py-1.5 px-3 bg-white/80 dark:bg-white/10"
                    >
                      <Gift className="h-4 w-4 mr-1.5 text-green-600" />
                      프리미엄 세차권 1장
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-sm py-1.5 px-3 bg-white/80 dark:bg-white/10"
                    >
                      <Star className="h-4 w-4 mr-1.5 fill-amber-500 text-amber-500" />
                      웰컴 별 {welcomeStars}개
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-4 text-center">
                    {starsAfterWelcome}개만 더 모으면 추가 쿠폰 교환 가능!
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 가입 버튼 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-10 h-14 text-lg shadow-lg shadow-primary/20"
                asChild
              >
                <Link to="/auth/register">
                  <UserPlus className="w-5 h-5 mr-2" />
                  무료 회원가입
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 h-14 text-lg"
                asChild
              >
                <Link to="/auth/login">이미 회원이신가요? 로그인</Link>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 등급 확인 모달 - 서버 계산 필드 사용 */}
      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              내 멤버십 등급
            </DialogTitle>
            <DialogDescription className="text-center">
              현재 나의 멤버십 상태를 확인하세요
            </DialogDescription>
          </DialogHeader>

          {isLoyaltyLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span>멤버십 정보를 불러오는 중...</span>
            </div>
          ) : membership ? (
            <div className="py-6">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  {currentTierDisplayName}
                </h3>
                {currentUser?.name && (
                  <p className="text-muted-foreground">
                    {currentUser.name}님의 현재 등급
                  </p>
                )}
              </div>

              <div className="bg-muted/50 rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">등급 적립 별</span>
                  <span className="text-2xl font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    {membership.tierStars}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">사용 가능한 별</span>
                  <span className="text-lg font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    {membership.availableStars}
                  </span>
                </div>

                {nextTierName ? (
                  <>
                    <Progress value={tierProgress} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {nextTierName} 등급까지{' '}
                      <span className="font-bold text-foreground">
                        {starsToNextTier}개
                      </span>{' '}
                      남음
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                    <Trophy className="w-4 h-4" />
                    <span>최고 등급을 달성하셨습니다!</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm text-center text-muted-foreground">
                <p>
                  등급 시작일:{' '}
                  {new Date(membership.tierStartDate).toLocaleDateString(
                    'ko-KR'
                  )}
                </p>
                <p>
                  다음 등급 심사일:{' '}
                  {new Date(membership.nextReviewDate).toLocaleDateString(
                    'ko-KR'
                  )}
                  {daysUntilReview > 0 && (
                    <span className="ml-1 text-primary">
                      ({daysUntilReview}일 남음)
                    </span>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">멤버십 정보가 없습니다</h3>
              <p className="text-muted-foreground mb-6">
                아직 멤버십이 등록되지 않았습니다.
                <br />첫 주유 시 자동으로 WELCOME 등급이 부여됩니다.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsGradeModalOpen(false)}
              >
                확인
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 2. How to Earn Stars */}
      <section className="mb-24 relative">
        <div className="flex items-end justify-between mb-8 px-4 md:px-0">
          <div>
            <h2 className="text-3xl font-bold mb-2">별(Star) 적립 방법</h2>
            <p className="text-muted-foreground">
              일상 속에서 자연스럽게 별이 쌓입니다.
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setCarouselApi}
          opts={{ align: 'start', loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {earnMethods.map((item, idx) => (
              <CarouselItem
                key={idx}
                className="pl-4 md:basis-1/2 lg:basis-1/4"
              >
                <Card className="border bg-card hover:border-primary/50 transition-colors h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.desc}
                    </p>
                    <div className="text-2xl font-bold text-foreground">
                      {item.point}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* 3. 등급별 혜택 */}
      <section id="tier-benefits-section" className="mb-24 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">등급별 혜택 안내</h2>
          <p className="text-muted-foreground">
            가입 즉시 시작되는 혜택부터 VIP만의 특권까지 확인하세요.
          </p>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full max-w-5xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-3 p-1 bg-muted rounded-2xl mb-8 h-auto">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-xl py-3 flex flex-col gap-1 data-[state=active]:shadow-sm transition-all"
              >
                <span className="font-bold text-base md:text-lg">
                  {tab.label}
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {tab.sub}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {tierBenefits.map((tier) => (
            <TabsContent
              key={tier.value}
              value={tier.value}
              className="focus-visible:ring-0"
            >
              <div className="grid md:grid-cols-5 gap-6 lg:gap-10 items-start">
                {/* 좌측: 등급 카드 */}
                <div className="md:col-span-2 bg-muted/50 rounded-3xl p-8 text-center h-full flex flex-col justify-center items-center min-h-[300px] border">
                  <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm border">
                    <Crown className="w-10 h-10 text-foreground" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{tier.title}</h3>
                  <p className="text-muted-foreground mb-6">{tier.sub}</p>
                  <Badge
                    variant="outline"
                    className="border-foreground/20 text-foreground"
                  >
                    {tier.badge}
                  </Badge>
                </div>

                {/* 우측: 혜택 목록 */}
                <div className="md:col-span-3 space-y-8 py-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      주요 혜택
                    </h4>
                    <ul className="grid gap-4">
                      {tier.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-2xl border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <span className="font-bold text-foreground">
                              {idx + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-foreground">
                              {benefit.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {benefit.desc}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* 4. FAQ & Info */}
      <div className="grid lg:grid-cols-2 gap-8 mt-20">
        <div className="bg-card border rounded-3xl p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            자주 묻는 질문
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: '별의 유효기간은 언제까지인가요?',
                a: `적립일로부터 ${starExpiryYears}년입니다. 만료 전 알림을 드립니다.`,
              },
              {
                q: '등급은 언제 변경되나요?',
                a: '조건 달성 즉시 승급되며, 등급 유지 기간은 1년입니다.',
              },
              {
                q: '법인 카드도 적립 되나요?',
                a: '네, 결제 수단과 무관하게 전화번호로 적립 가능합니다.',
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b-muted"
              >
                <AccordionTrigger className="hover:no-underline py-4 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="bg-muted/30 rounded-3xl p-8 flex flex-col justify-between border">
          <div>
            <h3 className="text-xl font-bold mb-4">고객 지원</h3>
            <p className="text-muted-foreground mb-6">
              멤버십 등급 산정이나 혜택 적용에 대해 궁금한 점이 있으신가요?
              <br />
              전담 상담원이 친절하게 안내해 드립니다.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground mb-1">
              1588-0000
            </div>
            <p className="text-sm text-muted-foreground">
              평일 09:00 - 18:00 (주말/공휴일 휴무)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
