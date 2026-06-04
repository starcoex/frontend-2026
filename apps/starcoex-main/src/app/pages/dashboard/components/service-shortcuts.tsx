import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SERVICES_CONFIG } from '@/app/config/service.config';
import { cn } from '@/lib/utils';

export const ServiceShortcuts: React.FC = () => {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">서비스 바로가기</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SERVICES_CONFIG.sort((a, b) => a.order - b.order).map((service) => {
          const Icon = service.icon;
          return (
            <a
              key={service.id}
              href={service.available ? service.href : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'relative flex flex-col items-center gap-3 p-5 rounded-xl border bg-card',
                'transition-all text-center group',
                service.available
                  ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              )}
            >
              {/* 준비중 뱃지 */}
              {!service.available && (
                <span className="absolute top-2.5 right-2.5 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                  준비중
                </span>
              )}

              {/* 아이콘 */}
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center transition-transform',
                  service.color.background,
                  service.available && 'group-hover:scale-110'
                )}
              >
                <Icon className={cn('w-6 h-6', service.color.primary)} />
              </div>

              {/* 이름 */}
              <div className="space-y-0.5">
                <div className="text-sm font-semibold">{service.name}</div>
                <div className="text-xs text-muted-foreground leading-tight line-clamp-2">
                  {service.description}
                </div>
              </div>

              {/* 외부 링크 아이콘 */}
              {service.available && (
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};
