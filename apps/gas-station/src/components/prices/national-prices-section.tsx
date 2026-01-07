import React from 'react';
import { NationalFuelPrices } from '@/components/prices/components/national-fuel-prices';

export const NationalPricesSection: React.FC = () => {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container gap-8 overflow-hidden py-12 md:py-32">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            전국 주유소 가격
          </h2>
        </div>
        <NationalFuelPrices />
      </div>
    </section>
  );
};
