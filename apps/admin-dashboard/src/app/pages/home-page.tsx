import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import Home from '@/components/home';

export const HomePage = () => {
  return (
    <>
      <PageHead
        title={`${COMPANY_INFO.name} - 하이브리드 에너지 & 자동차 서비스`}
        description={`${COMPANY_INFO.description} 소셜 로그인으로 간편하게 가입하고 모든 서비스를 한번에 이용하세요.`}
        keywords={[
          '하이브리드 서비스',
          '통합 플랫폼',
          COMPANY_INFO.managedServices.gasStation.name,
          COMPANY_INFO.managedServices.carWash.name,
          COMPANY_INFO.managedServices.fuelDelivery.name,
          COMPANY_INFO.managedServices.zeragaeCare.name,
          '소셜 로그인',
          '자동 연결',
          COMPANY_INFO.name,
          COMPANY_INFO.nameEn,
        ]}
        og={{
          title: `${COMPANY_INFO.name} - 하이브리드 에너지 & 자동차 서비스`,
          description: `${COMPANY_INFO.description}`,
          image: '/images/og-hybrid-platform.jpg',
          type: 'website',
        }}
      />
      <Home />
    </>
  );
};
