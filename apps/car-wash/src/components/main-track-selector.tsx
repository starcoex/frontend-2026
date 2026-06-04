import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, Gem, ArrowRight, Clock, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/app/config/app.config';

// ── 타입 ────────────────────────────────────────────────────────────────────────

type TrackType = 'speed' | 'premium';

interface TrackFeature {
  label: string;
}

interface TrackConfig {
  type: TrackType;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: TrackFeature[];
  badge: React.ReactNode;
  ctaLabel: string;
  href: string;
  colorClass: {
    card: string;
    iconBg: string;
    iconText: string;
    badge: string;
    button: string;
    separator: string;
  };
}

// ── 서브 컴포넌트: TrackCard ────────────────────────────────────────────────────

interface TrackCardProps {
  config: TrackConfig;
  index: number;
}

const TrackCard: React.FC<TrackCardProps> = ({ config, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.12 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className={cn(
          'group h-full flex flex-col cursor-pointer border-2 transition-all duration-300',
          'bg-card hover:shadow-xl',
          config.colorClass.card
        )}
        onClick={() => navigate(config.href)}
      >
        <CardContent className="flex-1 p-6 space-y-5">
          {/* 아이콘 + 제목 */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                config.colorClass.iconBg
              )}
            >
              <span className={config.colorClass.iconText}>{config.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {config.title}
              </h3>
              <p
                className={cn(
                  'text-sm font-semibold mt-0.5',
                  config.colorClass.iconText
                )}
              >
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* 설명 */}
          <p className="text-muted-foreground text-sm leading-relaxed">
            {config.description}
          </p>

          <Separator className={config.colorClass.separator} />

          {/* 특징 목록 */}
          <ul className="space-y-2">
            {config.features.map((feature) => (
              <li
                key={feature.label}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    config.colorClass.iconText.replace('text-', 'bg-')
                  )}
                />
                <span className="text-muted-foreground">{feature.label}</span>
              </li>
            ))}
          </ul>

          {/* 실시간 상태 뱃지 */}
          <Badge
            variant="outline"
            className={cn(
              'flex items-center gap-1.5 w-fit py-1.5 px-3',
              config.colorClass.badge
            )}
          >
            {config.badge}
          </Badge>
        </CardContent>

        {/* CTA 버튼 */}
        <CardFooter className="p-6 pt-0">
          <Button
            className={cn(
              'w-full font-semibold group/btn',
              config.colorClass.button
            )}
            size="lg"
          >
            {config.ctaLabel}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────────

interface MainTrackSelectorProps {
  waitingCount?: number;
  estimatedMinutes?: number;
  nextPremiumSlot?: string;
}

export const MainTrackSelector: React.FC<MainTrackSelectorProps> = ({
  waitingCount = 2,
  estimatedMinutes,
  nextPremiumSlot = '내일 오전 10시',
}) => {
  const calcMinutes = estimatedMinutes ?? waitingCount * 10;

  const TRACK_CONFIGS: TrackConfig[] = [
    {
      type: 'speed',
      icon: <Zap className="w-6 h-6" />,
      title: '⚡ 스피드 존',
      subtitle: '10분 외부 손세차',
      description:
        '바쁜 일상 속 가장 빠르고 깔끔한 외부 세차. 결제 후 바로 대기열에 합류해 소중한 시간을 아끼세요.',
      features: [
        { label: '기본 / 별표 / 반짝 3단계 티어' },
        { label: '타이어 광택, 실내 매트 등 애드온 선택' },
        { label: '실시간 대기 현황 및 스마트 발권' },
        { label: '결제 즉시 대기열 자동 등록' },
      ],
      badge: (
        <>
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-cyan-700 dark:text-cyan-300 text-xs font-medium">
            현재 대기 {waitingCount}대 · 약 {calcMinutes}분
          </span>
        </>
      ),
      ctaLabel: '지금 바로 시작',
      href: APP_CONFIG.routes.speed,
      colorClass: {
        card: 'border-cyan-200 hover:border-cyan-400 dark:border-cyan-800 dark:hover:border-cyan-500',
        iconBg: 'bg-cyan-100 dark:bg-cyan-950',
        iconText: 'text-cyan-600 dark:text-cyan-400',
        badge:
          'border-cyan-200 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/50',
        button:
          'bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400',
        separator: 'bg-cyan-100 dark:bg-cyan-900',
      },
    },
    {
      type: 'premium',
      icon: <Gem className="w-6 h-6" />,
      title: '💎 프리미엄 존',
      subtitle: '전문 디테일링 · 코팅 · PPF',
      description:
        '장인의 손길로 완성되는 프리미엄 카케어. 담당 디테일러를 직접 지정하고 최상의 결과를 경험하세요.',
      features: [
        { label: '유리막 코팅 · PPF 필름 시공' },
        { label: '광택 폴리싱 · 내장 크리닝' },
        { label: '담당 디테일러 직접 지정' },
        { label: '캘린더 기반 사전 예약 시스템' },
      ],
      badge: (
        <>
          <CalendarDays className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300 text-xs font-medium">
            가장 빠른 예약: {nextPremiumSlot}
          </span>
        </>
      ),
      ctaLabel: '예약하기',
      href: APP_CONFIG.routes.premium,
      colorClass: {
        card: 'border-amber-200 hover:border-amber-400 dark:border-amber-800 dark:hover:border-amber-500',
        iconBg: 'bg-amber-100 dark:bg-amber-950',
        iconText: 'text-amber-600 dark:text-amber-400',
        badge:
          'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50',
        button:
          'bg-amber-600 hover:bg-amber-500 text-white dark:bg-amber-500 dark:hover:bg-amber-400',
        separator: 'bg-amber-100 dark:bg-amber-900',
      },
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* 섹션 헤더 */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 text-xs uppercase tracking-widest"
          >
            서비스 선택
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            지금 내 차에 필요한 것은?
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            방문 목적에 따라 서비스를 선택하세요
          </p>
        </motion.div>

        {/* 투트랙 카드 그리드 */}
        <div className="grid md:grid-cols-2 gap-6">
          {TRACK_CONFIGS.map((config, index) => (
            <TrackCard key={config.type} config={config} index={index} />
          ))}
        </div>

        {/* 차량번호 빠른 진입 힌트 */}
        <motion.p
          className="text-center text-xs text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          💡 스피드 존 진입 후 차량번호를 입력하면 차종에 맞는 요금이 자동
          적용됩니다
        </motion.p>
      </div>
    </section>
  );
};
