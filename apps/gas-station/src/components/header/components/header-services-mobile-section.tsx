import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { StarcoexService } from '@/app/utils/brand-constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StarcoexServicesMobileSectionProps {
  services: StarcoexService[];
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClose: () => void;
  onServiceClick?: (service: StarcoexService) => void;
}

// 현재 앱이 car-wash인지 확인하는 함수
const isCarWashApp = () => {
  return (
    window.location.hostname.includes('car-wash') ||
    window.location.pathname.includes('car-wash') ||
    document.title.includes('세차') ||
    document.title.includes('CAR WASH')
  );
};

export const HeaderServicesMobileSection: React.FC<
  StarcoexServicesMobileSectionProps
> = ({
  services,
  title = '다른 서비스',
  icon: Icon = ExternalLink,
  className = '',
  onClose,
  onServiceClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleServiceClick = (service: StarcoexService) => {
    if (onServiceClick) {
      onServiceClick(service);
    } else {
      window.open(service.href, '_blank');
    }
    onClose();
  };

  const hideIcons = isCarWashApp();

  return (
    <div className={`mx-2 ${className}`}>
      <Button
        variant="ghost"
        className="group flex items-center justify-between w-full h-auto px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {!hideIcons ||
            (Icon && (
              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
            ))}
          <span className="text-foreground group-hover:text-accent-foreground transition-colors">
            {title}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-transform" />
        )}
      </Button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="mt-1 ml-8 space-y-1">
          {services.map((service) => {
            const ServiceIcon = service.icon;
            return (
              <Button
                key={service.id}
                variant="ghost"
                className="group flex w-full h-auto items-start gap-3 px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground rounded-lg justify-start"
                onClick={() => handleServiceClick(service)}
              >
                {!hideIcons ||
                  (ServiceIcon && (
                    <ServiceIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                  ))}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground group-hover:text-accent-foreground transition-colors">
                      {service.title}
                    </span>
                    {!hideIcons && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground group-hover:text-accent-foreground transition-colors mt-0.5">
                    {service.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
