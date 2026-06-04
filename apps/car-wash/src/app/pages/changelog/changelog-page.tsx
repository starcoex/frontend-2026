// apps/car-wash/src/app/pages/changelog/changelog-page.tsx
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/app/config/app.config';

// ─── 타입 ────────────────────────────────────────────────────────────────────

interface ChangelogEntry {
  version: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

// ─── 데이터 — 새 항목은 위에 추가 ───────────────────────────────────────────

const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: '1.4.0',
    title: '실시간 대기 현황 앱 알림 추가',
    date: '2026-05-01',
    description:
      '대기 순번이 2번 앞으로 당겨지면 앱 푸시 알림을 받을 수 있습니다. 차 안에서 기다리다가 놓치는 일 없이, 정확한 타이밍에 이동하세요.',
    tags: ['신기능', '앱'],
  },
  {
    version: '1.3.2',
    title: '차종 자동 인식 정확도 개선',
    date: '2026-03-15',
    description:
      '차량번호 입력 시 차종(승용/SUV/스타리아 등)을 자동으로 분류해 정확한 요금을 안내합니다. 인식 실패율을 기존 대비 70% 낮췄습니다.',
    tags: ['개선'],
  },
  {
    version: '1.3.0',
    title: '세차 전용 카드 잔액 조회 기능',
    date: '2026-02-10',
    description:
      '앱에서 세차 전용 카드 잔액을 바로 확인할 수 있습니다. 매장 방문 전 잔액 부족을 미리 체크하세요.',
    tags: ['신기능'],
  },
  {
    version: '1.2.1',
    title: '대기 취소 기능 추가',
    date: '2026-01-20',
    description:
      '부득이하게 대기를 취소해야 할 때 앱에서 바로 취소할 수 있습니다. 취소 시 다음 대기 차량에 자동 알림이 전송됩니다.',
    tags: ['개선'],
  },
  {
    version: '1.2.0',
    title: '비회원 대기 접수 지원',
    date: '2025-12-01',
    description:
      '회원 가입 없이도 이름·전화번호만으로 대기 접수가 가능합니다. 처음 방문하시는 고객도 앱에서 바로 대기열에 합류하세요.',
    tags: ['신기능'],
  },
  {
    version: '1.1.0',
    title: '반짝반짝 코스 · 타이어 드레싱 추가',
    date: '2025-10-05',
    description:
      '기존 기본·별표 2가지 코스에 반짝반짝 외부 손세차 코스가 추가되었습니다. 버블분사·휠세척·온수고압세척 후 타이어 드레싱까지 완성됩니다.',
    tags: ['서비스'],
  },
  {
    version: '1.0.0',
    title: '제라게 카케어 앱 정식 출시',
    date: '2025-07-01',
    description:
      '별표주유소 제라게 카케어가 앱을 통한 실시간 대기 접수를 시작합니다. 현장에서 직접 번호표를 뽑지 않아도 앱에서 대기열에 합류하고 알림을 받을 수 있습니다.',
    tags: ['출시'],
  },
];

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function groupByYear(entries: ChangelogEntry[]): [string, ChangelogEntry[]][] {
  const grouped = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    const year = new Date(entry.date).getFullYear().toString();
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(entry);
  }
  return Array.from(grouped);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const TAG_STYLES: Record<string, string> = {
  신기능: 'border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
  개선: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10',
  서비스:
    'border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10',
  출시: 'border-purple-500/40 text-purple-600 dark:text-purple-400 bg-purple-500/10',
  앱: 'border-orange-500/40 text-orange-600 dark:text-orange-400 bg-orange-500/10',
};

// ─── 애니메이션 ───────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease },
  },
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function ChangelogPage() {
  const navigate = useNavigate();
  const grouped = groupByYear(CHANGELOG_ENTRIES);
  const latestVersion = CHANGELOG_ENTRIES[0]?.version;

  return (
    <>
      <PageHead
        title={`업데이트 내역 - ${APP_CONFIG.seo.siteName}`}
        description="제라게 카케어 앱의 새로운 기능과 개선 사항을 확인하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/changelog`}
        robots="index, follow"
      />

      {/* 배경 블롭 */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-cyan-400/10 to-transparent rounded-full blur-3xl" />
      </div>

      <section className="py-20 md:py-28 relative z-10">
        <div className="container max-w-4xl">
          {/* ── 헤더 */}
          <motion.div
            className="mb-16 md:mb-24"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="text-cyan-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase">
              업데이트 내역
            </span>
            <h1 className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl">
              더 나은 세차 경험을
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                계속 만들어갑니다
              </span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed">
              새로운 기능 추가와 개선 사항을 투명하게 공개합니다.
            </p>
          </motion.div>

          {/* ── 연도별 그룹 */}
          <div className="group/changelog">
            {grouped.map(([year, yearEntries], groupIndex) => (
              <motion.div
                key={year}
                className="group/year relative mb-16 last:mb-0"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.12,
                      delayChildren: groupIndex === 0 ? 0.2 : 0.1,
                    },
                  },
                }}
              >
                {/* 연도 레이블 — changelog-content.tsx 동일 패턴 */}
                <motion.span
                  className="text-cyan-500/20 group-has-data-entry:group-hover/year:text-cyan-500/40 text-6xl font-extrabold leading-none tracking-tighter transition-colors duration-300 block mb-8 md:text-8xl select-none"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease }}
                >
                  {year}
                </motion.span>

                <motion.div
                  className="flex flex-col gap-8 md:ml-8"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                >
                  {yearEntries.map((entry) => {
                    const isLatest = entry.version === latestVersion;

                    // ── 최신 버전: 강조 카드 (changelog-content.tsx bg-foreground 패턴)
                    if (isLatest) {
                      return (
                        <motion.div
                          key={entry.version}
                          className="bg-gradient-to-br from-cyan-600 via-blue-700 to-cyan-800 rounded-2xl p-6 md:p-8 relative overflow-hidden"
                          variants={fadeUp}
                        >
                          {/* 배경 패턴 */}
                          <div
                            aria-hidden
                            className="absolute inset-0 opacity-[0.05]"
                            style={{
                              backgroundImage:
                                'radial-gradient(circle, white 1px, transparent 1px)',
                              backgroundSize: '24px 24px',
                            }}
                          />
                          <div className="relative z-10">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className="border-white/30 text-white bg-white/15 font-mono"
                              >
                                v{entry.version}
                              </Badge>
                              {entry.tags?.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="border-white/20 text-white/70 bg-white/10 text-[10px]"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              <span className="text-white/40 font-mono text-xs ml-auto">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            <h2 className="text-white text-2xl font-bold tracking-tight md:text-3xl">
                              {entry.title}
                            </h2>
                            <p className="text-white/60 mt-2 max-w-lg text-sm leading-relaxed">
                              {entry.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    }

                    // ── 이전 버전: 좌측 보더 라인 패턴
                    return (
                      <motion.div
                        key={entry.version}
                        data-entry
                        className="border-l-2 border-cyan-500/20 hover:border-cyan-500/60 py-1 pl-6 transition-[border-color,opacity] duration-300 group-hover/changelog:opacity-50 hover:!opacity-100"
                        variants={fadeUp}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 font-mono text-[10px]"
                          >
                            v{entry.version}
                          </Badge>
                          {entry.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`text-[10px] ${TAG_STYLES[tag] ?? ''}`}
                            >
                              {tag}
                            </Badge>
                          ))}
                          <span className="text-muted-foreground font-mono text-xs ml-auto">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                          {entry.title}
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">
                          {entry.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* ── 하단 CTA — changelog-content.tsx 패턴 */}
          <motion.div
            className="py-10 text-center md:py-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase mb-4">
              지금 바로 · 예약 없이 · 10분 완성
            </p>
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/25"
              onClick={() => navigate(APP_CONFIG.routes.speed)}
            >
              <Zap className="w-4 h-4 mr-2" />
              10분 세차 시작하기
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
