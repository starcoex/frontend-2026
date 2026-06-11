import { motion } from 'motion/react';
import { Shield, Lock, Eye, Trash2, Phone } from 'lucide-react';
import { COMPANY_ZERAGAE, PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { useState } from 'react';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const LAST_UPDATED = '2026년 1월 1일';
const COMPANY_NAME = `${COMPANY_ZERAGAE.name}`; // ★ 하드코딩 제거

const PRIVACY_SECTIONS = [
  {
    number: '01',
    icon: <Eye className="w-4 h-4" />,
    title: '수집하는 개인정보 항목',
    accentColor: 'text-cyan-500',
    content: [
      {
        subtitle: '회원 가입 시',
        items: [
          '필수: 이름, 이메일 주소, 비밀번호',
          '선택: 전화번호, 차량번호',
          '소셜 로그인 시: 카카오·네이버·구글 제공 기본 정보',
        ],
      },
      {
        subtitle: '세차 서비스 이용 시',
        items: [
          '차량번호 (차종 분류 및 요금 산정 목적)',
          '결제 정보 (세차 전용 카드 번호, 결제 수단)',
          '서비스 이용 기록 (세차 코스, 방문 일시)',
        ],
      },
      {
        subtitle: '자동 수집',
        items: [
          '앱 접속 기기 정보, OS 버전',
          '서비스 이용 기록, 접속 로그',
          '실시간 대기 현황 조회 기록',
        ],
      },
    ],
  },
  {
    number: '02',
    icon: <Shield className="w-4 h-4" />,
    title: '개인정보 수집 및 이용 목적',
    accentColor: 'text-green-500',
    content: [
      {
        subtitle: '서비스 제공',
        items: [
          '세차 접수, 대기열 관리, 서비스 제공',
          '차량번호 기반 차종 자동 분류 및 요금 안내',
          '실시간 대기 현황 알림 발송',
        ],
      },
      {
        subtitle: '회원 관리',
        items: [
          '회원 식별 및 본인 확인',
          '세차 전용 카드 발급 및 포인트 적립·사용',
          '고객 문의 및 불만 처리',
        ],
      },
      {
        subtitle: '서비스 개선',
        items: [
          '시간대별 방문 패턴 분석 (익명화 처리)',
          '서비스 품질 향상을 위한 통계 분석',
        ],
      },
    ],
  },
  {
    number: '03',
    icon: <Lock className="w-4 h-4" />,
    title: '개인정보 보유 및 이용 기간',
    accentColor: 'text-orange-500',
    content: [
      {
        subtitle: '회원 정보',
        items: [
          '회원 탈퇴 시까지 보유 후 즉시 파기',
          '단, 관련 법령에 따라 일정 기간 보관',
        ],
      },
      {
        subtitle: '법령에 의한 보관',
        items: [
          '계약·청약철회 기록: 5년 (전자상거래법)',
          '소비자 불만·분쟁 기록: 3년 (전자상거래법)',
          '접속 로그: 3개월 (통신비밀보호법)',
        ],
      },
      {
        subtitle: 'CCTV 영상',
        items: [
          '세차장 내 CCTV 영상: 30일 후 자동 삭제',
          '분쟁·사고 발생 시 관련 기간 연장 보관 가능',
        ],
      },
    ],
  },
  {
    number: '04',
    icon: <Trash2 className="w-4 h-4" />,
    title: '개인정보 파기 절차 및 방법',
    accentColor: 'text-purple-500',
    content: [
      {
        subtitle: '파기 절차',
        items: [
          '목적 달성 후 별도 DB로 이전하여 내부 방침에 따라 파기',
          '보유 기간 경과 후 지체 없이 파기',
        ],
      },
      {
        subtitle: '파기 방법',
        items: [
          '전자적 파일: 복구 불가능한 방법으로 영구 삭제',
          '종이 문서: 분쇄기로 파쇄 또는 소각',
        ],
      },
    ],
  },
  {
    number: '05',
    icon: <Phone className="w-4 h-4" />,
    title: '개인정보 보호 책임자 및 문의',
    accentColor: 'text-blue-500',
    content: [
      {
        subtitle: '개인정보 보호 책임자',
        items: [
          `업체명: ${COMPANY_NAME}`,
          `이메일: ${COMPANY_ZERAGAE.email}`,
          `전화: ${COMPANY_ZERAGAE.phone}`,
          `주소: ${COMPANY_ZERAGAE.address}`,
        ],
      },
      {
        subtitle: '권익 침해 구제 기관',
        items: [
          '개인정보보호위원회: www.pipc.go.kr / 국번없이 182',
          '한국인터넷진흥원 개인정보침해신고센터: privacy.kisa.or.kr / 118',
        ],
      },
    ],
  },
] as const;

// ─── 섹션 아이템 ──────────────────────────────────────────────────────────────

function PrivacySection({
  section,
  index,
  hovered,
  onHover,
}: {
  section: (typeof PRIVACY_SECTIONS)[number];
  index: number;
  hovered: number | null;
  onHover: (i: number | null) => void;
}) {
  return (
    <motion.div
      className="cursor-default border-b border-dashed py-8 last:border-b-0"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
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
          opacity: hovered === null || hovered === index ? 1 : 0.25,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ x: hovered === index ? 6 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* 번호 + 구분선 */}
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`font-mono text-[0.625rem] font-medium tracking-wider ${section.accentColor}`}
            >
              {section.number}
            </span>
            <div
              className={`h-px flex-1 opacity-30 ${section.accentColor.replace(
                'text-',
                'bg-'
              )}`}
            />
          </div>

          {/* 타이틀 */}
          <div className="flex items-center gap-3 mb-6">
            <span className={section.accentColor}>{section.icon}</span>
            <h3 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
              {section.title}
            </h3>
          </div>

          {/* 내용 그리드 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.content.map((block) => (
              <div key={block.subtitle}>
                <p
                  className={`font-mono text-[0.625rem] font-semibold tracking-wider uppercase mb-2 ${section.accentColor}`}
                >
                  {block.subtitle}
                </p>
                <ul className="space-y-1.5">
                  {block.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span
                        className={`shrink-0 mt-1.5 w-1 h-1 rounded-full ${section.accentColor.replace(
                          'text-',
                          'bg-'
                        )}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function PrivacyPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <PageHead
        title={`개인정보처리방침 - ${APP_CONFIG.seo.siteName}`}
        description={`${APP_CONFIG.seo.siteName} 개인정보처리방침`}
        siteName={APP_CONFIG.seo.siteName}
        robots="noindex"
      />

      <div className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ hidden: {}, visible: {} }}
          >
            {/* ── 헤더 */}
            <motion.div
              className="mb-16 md:mb-24"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-cyan-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase">
                Legal
              </span>
              <h1 className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl">
                개인정보처리방침
              </h1>
              <p className="text-muted-foreground mt-4 max-w-lg text-base leading-relaxed">
                {COMPANY_NAME}은 고객님의 개인정보를 소중히 여깁니다.
                <br />본 방침은 수집하는 정보와 사용 방법을 투명하게 안내합니다.
              </p>
              <p className="text-muted-foreground mt-3 font-mono text-xs">
                최종 업데이트: {LAST_UPDATED}
              </p>
            </motion.div>

            {/* ── 섹션 목록 */}
            <motion.div
              className="space-y-0"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 },
                },
              }}
            >
              {PRIVACY_SECTIONS.map((section, i) => (
                <PrivacySection
                  key={section.number}
                  section={section}
                  index={i}
                  hovered={hovered}
                  onHover={setHovered}
                />
              ))}
            </motion.div>

            {/* ── 하단 고지 */}
            <motion.div
              className="mt-16 rounded-2xl border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50 dark:bg-cyan-950/20 px-8 py-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">본 방침의 변경</p>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    개인정보처리방침이 변경될 경우 앱 내 공지사항 및 이메일을
                    통해 사전 고지합니다. 변경 사항에 동의하지 않으시면 서비스
                    이용을 중단하고 탈퇴하실 수 있습니다.
                  </p>
                  <p className="text-muted-foreground font-mono text-xs mt-3">
                    시행일: {LAST_UPDATED} &nbsp;·&nbsp; {COMPANY_NAME}
                    &nbsp;·&nbsp; &copy; {new Date().getFullYear()}{' '}
                    {COMPANY_ZERAGAE.name}. All rights reserved.{' '}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
