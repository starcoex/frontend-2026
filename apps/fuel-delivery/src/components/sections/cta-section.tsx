import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CtaSection: React.FC = () => {
  return (
    <section id="cta" className="bg-orange-500 relative overflow-hidden px-6">
      {/* 도트 패턴 배경 */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[size:16px_16px] text-white opacity-20" />

      {/* 중앙 직사각형 — 텍스트 뒤 강조 */}
      <div className="bg-orange-500 pointer-events-none absolute top-0 left-1/2 h-full w-[500px] -translate-x-1/2" />

      <div className="relative container px-0 py-16 text-center sm:py-20 md:px-6 md:py-28">
        {/* 신뢰 지표 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white font-medium">
            ✓ 정량 100% 보장
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white font-medium">
            🚚 당일 배송
          </span>
        </div>

        {/* 헤드라인 */}
        <h2 className="text-white mx-auto max-w-5xl text-4xl leading-tight font-medium text-balance sm:text-5xl md:text-6xl">
          속지 않는 난방유 배달,
          <br className="hidden sm:block" />
          지금 바로 시작하세요
        </h2>

        {/* 서브카피 */}
        <p className="text-white/80 mx-auto mt-4 max-w-2xl text-base font-normal sm:text-lg">
          전화 한 통 없이 웹에서 간편하게 주문하고 실시간으로 배송을 추적하세요.
          별표주유소는 주문한 만큼 정확하게 배달합니다.
        </p>

        {/* CTA 버튼 */}
        <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            className="bg-white text-orange-500 hover:bg-white/90 h-12 w-full rounded-[12px] sm:w-auto font-semibold text-base"
          >
            <Link to="/order">지금 주문하기</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="border-white/30 text-white hover:bg-white/10 h-12 w-full rounded-[12px] border bg-transparent sm:w-auto text-base"
          >
            <Link to="/tracking">배송 추적하기</Link>
          </Button>
        </div>

        {/* 하단 안심 문구 */}
        <p className="text-white/60 mt-8 text-sm">
          서울 · 경기 지역 당일 배송 &nbsp;·&nbsp; 오후 2시 전 주문 마감
          &nbsp;·&nbsp; 문의 702-5144
        </p>
      </div>
    </section>
  );
};
