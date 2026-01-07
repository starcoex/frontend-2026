import { MessageCircleQuestion } from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqData = [
  {
    question: '가입은 어떻게 하나요?',
    answer:
      '스타코엑스 포털에서 카카오, 네이버, 구글 소셜 로그인으로 3초만에 가입할 수 있습니다. 한 번 가입하면 모든 서비스 앱에서 자동으로 로그인됩니다.',
  },
  {
    question: '어떤 서비스들을 이용할 수 있나요?',
    answer:
      '별표주유소, 세차 서비스, 난방유 배달, 제라게 카케어 등 4개의 전용 앱 서비스를 이용하실 수 있습니다. 모든 서비스가 하나의 계정으로 연결됩니다.',
  },
  {
    question: '각 앱마다 따로 가입해야 하나요?',
    answer:
      '아닙니다! 포털에서 한 번만 가입하시면 모든 서비스 앱에서 자동으로 로그인됩니다. 별도 회원가입 없이 바로 서비스를 이용할 수 있어요.',
  },
  {
    question: '결제는 어떻게 하나요?',
    answer:
      '모든 서비스에서 동일한 결제 수단을 사용할 수 있습니다. 카드 등록도 한 번만 하면 되고, 포인트도 통합으로 적립되어 다른 서비스에서도 사용 가능합니다.',
  },
  {
    question: '개인정보는 안전한가요?',
    answer:
      '네, 안전합니다. 모든 개인정보는 암호화되어 저장되며, 각 서비스별로 필요한 최소한의 정보만 공유됩니다. 개인정보처리방침에 따라 엄격하게 관리됩니다.',
  },
  {
    question: '사업자도 이용할 수 있나요?',
    answer:
      '물론입니다! 개인 사용자뿐만 아니라 사업자도 동일하게 이용할 수 있습니다. 대량 이용 시 추가 할인 혜택도 제공되니 고객센터로 문의해주세요.',
  },
  {
    question: '앱을 삭제해도 다른 서비스는 계속 쓸 수 있나요?',
    answer:
      '네, 가능합니다. 각 서비스 앱은 독립적으로 작동하지만 계정은 통합으로 관리됩니다. 하나의 앱을 삭제해도 다른 앱에서는 계속 로그인 상태가 유지됩니다.',
  },
  {
    question: '고객지원은 어떻게 받나요?',
    answer:
      '통합 고객센터에서 모든 서비스에 대한 문의를 처리해드립니다. 어떤 서비스든 하나의 전화번호로 연락하시면 전담 상담원이 도움을 드립니다.',
  },
];

const FaqSection = ({ withBorders = true }: { withBorders?: boolean }) => {
  return (
    <section className="">
      <div className={withBorders ? 'border-b' : ''}>
        <SectionHeader
          className={
            withBorders
              ? ''
              : '!max-w-[480px] !border-none lg:items-center lg:text-center'
          }
          iconTitle="자주 묻는 질문"
          title="하이브리드 서비스, 궁금한 점이 있으신가요?"
          icon={MessageCircleQuestion}
          description="스타코엑스 이용 중 자주 묻는 질문들을 모아놨습니다"
        />
      </div>

      <div className={withBorders ? 'container border-x' : 'container'}>
        <div className="mx-auto max-w-3xl pt-8 pb-4 md:pb-8 lg:pt-[3.75rem] lg:pb-[50px]">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="text-black dark:text-white rounded-[7px] border px-6 data-[state=open]:pb-2"
              >
                <AccordionTrigger className="py-5 text-base tracking-[-0.32px] text-black dark:text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300 text-base tracking-[-0.32px]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {withBorders && (
        <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
          <div className="container h-full w-full border-x"></div>
        </div>
      )}
    </section>
  );
};

export default FaqSection;
