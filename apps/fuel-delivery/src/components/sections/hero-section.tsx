import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GridBackground } from '@/components/ui/grid-background';

export const DeliveryHero: React.FC = () => {
  return (
    <section
      id="delivery-hero"
      className="bg-background border-b-border relative overflow-hidden border-b px-6 lg:px-0"
    >
      {/* 배경 레이어 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 bottom-0 h-[530px] md:h-[686px]">
          <GridBackground className="[background-size:calc(var(--square-size,64px))_calc(var(--square-size,64px))]" />
          <div className="from-background to-background/0 absolute inset-x-0 top-0 h-40 bg-gradient-to-b" />
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative container px-0 md:px-6">
        <div className="mx-auto grid max-w-4xl gap-6 py-14 text-center sm:py-16 md:gap-8 md:pt-24 md:pb-20">
          {/* 상단 뱃지 */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
              ⛽ 별표주유소 공식 서비스
            </Badge>
          </div>

          {/* 헤드라인 */}
          <h1 className="text-foreground text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl md:text-[68px]">
            정량이 보장되는
            <br />
            난방유 배달 서비스
          </h1>

          {/* 서브 카피 — 정량 속임 문제 직접 언급 */}
          <p className="text-muted-foreground md:text-md mx-auto max-w-2xl text-base sm:text-lg">
            국내 난방유 시장의 고질적인 정량 속임 문제. 별표주유소는 디지털 계량
            시스템과 실시간 배송 추적으로
            <strong className="text-foreground">
              {' '}
              주문한 만큼 정확하게
            </strong>{' '}
            배달합니다.
          </p>

          {/* CTA 버튼 */}
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Button
              asChild
              className="w-full sm:w-auto"
              aria-label="지금 주문하기"
            >
              <Link to="/order">지금 주문하기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto"
              aria-label="배송 추적"
            >
              <Link to="/tracking">배송 추적</Link>
            </Button>
          </div>

          {/* 신뢰 지표 */}
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>✅</span>
              <span>디지털 계량 100% 검증</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>📍</span>
              <span>실시간 GPS 배송 추적</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>🚚</span>
              <span>당일 배송 (오후 2시 전 주문)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
