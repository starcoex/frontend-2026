import { getExternalServices } from '@/app/config/service.config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const ServiceAppsList = () => {
  const appServices = getExternalServices().filter(
    (service) => service.appImage && service.whyUseApp
  );

  return (
    <div className="py-16 bg-gradient-to-b">
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {appServices.map((service) => {
            const Icon = service.icon;
            const isComingSoon = service.comingSoon;

            return (
              <div
                key={service.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 rounded-lg border p-6 ${
                  isComingSoon
                    ? 'opacity-75 cursor-not-allowed'
                    : 'cursor-pointer hover:-translate-y-2'
                }`}
              >
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-sm font-medium">
                      {service.shortName} 전용 앱
                    </CardTitle>
                  </div>
                  {isComingSoon && (
                    <Badge variant="secondary" className="text-xs">
                      출시 예정
                    </Badge>
                  )}
                </div>

                {/* 콘텐츠 */}
                <div className="mb-4">
                  <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                  <CardDescription className="mb-4 leading-5">
                    {service.whyUseApp}
                  </CardDescription>

                  {/* 앱 전용 혜택 */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.appBenefits?.slice(0, 2).map((benefit, idx) => (
                      <Badge key={idx} variant="outline">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 이미지 */}
                <div className="mb-4">
                  <img
                    src={service.appImage || '/images/homepage/default-app.png'}
                    alt={`${service.name} 앱 스크린샷`}
                    className="w-full h-auto rounded-md shadow-md"
                  />
                </div>

                {/* 버튼 */}
                <div className="mt-auto">
                  {isComingSoon ? (
                    <div className="text-center py-2">
                      <span className="text-sm text-muted-foreground">
                        출시 예정
                      </span>
                    </div>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group/button"
                    >
                      {service.appHref && (
                        <Link
                          to={service.appHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          <CardTitle className="opacity-80">
                            앱에서 열기
                          </CardTitle>
                          <ExternalLink className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceAppsList;
