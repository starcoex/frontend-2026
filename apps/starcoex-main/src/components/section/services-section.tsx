import React from 'react';
import { Layers } from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import ServicesGrid from '@/components/section/components/services-grid';

const ServicesSection: React.FC = () => {
  return (
    <section className="">
      <div className="border-y">
        <SectionHeader
          iconTitle="통합 서비스 플랫폼"
          title="모든 서비스를 한눈에"
          icon={Layers}
          description={
            <>
              포털에서 서비스를 살펴보고,{' '}
              <strong className="text-primary">전용 앱에서 실제 이용</strong>
              하세요.
              <br />한 번 가입으로 모든 서비스가 자동으로 연결됩니다.
            </>
          }
        />
      </div>

      <div className="container border-x lg:!px-0">
        <ServicesGrid />
      </div>

      <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export default ServicesSection;
