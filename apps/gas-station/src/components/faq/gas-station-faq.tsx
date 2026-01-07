import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const questions = [
  {
    question: 'STARCOEX 플랫폼은 무엇인가요?',
    answer:
      'STARCOEX는 전기차 충전소와 주유소를 통합 관리하는 현대적인 플랫폼입니다. 실시간 위치 확인, 가격 비교, 예약 시스템을 하나의 통합된 뷰로 제공합니다.',
  },
  {
    question: '다른 충전소 앱과 어떻게 다른가요?',
    answer:
      '기존 앱들과 달리 STARCOEX는 전기차 충전소와 주유소를 모두 지원하며, AI 기반 경로 최적화, 실시간 혼잡도 분석, 통합 결제 시스템을 제공합니다.',
  },
  {
    question: '계정은 어떻게 업데이트하나요?',
    answer:
      '계정 설정 → 프로필에서 이메일, 비밀번호, 알림 설정, 연결된 차량 정보를 언제든지 업데이트할 수 있습니다.',
  },
  {
    question: '고객 지원은 무료인가요?',
    answer:
      '모든 사용자에게 이메일 지원과 지식 베이스 접근을 무료로 제공합니다. 프리미엄 및 기업 플랜은 24/7 실시간 채팅과 전화 지원을 포함합니다.',
  },
  {
    question: 'AI가 인간을 대체하게 될까요?',
    answer:
      '저희는 AI를 스마트 알림과 인사이트를 위해 활용하지만, STARCOEX는 여전히 인간 중심의 플랫폼입니다. 채팅봇으로 직원을 대체할 계획은 없습니다!',
  },
  {
    question: '차량과 결제 수단은 어떻게 연결하나요?',
    answer:
      '통합 설정 탭에서 차량 정보를 입력하고 결제 수단을 등록하세요. 한 번 설정하면 모든 충전소와 주유소에서 자동으로 결제됩니다.',
  },
  {
    question: '어떤 충전소와 주유소를 지원하나요?',
    answer:
      '전국 주요 충전소 네트워크(환경부, 한국전력, 민간 사업자)와 주요 주유소 브랜드(SK, GS칼텍스, S-OIL 등) 수천 곳을 지원합니다.',
  },
];

const GasStationFaq = () => {
  return (
    <section className="bg-obsidian relative overflow-hidden px-2.5 lg:px-0">
      <div className="border-l-dark-gray border-r-dark-gray border-t-dark-gray relative container border px-0">
        <div className="border-b-dark-gray border-b px-6 py-8 lg:px-8 lg:py-20">
          <div className="flex max-w-lg flex-col gap-4 lg:gap-6">
            <h1 className="text-foreground text-3xl tracking-tight">
              자주 묻는 질문
            </h1>
            <p className="text-mid-gray text-base">
              사용자들이 가장 많이 묻는 질문들과 플랫폼을 최대한 활용하기 위한
              실용적인 팁들을 찾아보세요.
            </p>
            <div>
              <Button asChild variant="secondary" size="sm">
                <Link to="/faq">더 보기</Link>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Accordion type="single" collapsible className="text-foreground">
            {questions.map((item, i) => (
              <AccordionItem
                key={i}
                value={`left-${i}`}
                className="border-b-dark-gray data-[state=open]:bg-jet border-b p-6"
              >
                <AccordionTrigger className="text-xl">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-mid-gray text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default GasStationFaq;
