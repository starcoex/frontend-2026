import React from 'react';

import { APP_CONFIG } from '../config/app.config';
import { PageHead } from '@starcoex-frontend/common';
import { ServicesSection } from '@/components/sections/home/services-section';

export const ServicesPage: React.FC = () => {
  return (
    <>
      <PageHead
        title="서비스 안내 - 별표주유소"
        description="24시간 연료 공급, 스마트 결제, 정비 서비스, 편의점까지. 별표주유소의 모든 서비스를 확인하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/services`}
      />

      <div className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white futuristic mb-4">
            별표주유소 서비스
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            고품질 연료 공급부터 편의 서비스까지, 고객의 모든 요구를 충족하는
            통합 서비스를 제공합니다
          </p>
        </div>

        <ServicesSection />
      </div>
    </>
  );
};
