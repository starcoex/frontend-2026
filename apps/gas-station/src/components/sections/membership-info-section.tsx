import { Fragment, useEffect } from 'react';
import {
  CheckIcon,
  MinusIcon,
  Info,
  Star,
  Gift,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { useAuth } from '@starcoex-frontend/auth';

// ============================================================================
// 📋 타입 정의
// ============================================================================
type TierName = 'WELCOME' | 'SHINE' | 'STAR';

interface Tier {
  name: TierName;
  displayName: string;
  description: string;
  threshold: number;
  thresholdLabel: string;
}

interface Feature {
  name: string;
  tooltip: string;
  tiers: Record<TierName, boolean | string>;
}

interface Section {
  name: string;
  features: Feature[];
}

// ============================================================================
// 📊 등급 데이터
// ============================================================================
const createTiers = (thresholds?: { SHINE: number; STAR: number }): Tier[] => [
  {
    name: 'WELCOME',
    displayName: 'WELCOME',
    description: '스타코엑스와 함께하는 첫 걸음',
    threshold: 0,
    thresholdLabel: '가입 즉시',
  },
  {
    name: 'SHINE',
    displayName: 'SHINE',
    description: '카케어 특화 혜택이 시작되는 등급',
    threshold: thresholds?.SHINE ?? 50,
    thresholdLabel: `${thresholds?.SHINE ?? 50}별 달성`,
  },
  {
    name: 'STAR',
    displayName: 'STAR (VIP)',
    description: '최상위 프리미엄 혜택을 누리는 오너',
    threshold: thresholds?.STAR ?? 200,
    thresholdLabel: `${thresholds?.STAR ?? 200}별 달성`,
  },
];

// ============================================================================
// 🎁 혜택 섹션 데이터 생성 함수
// ============================================================================
const createSections = (config?: {
  welcomeStars: number;
  welcomeCouponDays: number;
  couponCost: number;
  starExpiryYears: number;
}): Section[] => {
  const welcomeStars = config?.welcomeStars ?? 5;
  const welcomeCouponDays = config?.welcomeCouponDays ?? 30;
  const couponCost = config?.couponCost ?? 12;

  return [
    {
      name: '가입 & 적립 혜택',
      features: [
        {
          name: `웰컴 별 ${welcomeStars}개 즉시 지급`,
          tooltip: `회원가입 즉시 ${welcomeStars}개의 별이 지급됩니다. ${
            couponCost - welcomeStars
          }개만 더 모으면 무료 쿠폰!`,
          tiers: { WELCOME: true, SHINE: true, STAR: true },
        },
        {
          name: '신규 회원 무료 세차권',
          tooltip: `가입 즉시 제공되는 무료 세차권입니다. (${welcomeCouponDays}일 유효)`,
          tiers: { WELCOME: true, SHINE: true, STAR: true },
        },
        {
          name: '주유 별 적립',
          tooltip: '주유 10,000원당 1별이 적립됩니다.',
          tiers: { WELCOME: '1별/만원', SHINE: '1별/만원', STAR: '1별/만원' },
        },
        {
          name: '카케어 별 적립 (2배!)',
          tooltip: '카케어 서비스는 10,000원당 2별이 적립됩니다. (2배 적립)',
          tiers: { WELCOME: '2별/만원', SHINE: '2별/만원', STAR: '2별/만원' },
        },
      ],
    },
    {
      name: '쿠폰 & 세차 혜택',
      features: [
        {
          name: `${couponCost}별 → 무료 세차권 교환`,
          tooltip: `별 ${couponCost}개를 모으면 프리미엄 세차권으로 교환할 수 있습니다.`,
          tiers: { WELCOME: true, SHINE: true, STAR: true },
        },
        {
          name: '워셔액 무상 보충',
          tooltip: '방문 시 워셔액을 무료로 보충해드립니다.',
          tiers: { WELCOME: true, SHINE: true, STAR: true },
        },
        {
          name: '쿠폰 선물하기',
          tooltip: '보유한 쿠폰을 친구에게 선물할 수 있습니다. (링크/이메일)',
          tiers: { WELCOME: true, SHINE: true, STAR: true },
        },
        {
          name: '프리미엄 광택/코팅 (연 1회)',
          tooltip: '연 1회 전문가의 광택 서비스를 무료로 제공합니다.',
          tiers: { WELCOME: false, SHINE: false, STAR: true },
        },
      ],
    },
    {
      name: '멤버십 특별 혜택',
      features: [
        {
          name: '생일 축하 쿠폰',
          tooltip: '생일 당월 사용 가능한 특별 할인 쿠폰입니다.',
          tiers: { WELCOME: '3,000원', SHINE: '5,000원', STAR: '10,000원' },
        },
        {
          name: '등급 유지 기간',
          tooltip: '달성한 등급은 1년간 유지됩니다. (tierStars 기준)',
          tiers: { WELCOME: '1년', SHINE: '1년', STAR: '1년' },
        },
        {
          name: '엔진오일 교환 할인',
          tooltip: '제휴 정비소 이용 시 할인 혜택을 드립니다.',
          tiers: { WELCOME: false, SHINE: '10%', STAR: '20%' },
        },
        {
          name: 'VIP 전용 고객센터',
          tooltip: '대기 없는 VIP 전용 상담 라인을 운영합니다.',
          tiers: { WELCOME: false, SHINE: false, STAR: true },
        },
      ],
    },
  ];
};

// ============================================================================
// 🎯 컴포넌트
// ============================================================================
export const MembershipInfoSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const {
    config,
    configLoading,
    fetchMembershipConfig,
    membership,
    currentTierDisplayName,
  } = useLoyalty();

  // 컴포넌트 마운트 시 설정 로드
  useEffect(() => {
    fetchMembershipConfig();
  }, [fetchMembershipConfig]);

  // 설정 기반으로 데이터 생성
  const tiers = createTiers(config?.tierThresholds);
  const sections = createSections(config ?? undefined);

  // 적립률 표시용 데이터
  const earningRates = config?.earningRates ?? { GAS: 1, OIL: 1, CAR_CARE: 2 };
  const earningRateLabels = {
    GAS: { label: '주유', won: 10000 },
    OIL: { label: '난방유', won: 10000 },
    CAR_CARE: { label: '카케어', won: 10000 },
  };

  // 로딩 중
  if (configLoading) {
    return (
      <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
        <div className="container flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  const welcomeStars = config?.welcomeStars ?? 5;
  const couponCost = config?.couponCost ?? 12;
  const starsAfterWelcome = couponCost - welcomeStars;
  const starExpiryYears = config?.starExpiryYears ?? 1;

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container flex flex-col justify-center gap-8 overflow-hidden py-12 md:py-32">
        {/* 헤더 영역 */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            쓰면 쓸수록 커지는{' '}
            <span className="text-primary">프리미엄 혜택</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg leading-8">
            주유·세차할 때마다 쌓이는 '별(Star)'로 등급을 올리세요.
            <br />
            <span className="text-primary font-semibold">
              카케어 서비스는 2배 적립!
            </span>{' '}
            내 차를 관리하며 더 빠르게 혜택을 누리세요.
          </p>
        </div>

        {/* 비로그인: 웰컴 혜택 배너 */}
        {!isAuthenticated && (
          <div className="mx-auto mt-8 w-full max-w-2xl">
            <Card className="border-primary/30 bg-primary/5 p-6">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Gift className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold">
                    지금 가입하면 받는 웰컴 혜택
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    <span className="font-semibold text-primary">
                      무료 세차권 1장
                    </span>{' '}
                    +{' '}
                    <span className="font-semibold text-primary">
                      웰컴 별 {welcomeStars}개
                    </span>
                    <br />
                    <span className="text-sm">
                      {starsAfterWelcome}개만 더 모으면 추가 쿠폰 교환 가능!
                    </span>
                  </p>
                </div>
                <Button
                  className="whitespace-nowrap"
                  onClick={() => navigate('/auth/login')}
                >
                  무료 회원가입
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* 로그인: 현재 등급 표시 배너 */}
        {isAuthenticated && membership && (
          <div className="mx-auto mt-8 w-full max-w-2xl">
            <Card className="border-primary/30 bg-primary/5 p-6">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold">
                    {currentUser?.name}님의 현재 등급
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    <span className="font-semibold text-primary text-xl">
                      {currentTierDisplayName}
                    </span>
                    <br />
                    <span className="text-sm">
                      보유 별: {membership.availableStars}개
                    </span>
                  </p>
                </div>
                <Button
                  className="whitespace-nowrap"
                  onClick={() => navigate('/mypage/membership')}
                >
                  내 멤버십 보기
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* 별 적립 규칙 안내 */}
        <div className="mx-auto mt-4 flex flex-wrap justify-center gap-4">
          {Object.entries(earningRates).map(([key, stars]) => {
            const rateInfo =
              earningRateLabels[key as keyof typeof earningRateLabels];
            return (
              <div
                key={key}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm',
                  key === 'CAR_CARE'
                    ? 'bg-primary/20 text-primary font-semibold'
                    : 'bg-muted'
                )}
              >
                <Star className="h-4 w-4" />
                <span>
                  {rateInfo.label}: {rateInfo.won.toLocaleString()}원 = {stars}
                  별
                </span>
                {key === 'CAR_CARE' && (
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* 모바일 뷰: 카드 리스트 */}
        <div className="mx-auto mt-12 w-full max-w-lg space-y-8 sm:mt-16 lg:hidden">
          {tiers.map((tier) => (
            <Card key={tier.name} className="p-6 shadow-lg sm:p-8">
              <CardHeader className="p-0">
                <div className="flex flex-col gap-2 text-center">
                  <CardTitle className="text-2xl text-primary">
                    {tier.displayName}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base font-normal">
                    {tier.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col justify-center gap-1 pt-6 text-center">
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    {tier.threshold === 0 ? '무료' : `${tier.threshold}별`}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm font-medium">
                    {tier.thresholdLabel}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-6">
                <Accordion
                  type="multiple"
                  defaultValue={sections.map((s) => `${tier.name}-${s.name}`)}
                  className="w-full"
                >
                  <TooltipProvider>
                    {sections.map((section) => (
                      <AccordionItem
                        key={section.name}
                        value={`${tier.name}-${section.name}`}
                        className="border-b-0"
                      >
                        <AccordionTrigger className="text-foreground text-sm hover:no-underline py-3">
                          {section.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-1">
                            {section.features.map((feature) => {
                              const tierValue = feature.tiers[tier.name];
                              if (!tierValue) return null;

                              return (
                                <div
                                  key={feature.name}
                                  className="flex items-start justify-between gap-4"
                                >
                                  <span className="flex items-center gap-3 text-base">
                                    <CheckIcon className="h-5 w-5 flex-none text-primary" />
                                    <span>
                                      {feature.name}
                                      {typeof tierValue === 'string' && (
                                        <span className="ml-2 text-primary font-semibold">
                                          ({tierValue})
                                        </span>
                                      )}
                                    </span>
                                  </span>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="-mt-1 h-6 w-6"
                                      >
                                        <Info className="text-muted-foreground h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {feature.tooltip}
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </TooltipProvider>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 데스크탑 뷰: 비교 테이블 */}
        <div className="isolate mt-20 hidden lg:block">
          <div className="relative -mx-8">
            {tiers.map((tier, idx) => (
              <div
                className="absolute inset-x-4 inset-y-0 -z-10 flex"
                key={tier.name}
              >
                <div
                  className="flex w-1/4 px-4"
                  style={{ marginLeft: `${(idx + 1) * 25}%` }}
                >
                  <div className="w-full border-x border-gray-100 dark:border-gray-800" />
                </div>
              </div>
            ))}

            <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
              <thead>
                <tr>
                  <td />
                  {tiers.map((tier) => (
                    <th key={tier.name} className="px-6 pt-6 xl:px-8 xl:pt-8">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <span className="text-xl font-bold uppercase leading-7 text-primary">
                          {tier.displayName}
                        </span>
                        <span className="text-muted-foreground text-sm font-normal">
                          {tier.description}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="px-6 pt-6 xl:px-8">
                    <div className="text-muted-foreground text-lg font-semibold">
                      등급 기준
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      (별 누적)
                    </div>
                  </th>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="px-6 pt-10 xl:px-8">
                      <div className="flex flex-col justify-center items-center gap-2 text-center">
                        <span className="text-3xl font-bold">
                          {tier.threshold === 0
                            ? '무료'
                            : `${tier.threshold}별`}
                        </span>
                        <span className="text-muted-foreground text-sm leading-6">
                          {tier.thresholdLabel}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            navigate('/membership', {
                              state: { selectedTier: tier.name.toLowerCase() },
                            })
                          }
                        >
                          자세히 보기
                        </Button>
                      </div>
                    </td>
                  ))}
                </tr>

                {sections.map((section, sectionIdx) => (
                  <Fragment key={section.name}>
                    <tr>
                      <th
                        className={cn(
                          'text-foreground pb-4 text-sm font-semibold leading-6',
                          sectionIdx === 0 ? 'pt-8' : 'pt-16'
                        )}
                      >
                        {section.name}
                      </th>
                    </tr>
                    <TooltipProvider delayDuration={200}>
                      {section.features.map((feature) => (
                        <tr key={feature.name}>
                          <th className="text-muted-foreground flex items-center justify-between py-4 text-sm font-normal leading-6">
                            <span>{feature.name}</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="text-muted-foreground hover:text-foreground ml-1 h-4 w-4" />
                              </TooltipTrigger>
                              <TooltipContent>{feature.tooltip}</TooltipContent>
                            </Tooltip>
                          </th>
                          {tiers.map((tier) => {
                            const tierValue = feature.tiers[tier.name];
                            return (
                              <td key={tier.name} className="px-6 py-4 xl:px-8">
                                {tierValue === true ? (
                                  <CheckIcon className="mx-auto h-5 w-5 text-primary" />
                                ) : tierValue === false ? (
                                  <MinusIcon className="text-muted-foreground/30 mx-auto h-5 w-5" />
                                ) : (
                                  <span className="block text-center font-semibold text-primary">
                                    {tierValue}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </TooltipProvider>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단 CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            별은 적립일로부터{' '}
            <span className="font-semibold text-foreground">
              {starExpiryYears}년간
            </span>{' '}
            유효합니다.
          </p>
          {isAuthenticated ? (
            <Button
              size="lg"
              className="text-lg"
              onClick={() => navigate('/mypage/membership')}
            >
              내 멤버십 확인하기
            </Button>
          ) : (
            <Button
              size="lg"
              className="text-lg"
              onClick={() => navigate('/auth/login')}
            >
              지금 바로 시작하기
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
