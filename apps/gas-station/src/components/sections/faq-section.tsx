import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
];

export const FaqSection = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container grid gap-12 lg:grid-cols-3 lg:gap-24">
        {/* 좌측: 헤더 및 설명 */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            자주 묻는 질문
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            사용자들이 가장 많이 묻는 질문들과 플랫폼을 최대한 활용하기 위한
            실용적인 팁들을 확인해보세요.
          </p>
          <div>
            <Button asChild className="gap-2 group">
              <Link to="/faq">
                모든 질문 보기
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 우측: 아코디언 (질문 개수 줄임) */}
        <div className="lg:col-span-2">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
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
