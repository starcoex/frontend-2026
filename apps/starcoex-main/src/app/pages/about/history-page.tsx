import React from 'react';
import { motion } from 'motion/react';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const HISTORY_DATA = [
  { year: 2003, month: '03월', label: '별표석유 설립', category: '창립' },
  { year: 2011, month: '02월', label: '별표주유소 설립', category: '확장' },
  {
    year: 2015,
    month: '04월',
    label: '별표주유소 도두점 설립',
    category: '확장',
  },
  {
    year: 2016,
    month: '08월',
    label: '제라게 셀프세차장 오픈',
    category: '서비스',
  },
  {
    year: 2016,
    month: '10월',
    label: '소낙스 제주대리점 계약',
    category: '파트너십',
  },
  {
    year: 2017,
    month: '01월',
    label: '소낙스 도매몰 오픈',
    category: '서비스',
  },
  { year: 2017, month: '02월', label: '별표 APP 출시', category: '디지털' },
  {
    year: 2018,
    month: '06월',
    label: '블랙박스 출장 장착 서비스 런칭',
    category: '서비스',
  },
  {
    year: 2018,
    month: '08월',
    label: '제주신안네트웍스 설립',
    category: '창립',
  },
  {
    year: 2018,
    month: '09월',
    label: '메탈크래프트 제주지사 설립',
    category: '확장',
  },
  {
    year: 2018,
    month: '11월',
    label: '소낙스 제주도두점 가맹점 오픈',
    category: '파트너십',
  },
  {
    year: 2019,
    month: '07월',
    label: 'SK M&S ONE POS 제주대리점 계약',
    category: '파트너십',
  },
  {
    year: 2019,
    month: '08월',
    label: '주식회사 스타코엑스 설립',
    category: '창립',
  },
  {
    year: 2019,
    month: '10월',
    label: '튠잇(아차키) 제주지사 계약',
    category: '파트너십',
  },
  {
    year: 2020,
    month: '04월',
    label: '스타코엑스 APP 출시',
    category: '디지털',
  },
] as const;

const CATEGORY_STYLES: Record<string, string> = {
  창립: 'bg-primary/10 text-primary border-primary/20',
  확장: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  서비스: 'bg-green-500/10 text-green-600 border-green-500/20',
  파트너십: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  디지털: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
};

// ── 무한 스크롤 컬럼 ────────────────────────────────────────────────────────────

const firstColumn = HISTORY_DATA.slice(0, 8);
const secondColumn = HISTORY_DATA.slice(7, 15);

function HistoryColumn(props: {
  items: readonly (typeof HISTORY_DATA)[number][];
  duration?: number;
}) {
  return (
    <div>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration: props.duration ?? 20,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-4"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.items.map((item, i) => (
                <Card key={i} className="w-full max-w-xs shadow-none">
                  <CardContent className="flex flex-col gap-3 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary leading-none">
                        {item.year}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                          CATEGORY_STYLES[item.category]
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.month}
                      </p>
                      <p className="text-sm font-medium leading-snug">
                        {item.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
}

// ── 전체 연혁 그리드 (2줄) ──────────────────────────────────────────────────────

function HistoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {HISTORY_DATA.map((item, i) => {
        const isDark = i % 2 === 0;
        return (
          <article
            key={i}
            className="flex flex-col overflow-hidden rounded-xl shadow-sm"
          >
            {/* 상단: 연도 + 카테고리 */}
            <div
              className="flex flex-col items-center justify-center gap-1.5 py-4"
              style={{ backgroundColor: isDark ? '#1a1a1a' : '#374151' }}
            >
              <span className="text-2xl font-bold text-white leading-none">
                {item.year}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  CATEGORY_STYLES[item.category]
                }`}
              >
                {item.category}
              </span>
            </div>

            {/* 하단: 월 + 레이블 */}
            <div
              className="flex flex-col items-center px-3 pb-4 pt-2.5 text-center flex-1"
              style={{ backgroundColor: isDark ? '#111111' : '#1f2937' }}
            >
              <p className="text-[10px] text-white/50 mb-1">{item.month}</p>
              <p className="text-xs font-medium leading-relaxed text-white">
                {item.label}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ── HistoryPage ────────────────────────────────────────────────────────────────

export const HistoryPage: React.FC = () => {
  return (
    <AboutLayout title="주요 연혁" subtitle="스타코엑스가 걸어온 발자취">
      <div className="space-y-20">
        {/* 섹션 1: 헤더 + 무한 스크롤 미리보기 */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div className="flex flex-col space-y-4">
            <Badge variant="secondary" className="w-fit">
              Since 2003
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
              20년의 시간이
              <br />
              <span className="text-primary">오늘의 스타코엑스</span>를<br />
              만들었습니다
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              제주의 작은 주유소에서 시작해 디지털 서비스, 파트너십 확장까지. 한
              걸음 한 걸음이 모여 지금의 스타코엑스가 되었습니다.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.entries(CATEGORY_STYLES).map(([label, style]) => (
                <span
                  key={label}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${style}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex max-h-[600px] justify-center gap-4 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
            <HistoryColumn items={firstColumn} duration={20} />
            <HistoryColumn items={secondColumn} duration={26} />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t" />

        {/* 섹션 2: 전체 연혁 2줄 그리드 */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-1">
            <Badge variant="secondary" className="w-fit">
              Full History
            </Badge>
            <h3 className="text-xl font-bold tracking-tight mt-2">
              전체 연혁 한눈에 보기
            </h3>
            <p className="text-muted-foreground text-sm">
              2003년부터 현재까지 {HISTORY_DATA.length}개의 발자취를 확인하세요.
            </p>
          </div>
          <HistoryGrid />
        </div>
      </div>
    </AboutLayout>
  );
};
