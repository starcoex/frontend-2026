import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  CardTitle,
} from '../ui';
import { cn } from '../../utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageLayoutProps {
  /** 브레드크럼 항목들 */
  breadcrumbs?: BreadcrumbItem[];
  /** 페이지 타이틀 */
  title?: string;
  /** 타이틀 우측 액션 영역 */
  actions?: React.ReactNode;
  /** 타이틀 아래 추가 콘텐츠 (탭, 통계 등) */
  subContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({
  breadcrumbs,
  title,
  actions,
  subContent,
  children,
  className,
}: PageLayoutProps) {
  return (
    <main className={cn('flex h-full flex-1 flex-col p-3 sm:p-4', className)}>
      {/* 헤더 영역 */}
      {(breadcrumbs || title || subContent) && (
        <div className="mb-4 flex flex-col gap-3">
          {/* 브레드크럼 */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* 타이틀 + 액션 */}
          {title && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                {title}
              </CardTitle>
              {actions && (
                <div className="flex items-center gap-2">{actions}</div>
              )}
            </div>
          )}

          {/* 서브 콘텐츠 (통계카드, 탭 등) */}
          {subContent}
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="flex-1">{children}</div>
    </main>
  );
}
