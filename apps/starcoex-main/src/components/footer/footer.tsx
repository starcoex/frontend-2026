import { Link } from 'react-router-dom';
import {
  Phone,
  ExternalLink,
  Youtube,
  Instagram,
  FileText,
} from 'lucide-react';
import { SERVICES_CONFIG } from '@/app/config/service.config';
import { COMPANY_INFO } from '@/app/config/company.config';
import { StarLogo } from '@starcoex-frontend/common';
import { CardDescription, CardTitle } from '@/components/ui/card';

const sections = [
  {
    title: '서비스',
    links: SERVICES_CONFIG.map((service) => ({
      name: service.name,
      href: service.href,
      isExternal: service.isExternalApp || false,
      icon: service.icon,
    })),
  },
  {
    title: '고객지원',
    links: [
      { name: '고객센터', href: '/support', isExternal: false },
      { name: '자주 묻는 질문', href: '/faq', isExternal: false },
    ],
  },
  {
    title: '약관',
    links: [
      { name: '이용약관', href: '/terms', isExternal: false },
      { name: '개인정보처리방침', href: '/privacy', isExternal: false },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container flex justify-between gap-8 border-x py-4 max-lg:flex-col lg:py-8">
        {/* 왼쪽: 로고 및 회사 정보 */}
        <div className="mb-8 flex-1">
          <Link to="/" className="flex items-center gap-3">
            <StarLogo
              width={40}
              height={40}
              className={'invert dark:invert-0 object-contain'}
            />
            <div>
              <div className="text-2xl leading-tight font-semibold max-sm:text-xl">
                {COMPANY_INFO.name}
              </div>
              <div className="text-sm text-muted-foreground max-sm:text-xs">
                {COMPANY_INFO.nameEn}
              </div>
            </div>
          </Link>
          <CardDescription className="text-muted-foreground text-sm mt-4 max-w-md max-sm:text-xs leading-relaxed">
            {COMPANY_INFO.description}
          </CardDescription>
        </div>

        {/* 오른쪽: 모든 링크 섹션들 - 반응형으로 배치 */}
        <div className="flex flex-1 justify-between gap-6 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1 lg:flex lg:justify-between lg:gap-8">
          {/* 서비스, 고객지원, 약관 섹션들 */}
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="min-w-0">
              <CardTitle className="text-muted-foreground-subtle text-sm tracking-[-0.28px] font-medium mb-3 lg:mb-6">
                {section.title}
              </CardTitle>
              <ul className="space-y-2 text-sm tracking-[-0.28px] lg:space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="hover:text-primary min-w-0">
                    {link.isExternal ? (
                      <Link
                        to={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 min-w-0"
                      >
                        {'icon' in link && link.icon && (
                          <link.icon className="w-3 h-3 flex-shrink-0" />
                        )}
                        <span className="truncate text-xs lg:text-sm">
                          {link.name}
                        </span>
                        <ExternalLink className="w-2 h-2 lg:w-3 lg:h-3 opacity-60 flex-shrink-0" />
                      </Link>
                    ) : (
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 min-w-0"
                      >
                        {'icon' in link && link.icon && (
                          <link.icon className="w-3 h-3 flex-shrink-0" />
                        )}
                        <span className="truncate text-xs lg:text-sm">
                          {link.name}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 연락처 섹션 */}
          <div className="min-w-0">
            <CardTitle className="text-muted-foreground-subtle text-sm tracking-[-0.28px] font-medium mb-3 lg:mb-6">
              연락처
            </CardTitle>
            <div className="space-y-2 lg:space-y-4">
              <Link
                to={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-2 text-xs lg:text-sm hover:text-primary min-w-0"
              >
                <Phone className="w-3 h-3 flex-shrink-0" />
                <CardDescription className="truncate text-xs">
                  {COMPANY_INFO.phone}
                </CardDescription>
              </Link>
              <div className="text-xs lg:text-sm text-muted-foreground">
                <div className="truncate">{COMPANY_INFO.hours}</div>
                <div className="text-xs truncate">토요일 09:00-13:00</div>
              </div>
            </div>
          </div>

          {/* 소셜미디어 섹션 */}
          <div className="min-w-0">
            <CardTitle className="text-muted-foreground-subtle text-sm tracking-[-0.28px] font-medium mb-3 lg:mb-6">
              소셜미디어
            </CardTitle>
            <div className="text-muted-foreground-subtle flex gap-2 lg:gap-3">
              <Link
                to={
                  COMPANY_INFO.social.instagram ||
                  'https://instagram.com/starcoex'
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-primary transition-colors"
              >
                <Instagram size={18} className="lg:w-5 lg:h-5" />
              </Link>
              <Link
                to={
                  COMPANY_INFO.social.youtube || 'https://youtube.com/@starcoex'
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-primary transition-colors"
              >
                <Youtube size={18} className="lg:w-5 lg:h-5" />
              </Link>
              <Link
                to="https://blog.naver.com/starcoex"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="네이버 블로그"
                className="hover:text-primary transition-colors"
              >
                <FileText size={18} className="lg:w-5 lg:h-5" />
              </Link>
              <Link
                to={
                  COMPANY_INFO.social.facebook ||
                  'https://facebook.com/starcoex'
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-primary transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="lg:w-5 lg:h-5"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground-subtle container border-x border-t border-b py-4 text-sm tracking-[-0.28px] lg:py-8">
        <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2">
          <p className="text-xs lg:text-sm">
            © {new Date().getFullYear()} {COMPANY_INFO.name}(
            {COMPANY_INFO.nameEn}). All rights reserved.
          </p>
        </div>
      </div>

      <div className="container h-6 border-x"></div>
    </footer>
  );
};
