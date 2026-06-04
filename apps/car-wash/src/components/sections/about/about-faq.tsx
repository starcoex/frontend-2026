import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    q: '별표주유소와 제라게 카케어는 같은 곳인가요?',
    a: '네, 제주 별표주유소 내에 위치한 세차 전문 공간입니다. 주유와 세차를 한 번에 해결할 수 있어 고객 시간을 아낍니다. 주유 3만원 이상 시 기본 세차 요금이 적용됩니다.',
  },
  {
    q: '전문 디테일링과 10분 세차의 차이는 무엇인가요?',
    a: '10분 세차(스피드 존)는 외부 손세차로 예약 없이 즉시 이용 가능합니다. 전문 디테일링은 실내 크리닝, 유막제거, 광택, PPF 등 시간이 필요한 작업으로 사전 예약 후 진행합니다. 두 서비스 모두 전문 교육을 이수한 디테일러가 직접 담당합니다.',
  },
  {
    q: '제주도 밖 여행객도 이용할 수 있나요?',
    a: '물론입니다. 렌터카 반납 전 세차로 많이 이용하십니다. 앱에서 실시간 대기 현황을 확인 후 방문하시면 대기 없이 바로 이용 가능합니다.',
  },
  {
    q: '세차 전용 카드는 어떻게 발급받나요?',
    a: '매장에 방문하셔서 직접 문의해 주세요. 5만원 충전 시 59,000원 어치 세차를 이용하실 수 있는 선불카드입니다. 환불은 불가하며 단골 고객일수록 유리합니다.',
  },
  {
    q: 'PPF나 도장 불량 차량은 어떻게 하나요?',
    a: '방문 전 차량 상태를 미리 알려주시면 안전한 방법으로 안내해 드립니다. PPF 차량은 고압 분사 세기 조정이 필요하고, 도장 불량 차량은 일부 공정을 생략할 수 있습니다.',
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutFaq() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          className="grid gap-10 md:grid-cols-5 md:gap-16 lg:gap-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {/* 좌측 sticky 헤더 */}
          <motion.div
            className="md:col-span-2"
            variants={{ hidden: {}, visible: {} }}
          >
            <div className="md:sticky md:top-28">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
              >
                <span className="text-cyan-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase">
                  FAQ
                </span>
                <h2 className="text-3xl leading-none tracking-tighter font-extrabold md:text-4xl lg:text-5xl">
                  궁금한 것들,{' '}
                  <em className="text-cyan-500 not-italic">바로 답변.</em>
                </h2>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  더 궁금한 점은 카카오 채널 또는 전화로 문의 주세요.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* 우측 아코디언 */}
          <motion.div
            className="md:col-span-3"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <Accordion type="single" collapsible>
              {FAQS.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.6, ease },
                    },
                  }}
                >
                  <AccordionItem value={`faq-${i}`} className="border-none">
                    <div className="mb-2 flex items-center gap-3 pt-6">
                      <span className="text-cyan-500 font-mono text-[0.625rem] font-medium tracking-wider">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="bg-cyan-500/25 h-px flex-1" />
                    </div>
                    <AccordionTrigger className="pt-2 pb-4 text-xl leading-tight tracking-tight font-bold md:text-2xl text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground max-w-lg text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
