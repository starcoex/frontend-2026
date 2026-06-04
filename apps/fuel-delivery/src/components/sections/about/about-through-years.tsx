import React from 'react';

const STATS = [
  { value: '수십 년', label: '지역 영업 경력' },
  { value: '200L', label: '한 드럼 정량 보장' },
  { value: '당일', label: '서울·경기 배송' },
];

const PARAGRAPHS = [
  '별표주유소는 오랜 시간 지역 주민들과 함께해 온 신뢰할 수 있는 석유 판매 업체입니다. 수십 년간 쌓아온 경험을 바탕으로, 난방유 배달 시장의 고질적인 정량 속임 문제를 해결하고자 디지털 배달 서비스를 시작했습니다.',
  '주유미터기 0 확인, 금액·리터·단가 일치, 15리터 정량 통 확인창 — 별표주유소는 고객과의 신의를 정량 원칙에서 시작합니다. 웹 주문과 실시간 GPS 배송 추적으로 고객이 직접 확인할 수 있는 투명한 서비스를 제공합니다.',
];

export const AboutThroughYears: React.FC = () => {
  return (
    <section id="about-through-years" className="bg-background px-6 lg:px-0">
      <div className="container px-0 py-16 sm:py-20 md:px-6 md:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
          {/* 텍스트 + 스탯 */}
          <div>
            <p className="text-muted-foreground text-sm sm:text-base">
              별표주유소의 역사
            </p>
            <h2 className="text-foreground mt-4 text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
              신뢰를 증명하는
              <br />
              숫자들
            </h2>
            <div className="text-muted-foreground mt-5 space-y-4 text-base">
              {PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {STATS.map((s) => (
                <li key={s.value}>
                  <div className="bg-card border-border shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)] rounded-[12px] border p-5">
                    <div className="text-orange-500 dark:text-orange-400 text-2xl font-medium sm:text-[28px]">
                      {s.value}
                    </div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {s.label}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 정량 보장 시각화 카드 */}
          <div className="bg-accent overflow-hidden rounded-[16px]">
            <div className="p-8 space-y-4">
              <p className="text-sm text-muted-foreground font-medium">
                별표주유소와 고객과의 신의
              </p>
              <h3 className="text-foreground text-xl font-medium leading-snug">
                정량원칙에서 출발합니다
              </h3>

              {/* 정량 체크 3단계 */}
              {[
                {
                  step: '01',
                  title: '잔량 확인',
                  desc: '가로 × 세로 × 높이로 탱크 잔량을 직접 측정',
                },
                {
                  step: '02',
                  title: '미터기 0 확인',
                  desc: '주유미터기가 반드시 0부터 시작하는지 확인',
                },
                {
                  step: '03',
                  title: '영수증 대조',
                  desc: '금액 · 리터 · 단가 세 가지가 정확히 일치',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 bg-card rounded-[12px] border border-border p-4"
                >
                  <div className="text-orange-500 dark:text-orange-400 font-mono font-bold text-lg shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block md:h-[60px]" />
          </div>
        </div>
      </div>
    </section>
  );
};
