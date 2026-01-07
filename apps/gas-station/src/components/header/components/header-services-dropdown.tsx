import React from 'react';
import { ExternalLink } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { StarcoexService } from '@/app/utils/brand-constants';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';

interface StarcoexServicesDropdownProps {
  services: StarcoexService[];
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  contentClassName?: string;
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
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground border-0">
            {!hideIcons && <Icon className="w-4 h-4 mr-2" />}
            {title}
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className={`bg-background border-border ${contentClassName}`}
          >
            <div className="w-[400px] p-3">
              <ul className="space-y-1">
                {services.map((service) => {
                  const ServiceIcon = service.icon;
                  return (
                    <li key={service.id}>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="group flex w-full h-auto p-3 justify-start items-start gap-3 rounded-md leading-none bg-transparent hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          onClick={() => handleServiceClick(service)}
                        >
                          {!hideIcons ||
                            (ServiceIcon && (
                              <ServiceIcon className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground transition-colors" />
                            ))}
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
                        </Button>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
