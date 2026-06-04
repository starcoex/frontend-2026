import { Smartphone } from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import ServiceAppsList from '@/components/section/components/service-apps-list';

const ServiceAppsSection = () => {
  return (
    <section className="">
      <div className="border-b">
        <SectionHeader
          iconTitle="전용 앱 준비중"
          title="각 서비스별 전용 앱을 준비하고 있습니다"
          icon={Smartphone}
          description={
            '별표주유소·제라게 외부 손세차·난방유 배달 전용 앱을 준비 중입니다. 출시 전까지는 매장 방문 또는 전화(064-713-2002)로 편리하게 이용하세요.'
          }
        />
      </div>

      <div className="container border-x lg:!px-0">
        <ServiceAppsList />
      </div>

      <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export default ServiceAppsSection;
