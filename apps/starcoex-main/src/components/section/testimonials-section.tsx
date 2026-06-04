import { Handshake, Star, CheckCircle } from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import { Card, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    quote:
      '반짝반짝 외부 손세차 받았는데 15분 만에 차가 새 차처럼 깨끗해졌어요! 휠세척이랑 온수고압세척까지 꼼꼼하게 해주셔서 만족스럽습니다.',
    author: {
      name: '김민수',
      role: '직장인 · 제주시',
      initialClass: 'bg-orange-100 text-orange-700',
    },
    services: ['🚗 반짝반짝 손세차'],
    verified: true,
    rating: 5,
  },
  {
    id: 2,
    quote:
      '겨울마다 난방유 배달 이용하는데 전화 한 통이면 빠르게 와주세요. 안전하게 채워주시고 응대도 친절해서 매년 단골로 쓰고 있습니다.',
    author: {
      name: '이지은',
      role: '주부 · 제주시',
      initialClass: 'bg-blue-100 text-blue-700',
    },
    services: ['🚛 난방유 배달'],
    verified: true,
    rating: 5,
  },
  {
    id: 3,
    quote:
      '주유 3만원 이상 하고 세차전용카드로 결제하니 적립 혜택이 쏠쏠하네요. 5만원 넣으면 59,000원 적립되니까 자주 오게 됩니다.',
    author: {
      name: '박준호',
      role: '자영업 · 제주시',
      initialClass: 'bg-green-100 text-green-700',
    },
    services: ['⛽ 별표주유소', '🚗 손세차'],
    verified: true,
    rating: 5,
  },
  {
    id: 4,
    quote:
      '바쁠 때는 기본 외부 손세차로 8~9분이면 끝나서 정말 편해요. 빠른데도 틈새까지 신경 써주셔서 가성비 최고입니다.',
    author: {
      name: '최서연',
      role: '대학생 · 제주시',
      initialClass: 'bg-rose-100 text-rose-700',
    },
    services: ['🚗 기본 손세차'],
    verified: true,
    rating: 4,
  },
  {
    id: 5,
    quote:
      '앞유리 유막제거 1만원에 해주셔서 비 오는 날 시야가 훨씬 좋아졌어요. 별표 외부 손세차의 코팅왹스 분사도 광이 오래갑니다.',
    author: {
      name: '정민아',
      role: '회사원 · 제주시',
      initialClass: 'bg-purple-100 text-purple-700',
    },
    services: ['🚗 별표 손세차'],
    verified: true,
    rating: 5,
  },
  {
    id: 6,
    quote:
      '회사 차량 여러 대를 정기적으로 맡기는데 SUV 대형도 가격이 합리적이에요. 작업 시간도 정확해서 운행 스케줄 짜기 편합니다.',
    author: {
      name: '한상철',
      role: '운송업 · 제주시',
      initialClass: 'bg-amber-100 text-amber-700',
    },
    services: ['⛽ 별표주유소', '🚗 손세차'],
    verified: true,
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="">
      <div className="border-b">
        <SectionHeader
          iconTitle="고객 후기"
          title="별표주유소와 제라게 손세차, 고객들의 생생한 후기"
          icon={Handshake}
          description="빠르고 꼼꼼한 외부 손세차와 합리적인 주유 혜택을 경험한 고객들의 이야기"
        />
      </div>

      <div className="container mt-10 grid gap-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>

      <div className="mt-12 h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

interface TestimonialProps {
  quote: string;
  author: {
    name: string;
    role: string;
    initialClass: string;
  };
  services: string[];
  verified: boolean;
  rating: number;
}

function TestimonialCard({
  quote,
  author,
  services,
  verified,
  rating,
}: TestimonialProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="bg-background flex flex-col gap-6 rounded-md p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">{renderStars(rating)}</div>
      </div>

      <div className="relative">
        <blockquote className="text-muted-foreground-subtle text-lg font-normal italic pl-4">
          {`"${quote}"`}
        </blockquote>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {services.map((service, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {service}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback className={author.initialClass}>
            {author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <CardDescription className="text-lg tracking-[-0.36px]">
              {author.name}
            </CardDescription>
            {verified && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          <CardDescription className="text-muted-foreground">
            {author.role}
          </CardDescription>
        </div>
      </div>
    </Card>
  );
}
