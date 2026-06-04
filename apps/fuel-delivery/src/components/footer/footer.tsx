import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Facebook, Instagram, Youtube } from 'lucide-react';

const COLUMNS = [
  {
    title: '서비스',
    links: [
      { name: '빠른 주문', href: '/order' },
      { name: '배송 추적', href: '/tracking' },
      { name: '정량 보장', href: '/guarantee' },
      { name: '요금 안내', href: '/pricing' },
    ],
  },
  {
    title: '회사',
    links: [
      { name: '회사 소개', href: '/about' },
      { name: '서비스 소개', href: '/features' },
      { name: '공지사항', href: '/blog' },
      { name: '고객센터', href: '/contact' },
    ],
  },
  {
    title: '약관 및 정책',
    links: [
      { name: '이용약관', href: '/terms' },
      { name: '개인정보처리방침', href: '/privacy' },
      { name: '회원가입', href: '/auth/register' },
      { name: '로그인', href: '/auth/login' },
    ],
  },
];

const SOCIALS = [
  { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground px-2.5 lg:px-0">
      <div className="container py-12 md:py-16">
        {/* 상단 — 로고 + 컬럼 */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* 로고 + 브랜드 */}
          <div className="md:min-w-[160px] space-y-4">
            <Link
              to="/"
              aria-label="별표주유소 난방유 배달"
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="font-bold text-lg text-white block">
                  난방유 배달
                </span>
                <span className="text-xs text-primary-foreground/60">
                  by 별표주유소
                </span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-[200px]">
              정량 보장과 실시간 배송 추적으로 믿을 수 있는 난방유 배달 서비스를
              제공합니다.
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-primary-foreground/60">
                서울 · 경기 배달 운영 중
              </span>
            </div>
          </div>

          {/* 링크 컬럼 */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:flex md:w-[540px] md:items-start md:justify-between md:gap-0">
            {COLUMNS.map((col) => (
              <div key={col.title} className="min-w-0">
                <h3 className="text-primary-foreground/50 mb-4 text-sm leading-tight font-medium">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.name}>
                      <Link
                        to={l.href}
                        className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-normal transition-colors"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-primary-foreground/20 mt-12 border-t" />

        {/* 하단 바 */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-primary-foreground/50 text-sm font-normal">
            © {new Date().getFullYear()} 별표주유소. All rights reserved.
          </p>

          {/* 소셜 링크 */}
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
