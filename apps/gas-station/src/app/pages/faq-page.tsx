import { useEffect, useId, SVGProps } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Category = '지원' | '계정' | '기능' | '보안' | '기타';

interface FAQItem {
  question: string;
  answer: string;
  category: Category;
}

const categories: { name: Category; description: string }[] = [
  {
    name: '지원',
    description:
      'STARCOEX 사용에 도움이 필요하신가요? 저희 팀, 문서, 커뮤니티가 도와드립니다.',
  },
  {
    name: '계정',
    description: 'STARCOEX 계정 생성, 관리, 보안과 관련된 모든 것을 다룹니다.',
  },
  {
    name: '기능',
    description:
      'STARCOEX의 기능을 알아보고 워크플로우에 맞게 플랫폼을 사용자 정의하는 방법을 배워보세요.',
  },
  {
    name: '보안',
    description:
      '저희는 보안을 진지하게 생각합니다. 이 FAQ들은 데이터를 안전하게 보호하는 방법을 설명합니다.',
  },
  {
    name: '기타',
    description:
      '가격, 통합, 내보내기 옵션 및 위 카테고리에 맞지 않는 기타 질문들입니다.',
  },
];

const faqItems: FAQItem[] = [
  {
    category: '계정',
    question: 'STARCOEX에 가입하는 방법은?',
    answer:
      '홈페이지에서 "시작하기"를 클릭하고 플랜을 선택한 후 화면의 단계를 따르세요. 전체 과정은 2분 미만이 걸리며 직장 이메일만 있으면 됩니다.',
  },
  {
    category: '계정',
    question: '어떤 충전소와 주유소를 지원하나요?',
    answer:
      'STARCOEX는 환경부, 한국전력공사, 민간 사업자 등 전국 12,000+ 충전소와 주요 주유소 브랜드와 연결됩니다. 목록에 없다면 알려주시면 추가하겠습니다.',
  },
  {
    category: '계정',
    question: '조직에서 사용자를 추가하거나 제거하는 방법은?',
    answer:
      '**설정 ▸ 팀**에서 "초대"를 클릭하여 동료를 추가하거나, 휴지통 아이콘으로 액세스를 철회하세요. 관리자 역할을 가진 사용자만 좌석을 관리할 수 있습니다.',
  },
  {
    category: '지원',
    question: '고객 지원팀에 연락하는 방법은?',
    answer:
      '앱 내 채팅(우측 하단), support@starcoex.com 이메일, 또는 02-1234-5678로 전화하세요. 유료 플랜에서는 1영업시간 내에 답변드립니다.',
  },
  {
    category: '지원',
    question: '제품 문서는 어디에서 찾을 수 있나요?',
    answer:
      '모든 문서는 **docs.starcoex.com**에 있습니다. 앱에서 **⌘ / Ctrl + K**를 눌러 대시보드를 떠나지 않고도 검색할 수 있습니다.',
  },
  {
    category: '지원',
    question: '라이브 데모나 교육 세션을 요청할 수 있나요?',
    answer:
      '물론입니다! **starcoex.com/demo**에서 30분 Zoom 세션을 예약하세요. 최대 10명 팀까지는 교육이 무료입니다.',
  },
  {
    category: '지원',
    question: '지원 운영 시간은?',
    answer:
      '실시간 채팅과 전화: 월-금 09:00–18:00 KST. 이메일 티켓은 24시간 모니터링됩니다.',
  },
  {
    category: '지원',
    question: '버그 신고나 피드백 제출 방법은?',
    answer:
      '사이드바의 **"피드백"** 버튼을 누르거나 이메일로 보내주세요. 모든 제출물은 48시간 내에 제품팀에서 검토합니다.',
  },
  {
    category: '기능',
    question: '어떤 충전소와 주유소에 연결할 수 있나요?',
    answer:
      '환경부 전기차 충전 인프라, 한국전력공사 충전망, 민간 충전 사업자와 주요 주유소 브랜드(SK, GS칼텍스, S-OIL, 현대오일뱅크 등)를 모두 지원합니다.',
  },
  {
    category: '기능',
    question: '대시보드를 사용자 정의할 수 있나요?',
    answer:
      '네! 위젯을 드래그 앤 드롭하고, 맞춤형 KPI를 생성하며, 다양한 역할에 맞는 여러 레이아웃을 저장할 수 있습니다.',
  },
  {
    category: '기능',
    question: '충전/주유 예약은 어떻게 작동하나요?',
    answer:
      '위치, 시간, 충전량/주유량을 설정하면 STARCOEX가 자동으로 예약을 처리하고 성공 또는 실패를 알려드립니다.',
  },
  {
    category: '기능',
    question: '맞춤형 알림과 알림을 설정할 수 있나요?',
    answer:
      '**설정 ▸ 알림**에서 임계값(충전 완료, 가격 변동 등)을 정의하세요. 이메일, SMS, 슬랙 또는 푸시 알림을 선택할 수 있습니다.',
  },
  {
    category: '보안',
    question: '내 데이터는 어떻게 보호되나요?',
    answer:
      '모든 데이터는 전송 중(TLS 1.3)과 저장 시(AES-256) 암호화됩니다. 저희 인프라는 ISO 27001 인증 데이터센터에서 운영됩니다.',
  },
  {
    category: '보안',
    question: '다단계 인증(MFA)을 지원하나요?',
    answer:
      '네! TOTP, WebAuthn 보안 키, Kakao SSO가 무료 플랜을 포함한 모든 플랜에서 제공됩니다.',
  },
  {
    category: '보안',
    question: '결제 정보가 STARCOEX 서버에 저장되나요?',
    answer:
      '아니요. 결제 정보는 암호화되어 PCI DSS 준수 결제 처리업체에 저장되며, 저희 네트워크나 데이터베이스에 노출되지 않습니다.',
  },
  {
    category: '기타',
    question: '가격 정책은 어떻게 되나요?',
    answer:
      'STARCOEX는 무료 스타터 플랜, 월 29,000원의 팀 플랜, 볼륨 할인이 적용되는 엔터프라이즈 플랜을 제공합니다. starcoex.com/pricing을 참조하세요.',
  },
  {
    category: '기타',
    question: 'API를 제공하나요?',
    answer:
      '네! STARCOEX REST & Webhook API는 팀 플랜 이상에 포함됩니다. API 키는 **설정 ▸ 개발자**에서 생성할 수 있습니다.',
  },
  {
    category: '기타',
    question: '취소 결정 시 데이터를 내보낼 수 있나요?',
    answer:
      '물론입니다. CSV, JSON으로 내보내거나 S3로 직접 내보낼 수 있습니다. 취소 후 30일간 데이터가 보관된 후 영구 삭제됩니다.',
  },
];

export const FaqPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            자주 묻는 질문
          </h1>
          <p className="text-muted-foreground mt-4 text-xl md:text-2xl">
            STARCOEX 서비스 이용에 대해 궁금한 점을 확인해보세요.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl space-y-12 md:mt-12 lg:mt-20">
          {categories.map((cat) => {
            const items = faqItems.filter((f) => f.category === cat.name);

            // 아이템이 없는 카테고리는 렌더링하지 않음
            if (items.length === 0) return null;

            return (
              <Card
                key={cat.name}
                className="bg-muted/30 border-none shadow-none"
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-primary border-b pb-4 font-mono text-base font-bold uppercase tracking-widest">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {cat.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {items.map((item, i) => (
                      <AccordionItem
                        key={i}
                        value={`${cat.name}-${i}`}
                        className="border-muted-foreground/20 border-b last:border-0"
                      >
                        <AccordionTrigger className="text-start text-base font-medium hover:no-underline py-4">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base font-medium leading-relaxed pb-4">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 배경 패턴 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -inset-40 [mask-image:radial-gradient(circle_at_center,black_0%,black_20%,transparent_75%)]">
          <PlusSigns className="text-foreground/[0.03] h-full w-full" />
        </div>
      </div>
    </section>
  );
};

interface PlusSignsProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const PlusSigns = ({ className, ...props }: PlusSignsProps) => {
  const GAP = 24; // 패턴 간격 조정
  const STROKE_WIDTH = 1;
  const PLUS_SIZE = 8; // 플러스 크기 조정
  const id = useId();
  const patternId = `plus-pattern-${id}`;

  return (
    <svg width="100%" height="100%" className={className} {...props}>
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={GAP}
          height={GAP}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1={GAP / 2}
            y1={(GAP - PLUS_SIZE) / 2}
            x2={GAP / 2}
            y2={(GAP + PLUS_SIZE) / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="square"
          />
          <line
            x1={(GAP - PLUS_SIZE) / 2}
            y1={GAP / 2}
            x2={(GAP + PLUS_SIZE) / 2}
            y2={GAP / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="square"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};
