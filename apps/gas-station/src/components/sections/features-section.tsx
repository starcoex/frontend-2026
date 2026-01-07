import React from 'react';
import {
  Clock,
  DollarSign,
  Shield,
  Award,
  MapPin,
  Users,
  Zap,
  Heart,
} from 'lucide-react';

// 1. 운영 통계 상수 정의
const OPERATING_STATS = {
  years: '10+',
  monthlyCustomers: '50,000+',
  satisfaction: '99.9%',
  uptime: '24/7',
};

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  stats?: string;
}

const features: Feature[] = [
  {
    id: 'always-open',
    title: '24시간 운영',
    description:
      '365일 24시간, 언제나 깨어있는 서비스로 고객님의 여정을 든든하게 지원합니다.',
    icon: <Clock className="w-8 h-8" />,
    gradient: 'from-blue-500 to-cyan-500',
    stats: OPERATING_STATS.uptime, // 상수 사용
  },
  {
    id: 'competitive-price',
    title: '합리적인 가격',
    description:
      '제주도 내 최적의 유통 구조를 통해 거품 없는 정직한 가격을 약속드립니다.',
    icon: <DollarSign className="w-8 h-8" />,
    gradient: 'from-green-500 to-emerald-500',
    stats: '최저가 지향',
  },
  {
    id: 'premium-fuels',
    title: '프리미엄 연료',
    description:
      '엄격한 품질 검사를 통과한 정품 정량의 고품질 연료만을 고집합니다.',
    icon: <Award className="w-8 h-8" />,
    gradient: 'from-yellow-500 to-orange-500',
    stats: '정품 정량',
  },
  {
    id: 'safety-first',
    title: '안전 최우선',
    description:
      '최신 소방 설비와 정기적인 안전 점검으로 고객님의 안전을 빈틈없이 지킵니다.',
    icon: <Shield className="w-8 h-8" />,
    gradient: 'from-red-500 to-pink-500',
    stats: '무사고 운영',
  },
  {
    id: 'convenient-location',
    title: '최적의 입지',
    description:
      '제주 주요 도로변에 위치하여 접근이 용이하고 넓은 진출입로를 확보했습니다.',
    icon: <MapPin className="w-8 h-8" />,
    gradient: 'from-purple-500 to-indigo-500',
    stats: '넓은 진입로',
  },
  {
    id: 'friendly-service',
    title: '진심 어린 서비스',
    description:
      '숙련된 직원들이 가족을 대하는 마음으로 친절하고 세심하게 모십니다.',
    icon: <Heart className="w-8 h-8" />,
    gradient: 'from-pink-500 to-rose-500',
    stats: '고객 감동',
  },
  {
    id: 'fast-service',
    title: '신속한 케어',
    description:
      '최신 주유 설비와 효율적인 동선 설계로 대기 시간을 최소화했습니다.',
    icon: <Zap className="w-8 h-8" />,
    gradient: 'from-cyan-500 to-blue-500',
    stats: '쾌속 주유',
  },
  {
    id: 'trusted-brand',
    title: '신뢰받는 브랜드',
    description:
      '순간의 이익을 위해 미래를 팔지 않겠다는 신념으로 쌓아온 신뢰입니다.', // 문구 수정 반영
    icon: <Users className="w-8 h-8" />,
    gradient: 'from-indigo-500 to-purple-500',
    stats: `${OPERATING_STATS.years} 운영`, // 상수 사용
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="border-dark-gray bg-jet container flex flex-col items-center justify-center gap-8 overflow-hidden py-12 text-center md:py-20">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-foreground text-3xl tracking-tight sm:text-4xl md:text-5xl mb-4">
            왜 별표주유소인가요?
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            제주도 최고의 주유소가 되기 위한 우리의 약속과 차별화된 가치를
            확인해보세요
          </p>
        </div>

        {/* 특징 그리드 */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`bg-background rounded-sm p-6 lg:rounded-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden ${
                index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-4'
              }`}
            >
              {/* 배경 그라데이션 효과 */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* 아이콘과 통계 */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-full bg-gradient-to-r ${feature.gradient} text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  {feature.stats && (
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                      >
                        {feature.stats}
                      </div>
                    </div>
                  )}
                </div>

                {/* 제목과 설명 */}
                <div className="flex-grow">
                  <h3 className="text-foreground text-lg lg:text-xl font-semibold mb-3 group-hover:text-accent-foreground transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* 호버 시 나타나는 강조 효과 */}
                <div
                  className={`mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 통계 섹션 - 상수 데이터 연결 */}
        <div className="mt-16 lg:mt-20 p-8 lg:p-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">
                {OPERATING_STATS.years}
              </div>
              <div className="text-muted-foreground text-sm lg:text-base">
                운영 연수
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">
                {OPERATING_STATS.monthlyCustomers}
              </div>
              <div className="text-muted-foreground text-sm lg:text-base">
                월간 고객 수
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">
                {OPERATING_STATS.satisfaction}
              </div>
              <div className="text-muted-foreground text-sm lg:text-base">
                고객 만족도
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl lg:text-4xl font-bold text-foreground">
                {OPERATING_STATS.uptime}
              </div>
              <div className="text-muted-foreground text-sm lg:text-base">
                무중단 운영
              </div>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="text-center mt-12 lg:mt-16">
          <h3 className="text-foreground text-2xl lg:text-3xl font-semibold mb-4">
            순간의 이익을 위해 미래를 팔지 않겠습니다
          </h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            정직한 품질과 진심 어린 서비스로 고객님의 신뢰에 보답하겠습니다
          </p>
        </div>
      </div>
    </section>
  );
};
