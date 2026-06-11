import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import { APP_CONFIG } from '@/app/config/app.config';
import { COMPANY_ZERAGAE, ZeragaeLogo } from '@starcoex-frontend/common';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const SERVICE_LINKS = [
  { label: '⚡ 10분 스피드 세차', href: APP_CONFIG.routes.speed },
  { label: '💎 프리미엄 디테일링', href: APP_CONFIG.routes.premium },
  { label: '예약 내역', href: APP_CONFIG.routes.bookings },
] as const;

const SUPPORT_LINKS = [
  { label: '자주 묻는 질문', href: APP_CONFIG.routes.faq },
  { label: '연락처', href: APP_CONFIG.routes.contact },
  { label: '회사 소개', href: APP_CONFIG.routes.about },
] as const;

const LEGAL_LINKS = [
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
] as const;

// 인스타그램 SVG 아이콘
const IconInstagram = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// ─── 인스타그램 버튼 (샘플의 App Store / Google Play 버튼 패턴) ───────────────

interface InstaButtonProps {
  href: string;
  accountName: string;
  label: string;
}

function InstaButton({ href, accountName, label }: InstaButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="bg-foreground hover:bg-foreground/90 flex h-9 items-center gap-2 rounded-lg px-3 transition-colors"
    >
      <IconInstagram className="text-background size-4 shrink-0" />
      <div className="text-background">
        <p className="text-[0.45rem] leading-none whitespace-nowrap opacity-70">
          Follow us on
        </p>
        <p className="text-xs leading-tight font-semibold whitespace-nowrap">
          {accountName}
        </p>
      </div>
    </a>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export const Footer: React.FC = () => {
  return (
    <footer className="container pb-12">
      <div className="border-t border-dashed pt-10">
        <div className="grid gap-12 md:grid-cols-2">
          {/* ── 좌측: 브랜드 — 샘플 Left 패턴 */}
          <div>
            <ZeragaeLogo width={36} height={36} />
            <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed">
              10분 빠른 손세차부터 전문 디테일링까지. 제주 별표주유소 안에서
              바로 이용하세요.
            </p>

            {/* 인스타그램 버튼 2개 — 샘플의 App Store / Google Play 패턴 */}
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <InstaButton
                href="https://www.instagram.com/byulpyo_oil"
                accountName="@byulpyo_oil"
                label="별표주유소 인스타그램"
              />
              <InstaButton
                href="https://www.instagram.com/jeju_zeragae"
                accountName="@jeju_zeragae"
                label="제라게 카케어 인스타그램"
              />
            </div>

            {/* 연락처 + 위치 */}
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="tel:064-713-2002"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                064-713-2002
              </a>
              <a
                href="https://maps.naver.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                제주특별자치도 제주시 (별표주유소 내)
              </a>
            </div>
          </div>

          {/* ── 우측: 링크 컬럼 — 샘플 Right 패턴 */}
          <div className="grid grid-cols-3 gap-8">
            {/* 서비스 */}
            <div>
              <span className="text-muted-foreground mb-3 block font-mono text-[0.625rem] tracking-wider uppercase">
                서비스
              </span>
              <div className="flex flex-col gap-2.5">
                {SERVICE_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-foreground hover:text-cyan-500 text-sm no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 고객 지원 */}
            <div>
              <span className="text-muted-foreground mb-3 block font-mono text-[0.625rem] tracking-wider uppercase">
                고객 지원
              </span>
              <div className="flex flex-col gap-2.5">
                {SUPPORT_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-foreground hover:text-cyan-500 text-sm no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 운영 시간 */}
            <div>
              <span className="text-muted-foreground mb-3 block font-mono text-[0.625rem] tracking-wider uppercase">
                운영 시간
              </span>
              <div className="flex flex-col gap-2 text-sm">
                {(
                  [
                    { label: '평일', key: 'weekday' },
                    { label: '주말', key: 'weekend' },
                    { label: '공휴일', key: 'holiday' },
                  ] as const
                ).map(({ label, key }) => (
                  <div key={key}>
                    <span className="text-muted-foreground text-xs">
                      {label}
                    </span>
                    <span className="block font-medium text-foreground text-xs">
                      {APP_CONFIG.service.operatingHours[key].start}
                      {' – '}
                      {APP_CONFIG.service.operatingHours[key].end}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-dashed pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground font-mono text-[0.625rem]">
              대표: {COMPANY_ZERAGAE.ceo} &nbsp;|&nbsp; 사업자등록번호:{' '}
              {COMPANY_ZERAGAE.bizNumber}
            </span>
            <span className="text-muted-foreground font-mono text-[0.625rem]">
              주소: {COMPANY_ZERAGAE.address}
            </span>
            <span className="text-muted-foreground font-mono text-[0.625rem]">
              &copy; {new Date().getFullYear()} {COMPANY_ZERAGAE.name}. All
              rights reserved.
            </span>
          </div>

          <div className="flex gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-foreground font-mono text-[0.625rem] transition-colors underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
