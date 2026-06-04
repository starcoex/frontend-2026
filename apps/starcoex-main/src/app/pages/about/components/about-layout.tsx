import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const ABOUT_NAV = [
  { label: '회사소개', href: '/about' },
  { label: '핵심가치', href: '/about/philosophy' },
  { label: '주요 연혁', href: '/about/history' },
  { label: 'CI 소개', href: '/about/ci' },
  { label: '인재채용', href: '/careers' },
] as const;

interface AboutLayoutProps {
  /** 페이지 타이틀 (한국어) */
  title: string;
  /** 페이지 서브타이틀 */
  subtitle?: string;
  children: React.ReactNode;
}

export const AboutLayout: React.FC<AboutLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* 히어로 헤더 */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b py-14 px-4">
        <div className="max-w-5xl mx-auto">
          {/* 브레드크럼 */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              홈
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{title}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-muted-foreground text-base md:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
        {/* 사이드 네비게이션 */}
        <aside className="md:w-44 shrink-0">
          <nav className="sticky top-24 space-y-1">
            {ABOUT_NAV.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* 본문 */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
