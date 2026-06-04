import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initial: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      '"다른 곳은 200리터 주문하면 항상 조금씩 부족한 느낌이었는데, 별표주유소는 미터기를 직접 보여주면서 정확히 200리터를 채워줬습니다. 이런 곳을 진작 알았으면 좋았을 텐데요."',
    name: '김○○',
    role: '단독주택 거주, 서울 노원구',
    initial: '김',
  },
  {
    quote:
      '"전화 한 통 없이 앱에서 주문하고 기사님 위치까지 실시간으로 확인했습니다. 배달 오시기 전에 미리 준비할 수 있어서 너무 편리했어요."',
    name: '박○○',
    role: '빌라 관리인, 경기 의정부시',
    initial: '박',
  },
  {
    quote:
      '"겨울 성수기에 다른 업체는 연락도 잘 안 됐는데 별표주유소는 당일 배송이 됐습니다. 급하게 필요할 때 정말 믿을 수 있는 곳입니다."',
    name: '이○○',
    role: '소규모 공장 운영, 경기 남양주시',
    initial: '이',
  },
  {
    quote:
      '"15리터 통 배달도 된다고 해서 반신반의했는데 실제로 소량도 정성껏 배달해 주셨습니다. 혼자 사는 어머니 댁에 부탁드리기 딱 좋았어요."',
    name: '최○○',
    role: '가정집 이용 고객, 서울 도봉구',
    initial: '최',
  },
  {
    quote:
      '"아파트 전체 공동구매를 진행했는데 단가도 맞춰주시고 한 번에 깔끔하게 처리해 주셨어요. 입주민들 반응이 아주 좋았습니다."',
    name: '정○○',
    role: '아파트 입주자 대표, 경기 구리시',
    initial: '정',
  },
  {
    quote:
      '"영수증에 나온 금액, 리터, 단가가 딱딱 맞아서 처음엔 제가 잘못 본 줄 알았어요. 이게 당연한 건데 이걸 지켜주는 곳이 별로 없더라고요."',
    name: '윤○○',
    role: '음식점 운영, 서울 중랑구',
    initial: '윤',
  },
  {
    quote:
      '"웹으로 주문하고 문자로 배송 알림까지 와서 따로 전화할 필요가 없었습니다. 바쁜 직장인한테 딱 맞는 서비스예요."',
    name: '강○○',
    role: '직장인, 경기 포천시',
    initial: '강',
  },
  {
    quote:
      '"작년부터 계속 이용하고 있는데 단 한 번도 정량 문제나 배송 지연이 없었습니다. 주변 이웃들에게도 적극 추천하고 있어요."',
    name: '조○○',
    role: '다가구주택 거주, 경기 양주시',
    initial: '조',
  },
  {
    quote:
      '"반 드럼(100리터) 주문도 흔쾌히 받아주셔서 감사했습니다. 보일러 용량이 작아서 항상 소량만 필요했는데 딱 맞게 해결됐어요."',
    name: '임○○',
    role: '빌라 거주, 서울 강북구',
    initial: '임',
  },
];

function Card({ t }: { t: Testimonial }) {
  return (
    <li className="bg-card flex flex-col justify-between rounded-[16px] p-6">
      <p className="text-foreground text-base leading-relaxed font-normal">
        {t.quote}
      </p>
      <div className="mt-6 flex items-center gap-3">
        {/* 아바타 이니셜 */}
        <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 flex items-center justify-center shrink-0">
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
            {t.initial}
          </span>
        </div>
        <div>
          <div className="text-foreground mb-0.5 text-base leading-tight font-medium">
            {t.name}
          </div>
          <div className="text-muted-foreground text-sm font-normal">
            {t.role}
          </div>
        </div>
      </div>
    </li>
  );
}

export const TestimonialsSection: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const VISIBLE = expanded ? TESTIMONIALS.length : 6;

  return (
    <section id="testimonials" className="bg-accent px-6 lg:px-0">
      <div className="container px-0 py-16 sm:py-20 md:px-6 md:py-28">
        {/* 섹션 헤더 */}
        <p className="text-muted-foreground mb-4 text-center text-sm leading-tight font-normal sm:text-base">
          고객 후기
        </p>
        <h2 className="text-foreground mx-auto max-w-4xl text-center text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          실제 고객님들의
          <br className="hidden sm:block" />
          생생한 이야기
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-base font-normal sm:text-lg">
          정량 보장과 실시간 배송 추적을 직접 경험한 고객님들의 후기입니다.
        </p>

        {/* 카드 그리드 */}
        <div className="relative mt-10 md:mt-14">
          {!expanded && (
            <div className="from-accent to-accent/0 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t" />
          )}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.slice(0, VISIBLE).map((t, i) => (
              <Card key={i} t={t} />
            ))}
          </ul>
        </div>

        {/* 더보기 버튼 */}
        <div
          className={`relative z-20 flex justify-center transition-all duration-300 ${
            expanded ? 'mt-8' : '-mt-6'
          }`}
        >
          <Button variant="outline" onClick={() => setExpanded((s) => !s)}>
            {expanded ? '접기' : '후기 더 보기'}
          </Button>
        </div>
      </div>
    </section>
  );
};
