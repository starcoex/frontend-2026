import { Building2, MapPin, Users, Shield } from 'lucide-react';

const COMPANY_INFO = [
  {
    icon: Building2,
    title: '설립',
    description: '2003년 별표 석유로 시작',
    details: '작은 석유 공급업에서 현대적 주유소로 성장',
  },
  {
    icon: MapPin,
    title: '위치',
    description: '제주 연삼로 주유소',
    details: '2011년 현재 위치로 이전하여 운영',
  },
  {
    icon: Users,
    title: '서비스',
    description: '고객 중심 서비스',
    details: '20년 경험을 바탕으로 한 신뢰할 수 있는 서비스',
  },
  {
    icon: Shield,
    title: '안전',
    description: '친환경 안전 관리',
    details: '제주 자연환경을 생각하는 안전한 주유소',
  },
];

export default function GasStationValuesSection() {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container p-0">
        <div className="border-b-dark-gray border-l-dark-gray border-r-dark-gray flex flex-col gap-8 overflow-hidden border-r border-b border-l px-6 py-12 md:px-16 md:py-20 md:pt-32">
          <div className="max-w-xl">
            <h1 className="text-foreground mb-2.5 text-3xl tracking-tight md:text-5xl">
              별표 주유소의 가치
            </h1>
            <p className="font-inter-tight text-mid-gray text-base">
              20여 년간 제주도와 함께 성장해온 별표 주유소는 고객의 안전과
              편의를 최우선으로 생각합니다.
            </p>
          </div>
        </div>

        <div className="border-b-dark-gray border-l-dark-gray border-r-dark-gray gap-0 border-r border-b border-l">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {COMPANY_INFO.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className={`border-r-dark-gray p-6 md:p-8 ${
                    index < COMPANY_INFO.length - 1 ? 'border-r' : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-foreground text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-foreground font-medium mb-3">
                    {item.description}
                  </p>
                  <p className="text-mid-gray text-sm">{item.details}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
