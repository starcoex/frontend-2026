import { motion } from 'motion/react';
import { FileText, Shield, AlertTriangle, Scale, Phone } from 'lucide-react';
import { COMPANY_ZERAGAE, PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { useState } from 'react';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const LAST_UPDATED = '2026년 1월 1일';
const COMPANY_NAME = `${COMPANY_ZERAGAE.name}`; // ★ 하드코딩 제거

const TERMS_SECTIONS = [
  {
    number: '01',
    icon: <FileText className="w-4 h-4" />,
    title: '서비스 이용약관 목적 및 정의',
    accentColor: 'text-blue-500',
    content: [
      {
        subtitle: '목적',
        items: [
          '본 약관은 제라게 카케어가 제공하는 세차 서비스의 이용 조건과 절차를 규정합니다.',
          '회사와 이용자 간의 권리, 의무 및 책임사항을 명확히 합니다.',
        ],
      },
      {
        subtitle: '정의',
        items: [
          '"서비스"란 회사가 제공하는 세차 및 카케어 서비스 일체를 말합니다.',
          '"이용자"란 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.',
          '"회원"이란 서비스에 가입하여 계속적으로 이용하는 자를 말합니다.',
        ],
      },
      {
        subtitle: '약관의 효력',
        items: [
          '본 약관은 서비스 화면에 게시하여 효력이 발생합니다.',
          '회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.',
          '변경 시 7일 전 앱 내 공지사항을 통해 사전 고지합니다.',
        ],
      },
    ],
  },
  {
    number: '02',
    icon: <Shield className="w-4 h-4" />,
    title: '서비스 이용 조건',
    accentColor: 'text-green-500',
    content: [
      {
        subtitle: '회원가입',
        items: [
          '만 14세 이상 누구나 회원가입이 가능합니다.',
          '타인의 정보를 도용하여 가입할 수 없습니다.',
          '소셜 로그인(카카오·네이버·구글)으로 간편 가입 가능합니다.',
        ],
      },
      {
        subtitle: '서비스 이용',
        items: [
          '세차 서비스는 현장 방문 또는 앱을 통한 대기 접수로 이용 가능합니다.',
          '실시간 대기 현황 조회 및 알림 서비스를 제공합니다.',
          '세차 전용 카드 발급 및 포인트 적립·사용이 가능합니다.',
        ],
      },
      {
        subtitle: '이용 제한',
        items: [
          '타인의 계정을 도용하는 경우 서비스 이용이 제한됩니다.',
          '서비스를 악의적으로 이용하는 경우 계정이 정지될 수 있습니다.',
          '관련 법령을 위반하는 행위는 즉시 이용이 중단됩니다.',
        ],
      },
    ],
  },
  {
    number: '03',
    icon: <Scale className="w-4 h-4" />,
    title: '요금 및 결제',
    accentColor: 'text-amber-500',
    content: [
      {
        subtitle: '요금 정책',
        items: [
          '서비스 요금은 차종 및 선택한 세차 코스에 따라 결정됩니다.',
          '차량번호 기반으로 차종을 자동 분류하여 요금을 산정합니다.',
          '요금은 앱 및 현장에서 확인 가능하며 사전 고지 후 변경됩니다.',
        ],
      },
      {
        subtitle: '결제 수단',
        items: [
          '세차 전용 카드, 신용카드, 체크카드 등으로 결제 가능합니다.',
          '포인트는 세차 이용 금액의 일부를 적립하여 다음 이용 시 사용 가능합니다.',
          '결제 취소는 서비스 시작 전까지만 가능합니다.',
        ],
      },
      {
        subtitle: '환불 정책',
        items: [
          '서비스 시작 전 취소 시 전액 환불됩니다.',
          '서비스 진행 중 취소는 환불이 불가합니다.',
          '서비스 하자로 인한 불만족 시 재서비스 또는 환불 처리됩니다.',
        ],
      },
    ],
  },
  {
    number: '04',
    icon: <AlertTriangle className="w-4 h-4" />,
    title: '책임 제한 및 면책',
    accentColor: 'text-red-500',
    content: [
      {
        subtitle: '회사의 면책',
        items: [
          '천재지변, 불가항력적 사유로 인한 서비스 중단 시 책임을 지지 않습니다.',
          '이용자의 귀책사유로 발생한 손해에 대해 책임지지 않습니다.',
          '이용자가 게시한 정보의 정확성에 대해 책임지지 않습니다.',
        ],
      },
      {
        subtitle: '차량 손상',
        items: [
          '세차 과정에서 발생한 손상에 대해 현장 확인 후 처리합니다.',
          '세차 전 기존 스크래치 등은 별도 고지 후 서비스를 진행합니다.',
          '이의 제기는 서비스 완료 당일 내 접수해야 합니다.',
        ],
      },
    ],
  },
  {
    number: '05',
    icon: <Phone className="w-4 h-4" />,
    title: '고객센터 및 분쟁 해결',
    accentColor: 'text-purple-500',
    content: [
      {
        subtitle: '고객센터',
        items: [
          `업체명: ${COMPANY_NAME}`,
          `이메일: ${COMPANY_ZERAGAE.email}`,
          `전화: ${COMPANY_ZERAGAE.phone}`,
          '운영시간: 평일 08:30~18:30, 주말 09:00~18:00',
        ],
      },
      {
        subtitle: '분쟁 해결',
        items: [
          '분쟁 발생 시 회사와 이용자는 성실히 협의합니다.',
          '협의가 이루어지지 않을 경우 관할 법원에 소를 제기할 수 있습니다.',
          '관할 법원은 민사소송법상의 법원으로 합니다.',
        ],
      },
    ],
  },
] as const;

// ─── 섹션 아이템 ──────────────────────────────────────────────────────────────

function TermsSection({
  section,
  index,
  hovered,
  onHover,
}: {
  section: (typeof TERMS_SECTIONS)[number];
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

export function TermsPageCarWash() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <PageHead
        title={`서비스 이용약관 - ${APP_CONFIG.seo.siteName}`}
        description={`${APP_CONFIG.seo.siteName} 서비스 이용약관`}
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
              <span className="text-blue-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase">
                Legal
              </span>
              <h1 className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl">
                서비스 이용약관
              </h1>
              <p className="text-muted-foreground mt-4 max-w-lg text-base leading-relaxed">
                {COMPANY_NAME}의 세차 서비스 이용과 관련된 약관입니다.
                <br />
                서비스 이용 전 반드시 확인해 주세요.
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
              {TERMS_SECTIONS.map((section, i) => (
                <TermsSection
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
              className="mt-16 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 px-8 py-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">본 약관의 변경</p>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    이용약관이 변경될 경우 앱 내 공지사항 및 이메일을 통해 사전
                    고지합니다. 변경 사항에 동의하지 않으시면 서비스 이용을
                    중단하고 탈퇴하실 수 있습니다.
                  </p>
                  <p className="text-muted-foreground font-mono text-xs mt-3">
                    시행일: {LAST_UPDATED} &nbsp;·&nbsp; {COMPANY_NAME}
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
