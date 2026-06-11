import React from 'react';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import { Flame, Compass, Anchor, Heart } from 'lucide-react';

const CORE_VALUES = [
  {
    icon: Compass,
    title: '고객이 향하는 곳이 우리의 방향입니다',
    description:
      '별표주유소·세차·카케어·배달 모든 접점에서 고객의 불편함을 먼저 알아채고, 기대보다 한 발 앞서 행동합니다.',
  },
  {
    icon: Flame,
    title: '어제의 정답을 의심하는 것이 혁신의 시작입니다',
    description:
      '2003년 주유소 단일 사업에서 세차·카케어·배달까지 확장해온 것처럼, 더 나은 길이 있다면 지금의 방식을 기꺼이 바꿉니다.',
  },
  {
    icon: Anchor,
    title: '원칙은 흔들려도 포기하지 않는 것입니다',
    description:
      '빠른 이익보다 올바른 과정을 선택합니다. 개인정보 보호, 가격 정직성, 서비스 품질 — 어떤 유혹 앞에서도 미래를 담보로 잡지 않겠습니다.',
  },
  {
    icon: Heart,
    title: '함께 성장하는 것이 진짜 성공입니다',
    description:
      '구성원, 고객, 제주 지역사회가 함께 나아갈 때 비로소 의미 있는 성장이라 믿습니다. 스타코엑스·별표주유소·제라게카케어가 한 방향을 바라보는 이유입니다.',
  },
] as const;

export const PhilosophyPage: React.FC = () => {
  return (
    <AboutLayout title="핵심가치" subtitle="스타코엑스가 흔들리지 않는 이유">
      <div className="space-y-16">
        {/* 슬로건 — 보존 */}
        <section className="border-b pb-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Heart className="w-4 h-4" />
            <span>We live by</span>
          </div>
          <h2 className="text-[2rem] leading-[1.2] tracking-[-1.6px] md:text-[2.75rem] md:tracking-[-2px] font-bold">
            순간의 이익을 위해
            <br />
            <span className="text-primary">미래를 팔지 않겠습니다</span>
          </h2>
          <p className="text-muted-foreground mt-4 tracking-[-0.32px]">
            2003년 별표주유소 창업부터 지켜온 이 한 문장이 스타코엑스의 모든
            결정의 기준입니다. 주유·세차·카케어·배달 어느 사업에서도 예외는
            없습니다.
          </p>
        </section>

        {/* 핵심가치 목록 */}
        <section className="grid gap-8 sm:grid-cols-2">
          {CORE_VALUES.map((value, index) => {
            const Icon = value.icon;
            return (
              <div className="flex gap-2.5" key={index}>
                <Icon className="mt-0.5 size-[18px] shrink-0" />
                <div>
                  <h3 className="text-lg !leading-none tracking-[-0.96px] lg:text-xl">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground mt-2.5 text-sm tracking-[-0.36px]">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </AboutLayout>
  );
};
