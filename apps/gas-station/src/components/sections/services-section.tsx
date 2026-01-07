import React from 'react';
import { ArrowRight } from 'lucide-react';

// 서비스 ID 매핑
const serviceFeatures = [
  {
    id: 'premium-hand-wash',
    title: 'Premium Hand Wash',
    description:
      '독일산 pH 중성 프리미엄 세제와 스크래치 없는 100% 양모 미트를 사용합니다. 도장면의 손상을 최소화하며 오염물질만을 완벽하게 제거하는 고품격 핸드 워시를 경험하세요.',
    image:
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'detailing-polishing',
    title: 'Detailing & Polishing',
    description:
      '전문가의 섬세한 폴리싱으로 차량 본연의 깊은 광택을 되살립니다. 미세 스크래치 제거부터 고성능 코팅까지, 차량의 가치를 높이는 전문 디테일링 서비스입니다.',
    image:
      'https://images.unsplash.com/photo-1552930294-6b595f4c2974?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'interior-care',
    title: 'Interior Care',
    description:
      '눈에 보이지 않는 먼지와 세균까지 케어합니다. 휠 & 타이어 정밀 클리닝은 물론, 실내 향균 탈취 서비스를 통해 쾌적하고 안락한 드라이빙 환경을 제공합니다.',
    image:
      'https://images.unsplash.com/photo-1583203187768-36c82a59c9e3?q=80&w=800&auto=format&fit=crop',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container flex flex-col justify-center gap-8 overflow-hidden py-12 md:py-32">
        {/* 상단 헤더 */}
        <div className="lg:max-w-lg">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
            완벽한 디테일링을 위한
            <br />
            <span className="text-primary">전문가의 손길</span>
          </h2>
          <p className="text-muted-foreground mb-8 lg:text-lg">
            별표주유소만의 독보적인 세차 프로세스를 경험해보세요. 초고압 예비
            세척부터 꼼꼼한 폼건 미트질, 그리고 물기 없는 완벽한 드라잉까지.
            당신의 차가 출고 당시의 빛나는 모습으로 돌아갑니다.
          </p>
          <a
            href="/process"
            className="group flex items-center text-xs font-medium md:text-base lg:text-lg text-primary"
          >
            세차 프로세스 전체 보기{' '}
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* 서비스 목록 */}
        <div className="flex flex-col gap-12 lg:gap-24">
          {serviceFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className="grid items-center gap-8 md:grid-cols-2 lg:gap-12"
            >
              {/* 이미지 영역: 짝수는 왼쪽(order-1), 홀수는 오른쪽(order-2) */}
              <div className={index % 2 === 0 ? 'md:order-1' : 'md:order-2'}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="aspect-video w-full rounded-[2.5rem] object-cover shadow-xl"
                />
              </div>

              {/* 텍스트 영역: 짝수는 오른쪽(order-2), 홀수는 왼쪽(order-1) */}
              <div
                className={`flex flex-col justify-center ${
                  index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                }`}
              >
                <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground lg:text-lg mb-6">
                  {feature.description}
                </p>
                <a
                  href={`/services/${feature.id}`}
                  className="group flex items-center text-sm font-medium text-primary"
                >
                  자세히 보기{' '}
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
