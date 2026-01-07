import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Phone, Mail } from 'lucide-react';
import { StarOilLogo } from '@starcoex-frontend/common';
import { Separator } from '@/components/ui/separator';

const navigation = [
  {
    title: '서비스',
    links: [
      { name: '24시간 주유', href: '/services' },
      { name: '실시간 유가', href: '/prices' },
      { name: '주유소 위치', href: '/fuels' },
      { name: '세차 서비스', href: 'https://car-wash.starcoex.com' },
    ],
  },
  {
    title: '고객 지원',
    links: [
      { name: '고객센터', href: '/support' },
      { name: '자주 묻는 질문', href: '/faq' },
      { name: '채용 정보', href: '/about#careers' },
      { name: '제휴 문의', href: '/contact' },
    ],
  },
  {
    title: '회사 정보',
    links: [
      { name: '회사 소개', href: '/about' },
      { name: '오시는 길', href: '/location' },
      { name: '연락처', href: '/contact' },
      { name: '공지사항', href: '/news' },
    ],
  },
];

const socialLinks = [
  { icon: Phone, href: 'tel:064-123-4567' },
  { icon: Mail, href: 'mailto:info@stargas.co.kr' },
  { icon: Facebook, href: 'https://facebook.com/stargas' },
  { icon: Instagram, href: 'https://instagram.com/stargas_jeju' },
  { icon: Youtube, href: 'https://youtube.com/@stargas' },
];

const legal = [
  { name: '이용약관', href: '/terms' },
  { name: '개인정보처리방침', href: '/privacy' },
  { name: '사업자정보', href: '/business-info' },
];

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-16 md:py-24">
        {/* 상단: 로고 및 네비게이션 */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* 브랜드 및 소셜 영역 */}
          <div className="flex flex-col gap-6">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <StarOilLogo width={40} height={40} />
              <div>
                <div className="text-xl font-bold">별표주유소</div>
                <div className="text-xs text-muted-foreground -mt-1">
                  JEJU GAS STATION
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              제주도 전역 어디서나 가장 합리적인 가격으로 주유하고, 프리미엄
              세차 서비스까지 경험하세요.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  {...(link.href.startsWith('http') && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                >
                  <link.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* 네비게이션 링크 영역 */}
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="hover:text-foreground transition-colors"
                      {...(link.href.startsWith('http') && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12" />

        {/* 하단: 법적 고지 및 저작권 */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 text-xs text-muted-foreground">
            <div className="flex flex-col gap-1 md:flex-row md:gap-4">
              <span>대표: 김현진</span>
              <span className="hidden md:inline">|</span>
              <span>사업자등록번호: 123-45-67890</span>
              <span className="hidden md:inline">|</span>
              <span>주소: 제주특별자치도 연삼로 12</span>
            </div>
            <p>© 2025 별표주유소. All rights reserved.</p>
          </div>

          <div className="flex gap-6 text-xs text-muted-foreground">
            {legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="hover:text-foreground transition-colors underline underline-offset-4"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
