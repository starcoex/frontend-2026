import { Handshake, Star, CheckCircle } from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import { Card, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    company: {
      name: '개인 사용자',
      logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format&q=80',
    },
    quote:
      '포털에서 가입했는데 주유소 앱이랑 세차 앱에서 바로 로그인되더라고요! 너무 편해요. 각 앱마다 또 가입할 필요 없어서 정말 좋습니다.',
    author: {
      name: '김민수',
      role: '직장인, 개인 사용자',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format&q=80',
    },
    services: ['⛽ 주유소', '🚗 세차'],
    verified: true,
    rating: 5,
  },
  {
    id: 2,
    company: {
      name: '개인 사용자',
      logo: 'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=100&h=100&fit=crop&auto=format&q=80',
    },
    quote:
      '난방유 주문하려고 앱 깔았는데 이미 로그인되어 있어서 깜짝 놀랐어요. 카카오로 한 번만 가입했는데 모든 서비스를 쓸 수 있어서 신기했습니다!',
    author: {
      name: '이지은',
      role: '주부, 개인 사용자',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b602?w=100&h=100&fit=crop&auto=format&q=80',
    },
    services: ['🚛 난방유배달'],
    verified: true,
    rating: 4,
  },
  {
    id: 3,
    company: {
      name: '자영업자',
      logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&auto=format&q=80',
    },
    quote:
      '세차 예약부터 주유까지 모든 앱에서 같은 계정으로 쓸 수 있어서 관리하기 정말 편해요. 포인트도 통합으로 쌓여서 혜택이 더 많아진 것 같아요.',
    author: {
      name: '박준호',
      role: '사업자, 자영업자',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&auto=format&q=80',
    },
    services: ['⛽ 주유소', '🚗 세차', '🚛 난방유배달'],
    verified: true,
    rating: 5,
  },
  {
    id: 4,
    company: {
      name: '개인 사용자',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format&q=80',
    },
    quote:
      '원래 앱마다 계정 만드는 게 번거로웠는데, 스타코엑스는 한 번만 가입하면 끝이네요! UI도 깔끔하고 사용하기 쉬워서 친구들한테도 추천했어요.',
    author: {
      name: '최서연',
      role: '대학생, 개인 사용자',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format&q=80',
    },
    services: ['⛽ 주유소'],
    verified: true,
    rating: 4,
  },
  {
    id: 5,
    company: {
      name: '개인 사용자',
      logo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format&q=80',
    },
    quote:
      '통합 결제랑 포인트 적립이 정말 편해요. 주유소에서 쌓은 포인트로 세차도 할 수 있고, 하나의 앱 같은 느낌이라 관리하기 쉬워요.',
    author: {
      name: '정민아',
      role: '회사원, 개인 사용자',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format&q=80',
    },
    services: ['⛽ 주유소', '🚗 세차'],
    verified: true,
    rating: 5,
  },
  {
    id: 6,
    company: {
      name: '사업자',
      logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format&q=80',
    },
    quote:
      '사업체 여러 대 차량 관리가 정말 편해졌어요. 각 서비스별로 따로 관리할 필요 없이 하나의 계정으로 모든 걸 처리할 수 있어서 업무 효율이 많이 올라갔습니다.',
    author: {
      name: '한상철',
      role: '운송업, 사업자',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format&q=80',
    },
    services: ['⛽ 주유소', '🚗 세차', '🚛 난방유배달'],
    verified: true,
    rating: 4,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="">
      <div className="border-b">
        <SectionHeader
          iconTitle="고객 후기"
          title="하이브리드 서비스, 고객들은 어떻게 느낄까요?"
          icon={Handshake}
          description="한 번 가입으로 모든 서비스를 이용하는 고객들의 생생한 후기"
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
  company: {
    name: string;
    logo: string;
  };
  quote: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  services: string[];
  verified: boolean;
  rating: number;
}

function TestimonialCard({
  company,
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
        <img
          src={company.logo}
          alt={company.name}
          className="w-12 h-12 object-cover rounded-full"
        />
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
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
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
