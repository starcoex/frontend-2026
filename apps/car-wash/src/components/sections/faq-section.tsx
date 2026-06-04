import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/app/config/app.config';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: '10분 세차는 정말 10분 안에 완료되나요?',
    a: '네, 기본 외부 손세차 기준 평균 8–9분 완료됩니다. 별표 코스는 12분, 반짝 코스는 15분 내외입니다. 대기 차량이 있을 경우 앱에서 실시간 대기 시간을 미리 확인하실 수 있어 헛걸음 없이 방문하실 수 있습니다.',
  },
  {
    q: '예약 없이 바로 방문해도 되나요?',
    a: '외부 손세차(기본·별표·반짝) 3가지 코스는 모두 예약 없이 현장 접수 후 바로 이용 가능합니다. 프리미엄 실내 디테일링이나 유막제거 단독 시공은 작업 시간이 길기 때문에 사전 예약을 권장합니다.',
  },
  {
    q: '세차 코스는 어떻게 선택하면 좋나요?',
    a: '가장 빠른 기본 손세차(8–9분)는 일상적인 외부 먼지 제거에 적합합니다. 코팅왁스까지 원하신다면 별표 코스(12분), 타이어 드레싱까지 디테일하게 원하신다면 반짝 코스(15분)를 추천합니다. 가격표는 홈 화면에서 차종별로 바로 확인하실 수 있습니다.',
  },
  {
    q: 'PPF·도장 불량 차량도 세차가 가능한가요?',
    a: 'PPF 차량은 고압 분사 시 비닐이 벗겨질 수 있어 일부 공정 조정이 필요합니다. 도장 불량(돌빵, 흠집)이 있는 경우 고압 세척 과정에서 페인트가 벗겨질 수 있습니다. 방문 전 매장에 차량 상태를 미리 알려주시면 안전한 방법으로 안내해 드립니다.',
  },
  {
    q: '오염이 심한 차량은 추가 요금이 있나요?',
    a: '새똥, 벌레, 진흙 등 오염이 심한 경우 추가 1–3만원이 발생할 수 있습니다. 또한 세차만 이용하시는 경우(주유 없이) 2천원이 추가됩니다. 주유 3만원 이상 또는 세차 전용 카드 결제 시 기본 요금이 적용됩니다.',
  },
  {
    q: '세차 전용 카드는 무엇인가요?',
    a: '제라게 세차 전용 선불카드로, 5만원 충전 시 59,000원 어치 세차를 이용하실 수 있습니다. 단골 고객일수록 더 이득이며 환불은 불가합니다. 앞유리 유막제거(1만원)도 카드로 결제하실 수 있습니다.',
  },
] as const;

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function FaqSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: {} }}
        >
          {/* ── 헤더 */}
          <div className="mb-12 md:mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.span
                className="text-cyan-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                FAQ
              </motion.span>
              <motion.h2
                className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                자주 묻는 질문
              </motion.h2>
            </div>

            {/* 우측 문의 버튼 */}
            <motion.div
              className="shrink-0"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate(APP_CONFIG.routes.contact)}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                직접 문의하기
              </Button>
            </motion.div>
          </div>

          {/* ── FAQ 목록 — faq.tsx 패턴 */}
          <motion.div
            className="space-y-0"
            onMouseLeave={() => setHovered(null)}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
          >
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                className="cursor-pointer border-b border-dashed py-6 last:border-b-0"
                onMouseEnter={() => setHovered(i)}
                variants={{
                  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <motion.div
                  animate={{
                    opacity: hovered === null || hovered === i ? 1 : 0.2,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    animate={{ x: hovered === i ? 8 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {/* 번호 + 구분선 */}
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-cyan-500 font-mono text-[0.625rem] font-medium tracking-wider">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="bg-cyan-500/25 h-px flex-1" />
                    </div>

                    {/* 질문 */}
                    <h3 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                      {item.q}
                    </h3>

                    {/* 답변 */}
                    <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── 하단 문의 카드 */}
          <motion.div
            className="mt-16 rounded-2xl border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50 dark:bg-cyan-950/20 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="font-semibold text-base">
                더 궁금한 점이 있으신가요?
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                카카오 채널 또는 전화로 빠르게 답변드립니다.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                className="bg-[#FEE500] hover:bg-[#F5D800] text-[#191919] font-bold border-0"
                onClick={() => window.open('https://pf.kakao.com/', '_blank')}
              >
                카카오 문의
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(APP_CONFIG.routes.contact)}
              >
                이메일 문의
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
