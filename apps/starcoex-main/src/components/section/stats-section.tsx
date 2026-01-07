import { BarChart3 } from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import StatsList from '@/components/section/components/stats-list';

export const StatsSection = () => {
  return (
    <section id="stats-performance" className="">
      <div className="border-b">
        <SectionHeader
          iconTitle="성과 지표"
          title="숫자로 보는 스타코엑스"
          icon={BarChart3}
          description={
            '하이브리드 서비스 플랫폼의 성과와 고객 만족도를 확인하세요'
          }
        />
      </div>

      <div className="container border-x lg:!px-0">
        <StatsList />
      </div>

      <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};
