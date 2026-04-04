import React from 'react';
import { ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  CardDescription,
} from '../ui';
import { StarcoexService, StarcoexServicesDropdownProps } from '../../types';

const isCarWashApp = () => {
  return (
    window.location.hostname.includes('car-wash') ||
    window.location.pathname.includes('car-wash') ||
    document.title.includes('세차') ||
    document.title.includes('CAR WASH')
  );
};

export const HeaderServicesDropdown: React.FC<
  StarcoexServicesDropdownProps
> = ({
  services,
  title = '다른 서비스',
  icon: Icon = ExternalLink,
  className = '',
  contentClassName = '',
  onServiceClick,
}) => {
  const handleServiceClick = (service: StarcoexService) => {
    if (onServiceClick) {
      onServiceClick(service);
    } else {
      window.open(service.href, '_blank');
    }
  };

  const hideIcons = isCarWashApp();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground border-0 ${className}`}
        >
          {!hideIcons && <Icon className="w-4 h-4 mr-2" />}
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`w-[400px] p-3 bg-background border-border ${contentClassName}`}
        align="start"
      >
        <ul className="space-y-1">
          {services.map((service) => {
            const ServiceIcon = service.icon;
            return (
              <li key={service.id}>
                <DropdownMenuItem
                  className="group flex w-full h-auto p-3 justify-start items-start gap-3 rounded-md leading-none bg-transparent hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                  onClick={() => handleServiceClick(service)}
                >
                  {!hideIcons && ServiceIcon && (
                    <ServiceIcon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                  )}
                  <div className="space-y-1 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground group-hover:text-accent-foreground transition-colors">
                        {service.title}
                      </span>
                      {!hideIcons && (
                        <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground group-hover:text-accent-foreground transition-colors">
                      {service.description}
                    </CardDescription>
                  </div>
                </DropdownMenuItem>
              </li>
            );
          })}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
