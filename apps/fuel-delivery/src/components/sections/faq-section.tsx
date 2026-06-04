import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

type QA = { question: string; answer: string };

const FAQS: QA[] = [
  {
    question: '배달 가능 지역은 어디인가요?',
    answer:
      '현재 서울 및 경기 일부 지역에 배달 서비스를 제공하고 있습니다. 정확한 배달 가능 여부는 주문 시 주소 입력 단계에서 확인하실 수 있습니다. 배달 지역 확대는 순차적으로 진행 중입니다.',
  },
  {
    question: '한 드럼(200리터) 기준이란 무엇인가요?',
    answer:
      '저희 기본 배달 단위는 한 드럼(200리터)입니다. 가장 경제적인 단가로 배달되며 당일 배송이 가능합니다.\n소량이 필요하신 경우 반 드럼(100리터) 또는 통 단위 소량 배달도 별도 문의를 통해 가능합니다. 소량 배달은 배달 일정이 상이할 수 있으니 사전 문의를 권장드립니다.',
  },
  {
    question: '당일 배송은 몇 시까지 주문해야 하나요?',
    answer:
      '당일 배송은 오후 2시 이전 주문 건에 한해 적용됩니다. 오후 2시 이후 주문은 익일 배송으로 처리됩니다.\n단, 성수기(겨울철 11월~3월) 및 기상 악화 시에는 배송 일정이 변동될 수 있으며, 이 경우 사전에 안내해 드립니다.',
  },
  {
    question: '정량 보장은 어떻게 확인할 수 있나요?',
    answer:
      '배달 시 기사님이 주유미터기를 직접 보여드립니다. 미터기는 반드시 0부터 시작하며, 주유 완료 후 영수증의 금액·리터·단가가 정확히 일치하는지 확인하실 수 있습니다.\n기존 잔량이 있는 경우 탱크의 가로×세로×높이로 부피를 직접 측정해 잔량을 확인하실 수도 있습니다.',
  },
  {
    question: '실시간 배송 추적은 어떻게 이용하나요?',
    answer:
      '주문 완료 후 발급되는 운송장 번호로 배송 추적 페이지에서 기사님의 실시간 위치를 확인하실 수 있습니다.\n운송장 번호는 주문 완료 문자로 발송되며, 형식은 FD-YYYYMMDD-#### 입니다.',
  },
  {
    question: '결제는 어떤 방식으로 하나요?',
    answer:
      '현재 카드 결제 및 계좌이체를 지원합니다. 주문 완료 후 결제 수단을 선택하실 수 있으며, 기업 고객의 경우 세금계산서 발행도 가능합니다. 자세한 사항은 고객센터로 문의해 주세요.',
  },
  {
    question: '무료 난로·돈풍기 임대 서비스는 무엇인가요?',
    answer:
      '별표주유소와 지속적인 거래를 맺으신 고객님께는 무료 난로 및 돈풍기 임대 서비스를 제공합니다. 오래된 난로를 새것으로 교체해 드리는 서비스도 포함됩니다.\n자세한 조건 및 신청은 고객센터(문의하기)를 통해 안내받으실 수 있습니다.',
  },
  {
    question: '공동구매는 어떻게 신청하나요?',
    answer:
      '빌라나 아파트 단지에서 공동구매 시 시중가보다 저렴하게 제공해 드립니다. 최소 1,000리터 기준이며, 입주자 대표 또는 관리인이 고객센터로 문의해 주시면 상세 안내를 드립니다.',
  },
];

// ── FaqItem ───────────────────────────────────────────────────────────────────

function FaqItem({
  id,
  qa,
  open,
  onToggle,
}: {
  id: string;
  qa: QA;
  open: boolean;
  onToggle: (id: string) => void;
}) {
  const regionId = `${id}-region`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string | number>(open ? 'auto' : 0);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      const current = wrapperRef.current?.offsetHeight ?? 0;
      setHeight(current);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open, qa.answer]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onEnd = () => {
      if (open) setHeight('auto');
    };
    el.addEventListener('transitionend', onEnd);
    return () => el.removeEventListener('transitionend', onEnd);
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (!contentRef.current || !open) return;
      if (height !== 'auto') setHeight(contentRef.current.scrollHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, height]);

  return (
    <div className="bg-card rounded-[16px] border border-border px-4 py-2 sm:px-6 sm:py-4 shadow-[0_2px_8px_-1px_rgba(13,13,18,0.04)]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => onToggle(id)}
        className="group flex w-full items-center justify-between gap-4 text-left text-foreground text-xl leading-tight font-medium sm:text-2xl py-1 sm:py-2 hover:no-underline"
      >
        <span className="pr-2">{qa.question}</span>
        <span
          className={[
            'flex size-6 items-center justify-center rounded-[6px] border shrink-0',
            open
              ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/30 text-orange-500'
              : 'border-border text-muted-foreground',
          ].join(' ')}
          aria-hidden
        >
          {open ? (
            <Minus className="size-3" strokeWidth={2} />
          ) : (
            <Plus className="size-3" strokeWidth={2} />
          )}
        </span>
      </button>

      <div
        id={regionId}
        role="region"
        aria-hidden={!open}
        ref={wrapperRef}
        style={{ height, transition: 'height 200ms ease' }}
        className="overflow-hidden"
      >
        <div
          ref={contentRef}
          className="text-muted-foreground mt-2 text-sm font-normal whitespace-pre-wrap sm:text-base pb-2"
        >
          {qa.answer}
        </div>
      </div>
    </div>
  );
}

// ── 메인 섹션 ─────────────────────────────────────────────────────────────────

export const FaqSection: React.FC = () => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const handleToggle = (id: string) =>
    setValue((curr) => (curr === id ? undefined : id));

  return (
    <section id="faq" className="bg-background px-6 lg:px-0">
      <div className="container px-0 py-16 sm:py-20 md:px-6 lg:py-28">
        {/* 섹션 헤더 */}
        <p className="text-muted-foreground mb-4 text-center text-sm leading-tight font-normal sm:text-base">
          자주 묻는 질문
        </p>
        <h2 className="text-foreground mx-auto mb-4 max-w-3xl text-center text-3xl leading-tight font-medium tracking-tight sm:text-4xl md:text-5xl">
          궁금한 점이 있으신가요?
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base font-normal sm:text-lg">
          배달 서비스 이용 전 자주 문의하시는 내용을 모았습니다. 해결되지 않는
          문의는 고객센터로 연락해 주세요.
        </p>

        {/* FAQ 아코디언 */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 sm:mt-14">
          {FAQS.map((qa, i) => {
            const id = `item-${i + 1}`;
            return (
              <FaqItem
                key={id}
                id={id}
                qa={qa}
                open={value === id}
                onToggle={handleToggle}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
