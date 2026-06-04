import React from 'react';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import { Flame, Compass, Anchor, Heart } from 'lucide-react';

const CORE_VALUES = [
  {
    icon: Compass,
    title: '고객이 향하는 곳이 우리의 방향입니다',
    description:
      '고객의 목소리를 나침반 삼아 움직입니다. 불편함을 먼저 알아채고, 기대보다 한 발 앞서 행동합니다.',
  },
  {
    icon: Flame,
    title: '어제의 정답을 의심하는 것이 혁신의 시작입니다',
    description:
      '익숙한 방식에 안주하지 않습니다. 더 나은 길이 있다면 기꺼이 지금의 방법을 버릴 용기를 가집니다.',
  },
  {
    icon: Anchor,
    title: '원칙은 흔들려도 포기하지 않는 것입니다',
    description:
      '빠른 이익보다 올바른 과정을 선택합니다. 순간의 유혹 앞에서도 미래를 담보로 잡지 않겠습니다.',
  },
  {
    icon: Heart,
    title: '함께 성장하는 것이 진짜 성공입니다',
    description:
      '구성원, 고객, 지역사회가 함께 나아갈 때 비로소 의미 있는 성장이라 믿습니다.',
  },
] as const;

export const PhilosophyPage: React.FC = () => {
  return (
    <AboutLayout title="핵심가치" subtitle="스타코엑스가 흔들리지 않는 이유">
      <div className="space-y-16">
        {/* 슬로건 — values.tsx SectionHeader 역할 */}
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
            2003년부터 지켜온 이 한 문장이 스타코엑스의 모든 결정의 기준입니다.
          </p>
        </section>

        {/* 핵심가치 목록 — values.tsx grid 패턴 */}
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
