import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ── 시각화: 한 드럼 (200L) ────────────────────────────────────────────────────
const DrumVisual: React.FC = () => (
  <div className="bg-accent relative h-[220px] w-full sm:h-[260px] rounded-[12px] flex items-center justify-center gap-8">
    {/* 드럼통 */}
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-28 rounded-lg border-4 border-foreground/20 bg-background flex flex-col overflow-hidden shadow-inner">
        {/* 가득 찬 기름 */}
        <div className="absolute bottom-0 left-0 right-0 h-full bg-orange-200/60 dark:bg-orange-900/40" />
        {/* 200L 표시 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-lg text-orange-600 dark:text-orange-400">
            200L
          </span>
        </div>
        {/* 드럼 테두리 라인 */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-foreground/10" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-foreground/10" />
      </div>
      <span className="text-xs text-muted-foreground">한 드럼</span>
    </div>

    {/* 체크리스트 */}
    <div className="flex flex-col gap-2">
      {['기본 배달 단위', '가장 경제적', '당일 배송', '정량 100% 보장'].map(
        (item) => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-bold">✓</span>
            </div>
            <span className="text-xs text-foreground">{item}</span>
          </div>
        )
      )}
    </div>
  </div>
);

// ── 시각화: 소량 (반드럼 / 통) ───────────────────────────────────────────────
const SmallVisual: React.FC = () => (
  <div className="bg-accent relative h-[220px] w-full sm:h-[260px] rounded-[12px] flex items-center justify-center gap-8">
    {/* 반드럼 + 통 */}
    <div className="flex items-end gap-4">
      {/* 반드럼 */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-16 h-24 rounded-lg border-4 border-foreground/20 bg-background flex flex-col overflow-hidden shadow-inner">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-orange-200/60 dark:bg-orange-900/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono font-bold text-sm text-orange-600 dark:text-orange-400">
              100L
            </span>
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground/10" />
        </div>
        <span className="text-xs text-muted-foreground">반 드럼</span>
      </div>

      <span className="text-muted-foreground text-sm mb-8">or</span>

      {/* 통 배달 */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-10 h-14 rounded-md border-4 border-foreground/20 bg-background flex items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-orange-200/60 dark:bg-orange-900/40" />
          <span className="relative font-mono font-bold text-[10px] text-orange-600 dark:text-orange-400">
            통
          </span>
        </div>
        <span className="text-xs text-muted-foreground">통 배달</span>
      </div>
    </div>

    {/* 안내 */}
    <div className="flex flex-col gap-2">
      {['반 드럼 100L', '통 단위 소량', '사무실 · 가정', '특별 주문 가능'].map(
        (item) => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
              <span className="text-muted-foreground text-[9px] font-bold">
                ✓
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{item}</span>
          </div>
        )
      )}
    </div>
  </div>
);

// ── 메인 섹션 ─────────────────────────────────────────────────────────────────
export const OrderOptionsSection: React.FC = () => {
  return (
    <section id="order-options" className="bg-background px-6 lg:px-0">
      <div className="container px-0 py-16 sm:py-20 md:px-6 md:py-28">
        {/* 섹션 헤더 */}
        <p className="text-muted-foreground mb-4 text-center text-sm sm:text-base">
          배달 옵션
        </p>
        <h2 className="text-foreground mx-auto max-w-3xl text-center text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          필요한 만큼만
          <br className="hidden sm:block" />
          선택하세요
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-base sm:text-lg">
          한 드럼(200L) 기준 배달이 기본입니다. 소량이 필요하신 경우 반 드럼
          또는 통 단위 특별 주문도 가능합니다.
        </p>

        {/* 카드 그리드 */}
        <div className="mt-12 md:mt-14 flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-stretch">
          {/* 주류: 한 드럼 200L */}
          <div className="lg:flex-1">
            <div className="bg-card border-border relative flex flex-col rounded-[16px] border-2 border-orange-300 dark:border-orange-700 p-6 text-left shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)] h-full">
              {/* 추천 뱃지 */}
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-orange-500 hover:bg-orange-500 text-white border-0 text-xs">
                  기본 · 추천
                </Badge>
              </div>

              <h3 className="text-foreground text-xl font-medium sm:text-2xl">
                한 드럼 배달
              </h3>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                200리터 단위 기본 배달입니다. 가장 경제적인 단가로 당일
                배송됩니다.
              </p>

              <div className="relative mt-6 w-full overflow-hidden rounded-[12px]">
                <DrumVisual />
              </div>

              <div className="mt-6">
                <Button asChild className="w-full" size="lg">
                  <Link to="/order">지금 주문하기</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* 특별 옵션: 소량 배달 */}
          <div className="lg:w-[420px]">
            <div className="bg-card border-border relative flex flex-col rounded-[16px] border p-6 text-left shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)] h-full">
              {/* 특별 옵션 뱃지 */}
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  특별 옵션
                </Badge>
              </div>

              <h3 className="text-foreground text-xl font-medium sm:text-2xl">
                소량 배달
              </h3>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                반 드럼(100L) 또는 통 단위 소량 배달입니다. 사무실·가정집 소량
                주문 시 이용하세요.
              </p>

              <div className="relative mt-6 w-full overflow-hidden rounded-[12px]">
                <SmallVisual />
              </div>

              {/* 소량 주의 안내 */}
              <p className="mt-4 text-xs text-muted-foreground bg-muted rounded-lg px-4 py-3 leading-relaxed">
                소량 배달은 배달 가능 여부 및 일정이 상이할 수 있습니다. 주문 전
                문의를 권장합니다.
              </p>

              <div className="mt-4">
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link to="/contact">소량 주문 문의</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
