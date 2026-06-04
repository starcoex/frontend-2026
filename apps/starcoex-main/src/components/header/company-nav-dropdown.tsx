import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { COMPANY_NAV_CONFIG } from '@/app/config/company-nav.config';
import { cn } from '@/lib/utils';

export const CompanyNavDropdown: React.FC = () => {
  const location = useLocation();

  const isCompanyRoute =
    location.pathname.startsWith('/about') || location.pathname === '/careers';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'bg-transparent text-sm font-medium transition-colors hover:bg-accent',
            isCompanyRoute
              ? 'text-primary'
              : 'text-foreground hover:text-accent-foreground'
          )}
        >
          <Building2 className="w-4 h-4 mr-2" />
          회사소개
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-2 space-y-0.5" align="start">
        {COMPANY_NAV_CONFIG.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer group',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:text-accent-foreground'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors',
                    isActive
                      ? 'bg-primary/20'
                      : 'bg-muted group-hover:bg-primary/10'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-primary'
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none mb-0.5">
                    {item.label}
                  </span>
                  <span className="text-xs text-muted-foreground leading-none">
                    {item.description}
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
