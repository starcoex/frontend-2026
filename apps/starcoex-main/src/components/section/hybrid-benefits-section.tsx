import {
  Zap,
  Shield,
  Smartphone,
  CreditCard,
  TrendingUp,
  LucideIcon,
} from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import DiagonalPattern from '@/components/diagonal-pattern';
import { CardDescription, CardTitle } from '@/components/ui/card';

const BENEFITS_ITEMS = [
  {
    title: '한 번 가입으로 모든 서비스',
    description:
      '포털에서 가입하면 모든 서비스 앱에서 자동으로 로그인됩니다. 복잡한 회원가입 과정 없이 바로 시작하세요.',
    icon: Zap,
    image: {
      src: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop&auto=format',
      alt: '한 번 가입으로 모든 서비스',
    },
  },
  {
    title: '전용 앱의 편리함',
    description:
      '각 서비스별로 최적화된 전용 앱에서 더욱 편리하게 이용하세요. 실시간 알림과 맞춤 기능을 제공합니다.',
    icon: Smartphone,
    image: {
      src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&auto=format',
      alt: '전용 앱의 편리함',
    },
    reverse: true,
  },
  {
    title: '통합 보안 관리',
    description:
      '하나의 계정으로 모든 서비스의 보안을 안전하게 관리합니다. 개인정보 보호와 안전한 거래를 보장합니다.',
    icon: Shield,
    image: {
      src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&auto=format',
      alt: '통합 보안 관리',
    },
  },
  {
    title: '통합 결제 & 적립',
    description:
      '모든 서비스에서 동일한 결제 수단과 적립 혜택을 받으세요. 포인트 통합 관리로 더 큰 혜택을 누리세요.',
    icon: CreditCard,
    image: {
      src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&auto=format',
      alt: '통합 결제 & 적립',
    },
    reverse: true,
  },
];

export const HybridBenefitsSection = () => {
  return (
    <section id="hybrid-benefits" className="">
      <div className="border-b">
        <SectionHeader
          iconTitle="하이브리드 혜택"
          title="왜 스타코엑스를 선택해야 할까요?"
          icon={TrendingUp}
          description={
            '통합 포털과 전용 앱의 장점을 모두 누리는 혁신적인 하이브리드 서비스'
          }
        />
      </div>

      <div className="container border-x pb-40 lg:pt-20 [&>*:last-child]:pb-20 [&>div>div:first-child]:!pt-20">
        {BENEFITS_ITEMS.map((item, index) => (
          <BenefitItem
            key={index}
            index={index}
            title={item.title}
            description={item.description}
            icon={item.icon}
            image={item.image}
            reverse={item.reverse}
          />
        ))}
      </div>

      <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

interface BenefitItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image: {
    src: string;
    alt: string;
  };
  reverse?: boolean;
  index: number;
}

const BenefitItem = ({
  title,
  description,
  icon: Icon,
  image,
  reverse,
  index,
}: BenefitItemProps) => (
  <div className={`relative flex`}>
    <div
      className={`flex w-full justify-center px-1 py-10 text-end md:gap-6 lg:gap-10 ${
        reverse ? 'lg:flex-row-reverse lg:text-start' : ''
      } `}
    >
      <div className="flex-1 max-lg:hidden">
        <CardTitle className="text-2xl tracking-[-0.96px]">{title}</CardTitle>
        <CardDescription
          className={`text-muted-foreground mt-2.5 max-w-[300px] tracking-[-0.32px] text-balance ${
            reverse ? '' : 'ml-auto'
          }`}
        >
          {description}
        </CardDescription>
      </div>
      <div
        className={`bg-background z-[-1] size-fit -translate-y-5 p-4 max-lg:-translate-x-4`}
      >
        <div className="bg-card rounded-[10px] border p-[5px] shadow-md">
          <div className="bg-muted size-fit rounded-md border p-1">
            <Icon className="size-4 shrink-0" />
          </div>
        </div>
      </div>
      <div className="flex-1 max-lg:-translate-x-4">
        <div className={`text-start lg:pointer-events-none lg:hidden`}>
          <CardTitle className="text-2xl tracking-[-0.96px]">{title}</CardTitle>
          <CardDescription className="text-muted-foreground mt-2.5 mb-10 max-w-[300px] tracking-[-0.32px] text-balance">
            {description}
          </CardDescription>
        </div>
        <div className="flex items-start justify-start">
          <div className={` ${reverse ? 'lg:ml-auto' : ''}`}>
            <div className="px-6 lg:px-10">
              <DiagonalPattern className="h-6 lg:h-10" />
            </div>
            <div className="relative grid grid-cols-[auto_1fr_auto] items-stretch">
              <DiagonalPattern className="h-full w-6 lg:w-10" />
              <img
                src={image.src}
                alt={image.alt}
                className="m-2 rounded-md object-contain shadow-md lg:rounded-xl lg:shadow-lg w-full h-auto"
                style={{ maxWidth: '400px', height: 'auto' }}
              />
              <DiagonalPattern className="w-6 lg:w-10" />
            </div>
            <div className="px-6 lg:px-10">
              <DiagonalPattern className="h-6 lg:h-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      className={`absolute z-[-2] h-full w-[3px] translate-x-5 rounded-full lg:left-1/2 lg:-translate-x-1/2 ${
        index === BENEFITS_ITEMS.length - 1
          ? 'from-foreground/10 via-foreground/10 bg-gradient-to-b to-transparent'
          : 'bg-foreground/10'
      }`}
    >
      {index === 0 && (
        <div
          className={`to-foreground/10 h-4 w-[3px] -translate-y-full bg-gradient-to-b from-transparent`}
        ></div>
      )}
    </div>
  </div>
);
