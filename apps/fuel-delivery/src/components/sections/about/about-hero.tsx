import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AboutHero: React.FC = () => {
  return (
    <section id="about-hero" className="bg-background px-6 lg:px-0">
      <div className="container px-0 md:px-6">
        <div className="relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 py-14 text-center sm:px-8 sm:py-18 md:py-20">
            <p className="text-muted-foreground text-sm sm:text-base">
              회사 소개
            </p>
            <h1 className="text-foreground mt-4 text-4xl leading-tight font-medium tracking-tight text-balance sm:text-5xl md:text-[68px]">
              별표주유소를
              <br className="hidden sm:block" />
              소개합니다
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
              수십 년간 지역 주민과 함께한 별표주유소. 이제 디지털 기술로 정량
              보장 난방유 배달 서비스를 제공합니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/order">지금 주문하기</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/contact">문의하기</Link>
              </Button>
            </div>
          </div>

          {/* 이미지 대체 — 브랜드 카드 */}
          <div className="px-6 sm:px-8">
            <div className="bg-card border-border mx-auto max-w-5xl overflow-hidden rounded-t-sm border md:rounded-t-[12px]">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 h-[280px] md:h-[360px] flex items-center justify-center gap-8 md:gap-16 px-8">
                {[
                  { emoji: '⛽', label: '정량 보장' },
                  { emoji: '🚚', label: '당일 배송' },
                  { emoji: '📍', label: '실시간 추적' },
                  { emoji: '🤝', label: '신뢰 거래' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-background shadow-sm border border-border flex items-center justify-center text-3xl md:text-4xl">
                      {item.emoji}
                    </div>
                    <span className="text-sm md:text-base font-medium text-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-6 sm:h-8" />
      </div>
    </section>
  );
};
