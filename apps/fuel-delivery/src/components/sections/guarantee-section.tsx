import React from 'react';
import { cn } from '@/lib/utils';

type GuaranteeFeature = {
  title: string;
  description: string;
  visual: React.ReactNode;
};

const FEATURES: GuaranteeFeature[] = [
  {
    title: '잔량 측정으로 먼저 확인하세요',
    description:
      '기존 잔량이 남았을 경우 기름이 차있는 곳까지의 길이를 표시합니다. 가로 × 세로 × 높이 = 부피(량 or 리터)로 직접 계산할 수 있습니다.',
    visual: (
      <div className="bg-accent relative h-[220px] w-full sm:h-[260px] md:h-[300px] rounded-[12px] flex items-center justify-center">
        <div className="relative w-28 h-36 border-2 border-foreground/30 rounded-sm bg-background">
          {/* 가로 라벨 */}
          <div className="absolute -top-6 left-0 right-0 flex items-center justify-center gap-1">
            <div className="h-px flex-1 bg-foreground/30" />
            <span className="text-[10px] text-muted-foreground">가로 cm</span>
            <div className="h-px flex-1 bg-foreground/30" />
          </div>
          {/* 높이 라벨 */}
          <div className="absolute top-0 -left-11 bottom-0 flex flex-col items-center justify-center gap-1">
            <div className="w-px flex-1 bg-foreground/30" />
            <span className="text-[10px] text-muted-foreground rotate-0">
              높이 cm
            </span>
            <div className="w-px flex-1 bg-foreground/30" />
          </div>
          {/* 세로 라벨 */}
          <div className="absolute top-0 -right-11 bottom-0 flex flex-col items-center justify-center gap-1">
            <div className="w-px flex-1 bg-foreground/30" />
            <span className="text-[10px] text-muted-foreground">세로 cm</span>
            <div className="w-px flex-1 bg-foreground/30" />
          </div>
          {/* 기름 채움 */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-orange-200/50 dark:bg-orange-900/30 rounded-b-sm border-t-2 border-dashed border-orange-400/70" />
        </div>
      </div>
    ),
  },
  {
    title: '주유미터기를 반드시 확인하세요',
    description:
      '주유미터기를 반드시 확인하세요. 0부터 시작해서 한 드럼이면 200리터까지 들어가는지를 확인합니다.',
    visual: (
      <div className="bg-accent relative h-[220px] w-full sm:h-[260px] md:h-[300px] rounded-[12px] flex items-center justify-center">
        <div className="w-44 bg-background border-2 border-foreground/20 rounded-lg p-4 shadow-inner space-y-2">
          {[
            { label: '총량', value: '0.00' },
            { label: '단가', value: '0.00' },
            { label: '금액', value: '1000' },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between bg-slate-900 dark:bg-slate-950 rounded px-3 py-1.5"
            >
              <span className="text-[11px] text-slate-400">{row.label}</span>
              <span className="font-mono text-base font-bold text-green-400">
                {row.value}
              </span>
            </div>
          ))}
          <p className="text-[11px] text-center text-muted-foreground pt-1">
            반드시 <strong className="text-foreground">0</strong> 부터 시작
          </p>
        </div>
      </div>
    ),
  },
  {
    title: '금액 · 리터 · 단가가 정확히 일치합니다',
    description:
      '주유 후 금액, 리터, 단가를 확인하세요. 별표주유소는 금액, 리터, 단가가 정확히 일치합니다.',
    visual: (
      <div className="bg-accent relative h-[220px] w-full sm:h-[260px] md:h-[300px] rounded-[12px] flex items-center justify-center">
        <div className="w-44 bg-background border-2 border-orange-400/50 rounded-lg p-4 shadow-inner space-y-2">
          {[
            { label: '금액', value: '200,000' },
            { label: '리터', value: '200 L' },
            { label: '단가', value: '1,000' },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between bg-slate-900 dark:bg-slate-950 rounded px-3 py-1.5"
            >
              <span className="text-[11px] text-slate-400">{row.label}</span>
              <span className="font-mono text-base font-bold text-orange-400">
                {row.value}
              </span>
            </div>
          ))}
          <p className="text-[11px] text-center text-orange-500 dark:text-orange-400 pt-1 font-medium">
            ✓ 별표주유소 정량 보장
          </p>
        </div>
      </div>
    ),
  },
  {
    title: '웹에서 바로 주문, 실시간으로 추적',
    description:
      '복잡한 전화 주문 없이 웹앱에서 간편하게 주문하고, GPS 기반 실시간 배송 추적으로 기사님의 위치를 직접 확인하세요.',
    visual: (
      <div className="bg-accent relative h-[220px] w-full sm:h-[260px] md:h-[300px] rounded-[12px] flex items-center justify-center gap-6">
        {/* 주문 단계 */}
        <div className="flex flex-col items-center gap-3">
          {['주문 접수', '배차 완료', '배송 중', '완료'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                  i < 3
                    ? 'bg-orange-500 text-white'
                    : 'bg-muted text-muted-foreground border border-border'
                )}
              >
                {i < 3 ? '✓' : i + 1}
              </div>
              <span
                className={cn(
                  'text-xs',
                  i < 3
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        {/* GPS 핀 */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/50 border-2 border-blue-400 flex items-center justify-center text-xl animate-pulse">
            📍
          </div>
          <span className="text-[10px] text-muted-foreground">실시간 위치</span>
        </div>
      </div>
    ),
  },
];

function FeatureCard({ feature }: { feature: GuaranteeFeature }) {
  return (
    <div className="bg-card border-border relative flex flex-col rounded-[16px] border p-6 text-left shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]">
      <h3 className="text-foreground text-lg font-medium sm:text-xl">
        {feature.title}
      </h3>
      <p className="text-muted-foreground mt-2 text-sm sm:text-base">
        {feature.description}
      </p>
      <div className="relative mt-6 w-full overflow-hidden rounded-[12px]">
        {feature.visual}
      </div>
    </div>
  );
}

export const GuaranteeSection: React.FC = () => {
  const [f1, f2, f3, f4] = FEATURES;

  return (
    <section id="guarantee" className="bg-background px-6 lg:px-0">
      <div className="container px-0 py-16 sm:py-20 md:px-6 md:py-28">
        {/* 섹션 헤더 */}
        <p className="text-muted-foreground mb-4 text-center text-sm sm:text-base">
          왜 별표주유소인가요?
        </p>
        <h2 className="text-foreground mx-auto max-w-3xl text-center text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          기름은 정량일까?
          <br className="hidden sm:block" />
          이런 걱정 하신 적 있으시죠?
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg">
          국내 난방유 시장의 고질적인 정량 속임 문제. 별표주유소는 디지털 계량
          시스템으로 주문한 만큼 정확하게 배달합니다. 정확한 주유량 체크 방법을
          알려 드립니다.
        </p>

        {/* 카드 그리드 — metafi-features 레이아웃 패턴 */}
        <div className="mt-12 flex flex-col gap-6 md:mt-14 md:gap-8 lg:flex-row">
          <div className="lg:flex-1">
            <FeatureCard feature={f1} />
          </div>
          <div className="lg:w-[500px]">
            <FeatureCard feature={f2} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 md:mt-8 md:gap-8 lg:flex-row">
          <div className="lg:w-[500px]">
            <FeatureCard feature={f3} />
          </div>
          <div className="lg:flex-1">
            <FeatureCard feature={f4} />
          </div>
        </div>
      </div>
    </section>
  );
};
