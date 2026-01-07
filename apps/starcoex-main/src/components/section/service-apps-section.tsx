import { Smartphone } from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import ServiceAppsList from '@/components/section/components/service-apps-list';

const ServiceAppsSection = () => {
  return (
    <section className="">
      <div className="border-b">
        <SectionHeader
          iconTitle="하이브리드 서비스 앱"
          title="각 서비스별 전용 앱"
          icon={Smartphone}
          description={
            '포털 가입 후 각 서비스의 전용 앱에서 자동 로그인으로 더욱 편리하게 이용하세요'
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
