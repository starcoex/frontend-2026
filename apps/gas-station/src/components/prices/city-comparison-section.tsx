import React from 'react';
import JejuCityComparison from '@/components/prices/components/jeju-comparison';

export const CityComparisonSection: React.FC = () => {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container flex flex-col justify-center gap-8 overflow-hidden py-12 md:py-32">
        {/* 1. 상단 타이틀 */}
        <div className="text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            제주시 서귀포시 <span className="text-primary">가격 비교</span>
          </h2>
        </div>
        <JejuCityComparison />
      </div>
    </section>
  );
};
