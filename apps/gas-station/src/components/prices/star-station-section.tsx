import React from 'react';
import { StationDetail } from '@/components/prices/components/station-detail';

export const StarStationSection: React.FC = () => {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container overflow-hidden py-12 md:py-20">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            별표주유소 정보
          </h2>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm overflow-hidden">
          <StationDetail />
        </div>
      </div>
    </section>
  );
};
