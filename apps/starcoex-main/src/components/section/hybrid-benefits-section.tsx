import {
  Zap,
  Shield,
  Smartphone,
  CreditCard,
  TrendingUp,
  LucideIcon,
  UserCheck,
  Bell,
  Lock,
  Coins,
  ArrowRight,
  CheckCircle2,
  WifiHigh,
  Star,
} from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import DiagonalPattern from '@/components/diagonal-pattern';
import { CardDescription, CardTitle } from '@/components/ui/card';

// 각 혜택 아이템의 일러스트 컴포넌트 정의
const IllustrationSignup = () => (
  <div className="flex flex-col items-center justify-center gap-3 p-6 w-full h-full min-h-[160px]">
    <div className="relative flex items-center justify-center">
      <div className="bg-primary/10 rounded-full p-5">
        <UserCheck className="w-10 h-10 text-primary" />
      </div>
    </div>
    <div className="flex items-center gap-2 mt-1">
      {['주유', '세차', '배달', '포털'].map((label) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <div className="bg-muted border rounded-md px-2 py-1">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[10px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <Zap className="w-3 h-3 text-primary" />
      <span>1회 가입 → 전체 자동 연동</span>
    </div>
  </div>
);

const IllustrationApp = () => (
  <div className="flex flex-col items-center justify-center gap-3 p-6 w-full h-full min-h-[160px]">
    <div className="bg-primary/10 rounded-full p-5">
      <Smartphone className="w-10 h-10 text-primary" />
    </div>
    <div className="flex gap-3 mt-1">
      <div className="flex flex-col items-center gap-1">
        <div className="bg-muted border rounded-lg p-2">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <span className="text-[10px] text-muted-foreground">실시간 알림</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="bg-muted border rounded-lg p-2">
          <Star className="w-5 h-5 text-yellow-500" />
        </div>
        <span className="text-[10px] text-muted-foreground">맞춤 기능</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="bg-muted border rounded-lg p-2">
          <WifiHigh className="w-5 h-5 text-primary" />
        </div>
        <span className="text-[10px] text-muted-foreground">실시간 연동</span>
      </div>
    </div>
  </div>
);

const IllustrationSecurity = () => (
  <div className="flex flex-col items-center justify-center gap-3 p-6 w-full h-full min-h-[160px]">
    <div className="relative">
      <div className="bg-primary/10 rounded-full p-5">
        <Lock className="w-10 h-10 text-primary" />
      </div>
      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
        <CheckCircle2 className="w-3 h-3 text-white" />
      </div>
    </div>
    <div className="flex flex-col items-center gap-1.5 mt-1 w-full max-w-[180px]">
      {['개인정보 보호', '안전한 거래', '통합 인증'].map((label) => (
        <div
          key={label}
          className="flex items-center gap-2 w-full bg-muted/60 rounded-md px-3 py-1.5"
        >
          <Shield className="w-3 h-3 text-primary shrink-0" />
          <span className="text-xs text-muted-foreground">{label}</span>
          <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

const IllustrationPayment = () => (
  <div className="flex flex-col items-center justify-center gap-3 p-6 w-full h-full min-h-[160px]">
    <div className="bg-primary/10 rounded-full p-5">
      <CreditCard className="w-10 h-10 text-primary" />
    </div>
    <div className="flex items-center gap-2 mt-1">
      <div className="flex flex-col items-center gap-1">
        <div className="bg-muted border rounded-lg p-2">
          <Coins className="w-5 h-5 text-yellow-500" />
        </div>
        <span className="text-[10px] text-muted-foreground">포인트 적립</span>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground" />
      <div className="flex flex-col items-center gap-1">
        <div className="bg-muted border rounded-lg p-2">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <span className="text-[10px] text-muted-foreground">통합 결제</span>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground" />
      <div className="flex flex-col items-center gap-1">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        </div>
        <span className="text-[10px] text-muted-foreground">혜택 극대화</span>
      </div>
    </div>
  </div>
);

const BENEFITS_ITEMS = [
  {
    title: '한 번 가입으로 모든 서비스',
    description:
      '포털에서 가입하면 모든 서비스 앱에서 자동으로 로그인됩니다. 복잡한 회원가입 과정 없이 바로 시작하세요.',
    icon: Zap,
    illustration: IllustrationSignup,
  },
  {
    title: '전용 앱의 편리함',
    description:
      '각 서비스별로 최적화된 전용 앱에서 더욱 편리하게 이용하세요. 실시간 알림과 맞춤 기능을 제공합니다.',
    icon: Smartphone,
    illustration: IllustrationApp,
    reverse: true,
  },
  {
    title: '통합 보안 관리',
    description:
      '하나의 계정으로 모든 서비스의 보안을 안전하게 관리합니다. 개인정보 보호와 안전한 거래를 보장합니다.',
    icon: Shield,
    illustration: IllustrationSecurity,
  },
  {
    title: '통합 결제 & 적립',
    description:
      '모든 서비스에서 동일한 결제 수단과 적립 혜택을 받으세요. 포인트 통합 관리로 더 큰 혜택을 누리세요.',
    icon: CreditCard,
    illustration: IllustrationPayment,
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
            illustration={item.illustration}
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
  illustration: React.FC;
  reverse?: boolean;
  index: number;
}

const BenefitItem = ({
  title,
  description,
  icon: Icon,
  illustration: Illustration,
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
              {/* 이미지 → 일러스트 카드로 교체 */}
              <div className="m-2 rounded-md lg:rounded-xl border bg-card shadow-md lg:shadow-lg w-full max-w-[400px]">
                <Illustration />
              </div>
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
