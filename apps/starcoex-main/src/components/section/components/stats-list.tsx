import { Star, Users, Award, Clock, LayoutGrid } from 'lucide-react';
import { COMPANY_INFO } from '@/app/config/company.config';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

const STATS_ICONS = {
  customers: Users,
  years: Award,
  washTime: Clock,
  services: LayoutGrid,
} as const;

const STATS_DATA = COMPANY_INFO.stats.map((stat) => {
  const coreMessages = {
    customers: {
      title: '검증된 신뢰',
      subtitle: '많은 고객들이 선택한 서비스',
    },
    years: {
      title: '축적된 경험',
      subtitle: '지속적인 성장과 발전',
    },
    washTime: {
      title: '빠른 손세차',
      subtitle: '8~15분 완성 외부 손세차',
    },
    services: {
      title: '다양한 서비스',
      subtitle: '주유 · 손세차 · 난방유 배달',
    },
  };

  const fallback = { title: stat.label, subtitle: '' };
  const message =
    coreMessages[stat.key as keyof typeof coreMessages] ?? fallback;

  return {
    title: stat.label,
    coreTitle: message.title,
    subtitle: message.subtitle,
    icon: STATS_ICONS[stat.key as keyof typeof STATS_ICONS] ?? Star,
    value: stat.value,
    key: stat.key,
  };
});

const StatsList = () => {
  return (
    <div className="py-16 bg-gradient-to-b">
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_DATA.map((item) => {
            const Icon = item.icon;
            const isHighlight =
              item.key === 'washTime' || item.key === 'services';

            return (
              <Card
                key={item.key}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer hover:-translate-y-2"
              >
                <CardContent className="p-6 h-full flex flex-col text-center">
                  {/* 아이콘 */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-lg transition-transform group-hover:scale-110 ${
                        isHighlight
                          ? 'bg-purple-100 dark:bg-purple-900/20'
                          : 'bg-blue-100 dark:bg-blue-900/20'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isHighlight ? 'text-purple-600' : 'text-blue-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 숫자 */}
                  <div
                    className={`text-4xl font-bold mb-2 ${
                      isHighlight ? 'text-purple-600' : 'text-blue-600'
                    }`}
                  >
                    {item.value}
                  </div>

                  {/* 제목 */}
                  <CardTitle className="text-lg font-semibold mb-2">
                    {item.title}
                  </CardTitle>

                  {/* 부제목 */}
                  <CardDescription className="text-muted-foreground text-sm">
                    {item.subtitle}
                  </CardDescription>

                  {/* 핵심 메시지 */}
                  <div className="mt-auto">
                    <div
                      className={`text-sm font-medium ${
                        isHighlight ? 'text-purple-600' : 'text-blue-600'
                      }`}
                    >
                      {item.coreTitle}
                    </div>
                    {item.key === 'services' && (
                      <div className="text-xs text-purple-600 mt-1">
                        세차전용카드 혜택
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsList;
