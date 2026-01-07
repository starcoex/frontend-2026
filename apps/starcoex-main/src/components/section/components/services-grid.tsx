import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SERVICES_CONFIG } from '@/app/config/service.config';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ServicesGrid: React.FC = () => {
  const handleServiceClick = (service: (typeof SERVICES_CONFIG)[0]) => {
    window.open(service.href, '_blank');
  };

  return (
    <div className="py-16 bg-gradient-to-b">
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_CONFIG.map((service) => {
            const Icon = service.icon;
            const isComingSoon = service.comingSoon;
            const isExternalApp = service.isExternalApp;

            return (
              <Card
                key={service.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isComingSoon
                    ? 'opacity-75 cursor-not-allowed'
                    : 'cursor-pointer hover:-translate-y-2'
                }`}
              >
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg ${service.color.background} transition-transform group-hover:scale-110`}
                    >
                      <Icon className={`w-6 h-6 ${service.color.primary}`} />
                    </div>

                    {isComingSoon && (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}

                    {isExternalApp && !isComingSoon && (
                      <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        전용 앱
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="text-sm mb-4 leading-6">
                      {service.description}
                    </CardDescription>

                    <ul className="space-y-1 mb-6">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-xs text-muted-foreground"
                        >
                          <div className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    {isComingSoon ? (
                      <div className="text-center py-2">
                        <span className="text-sm text-muted-foreground">
                          곧 서비스 예정
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full group/button"
                        onClick={() => handleServiceClick(service)}
                      >
                        <CardTitle>자세히 보기</CardTitle>
                        <ExternalLink className="ml-2 w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesGrid;
