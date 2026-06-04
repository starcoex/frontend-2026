import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { COMPANY_NAV_CONFIG } from '@/app/config/company-nav.config';
import { cn } from '@/lib/utils';

interface MobileCompanyNavProps {
  onClose: () => void;
}

export const MobileCompanyNav: React.FC<MobileCompanyNavProps> = ({
  onClose,
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(
    location.pathname.startsWith('/about') || location.pathname === '/careers'
  );

  return (
    <div className="border-b border-border/50">
      {/* 아코디언 헤더 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        <span>회사소개</span>
        {/* ✅ 다른 아코디언과 동일한 패턴: 닫힘 → ChevronRight, 열림 → ChevronDown */}
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* 아코디언 콘텐츠 */}
      {isOpen && (
        <div className="pb-2 space-y-0.5">
          {COMPANY_NAV_CONFIG.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none mb-0.5">
                    {item.label}
                  </span>
                  <span className="text-xs opacity-70 leading-none">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
