import { Award, Clock, Shield, Star, TrendingDown, Zap } from 'lucide-react';

interface PurchaseBenefit {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  gradient: string;
  stats: string;
}

const BENEFITS: PurchaseBenefit[] = [
  {
    id: 'competitive-price',
    title: '합리적 가격',
    description:
      '투명한 가격 정보와 다양한 할인 혜택으로 경제적인 주유를 제공합니다.',
    icon: <TrendingDown className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-500',
    stats: '평균 5% 절약',
  },
  {
    id: 'instant-discount',
    title: '즉시 할인',
    description: '복잡한 절차 없이 주유 즉시 할인 혜택을 받으실 수 있습니다.',
    icon: <Clock className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-500',
    stats: '0초 대기시간',
  },
  {
    id: 'quality-assurance',
    title: '품질 보증',
    description: '엄격한 품질 관리를 통해 최고 품질의 연료만을 공급합니다.',
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-purple-500 to-indigo-500',
    stats: '99.9% 순도',
  },
  {
    id: 'loyalty-rewards',
    title: '적립 혜택',
    description:
      '주유할 때마다 포인트가 적립되어 다음 주유 시 할인받으실 수 있습니다.',
    icon: <Star className="w-6 h-6" />,
    gradient: 'from-yellow-500 to-orange-500',
    stats: '최대 3% 적립',
  },
  {
    id: 'fast-service',
    title: '빠른 서비스',
    description:
      '최신 주유 시설과 효율적인 시스템으로 빠른 주유 서비스를 제공합니다.',
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-red-500 to-pink-500',
    stats: '평균 3분 완료',
  },
  {
    id: 'premium-service',
    title: 'VIP 서비스',
    description: '멤버십 회원을 위한 특별한 서비스와 우대 혜택을 제공합니다.',
    icon: <Award className="w-6 h-6" />,
    gradient: 'from-amber-500 to-yellow-500',
    stats: '전용 라인 이용',
  },
];

export const BenefitsSection: React.FC = () => (
  <div className="bg-muted/30 py-16 lg:py-24 border-t">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">구매 혜택</h2>
        <p className="text-muted-foreground">
          별표주유소만의 특별한 혜택을 만나보세요
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.id}
            className="group p-6 rounded-lg bg-background border shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-full bg-gradient-to-r ${benefit.gradient} text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
              >
                {benefit.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">
                    {benefit.title}
                  </h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {benefit.stats}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
