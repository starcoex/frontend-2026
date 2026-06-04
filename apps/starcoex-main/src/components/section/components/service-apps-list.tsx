import { useState } from 'react';
import { getExternalServices } from '@/app/config/service.config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { COMPANY_INFO } from '@/app/config/company.config';
import { ExternalLink, Smartphone, Phone } from 'lucide-react';

const ServiceAppsList = () => {
  const appServices = getExternalServices().filter(
    (service) => service.appImage && service.whyUseApp
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  const handleOpenApp = (serviceName: string) => {
    setSelectedName(serviceName);
    setOpenDialog(true);
  };

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
                    ? 'opacity-75'
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
                  <Badge variant="secondary" className="text-xs">
                    준비중
                  </Badge>
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
                  <Button
                    variant="outline"
                    className="w-full group/button inline-flex items-center gap-2"
                    onClick={() => handleOpenApp(service.name)}
                  >
                    <CardTitle className="opacity-80">앱에서 열기</CardTitle>
                    <ExternalLink className="h-4 w-4 group-hover/button:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 준비중 안내 다이얼로그 */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <DialogTitle className="text-center">
              {selectedName} 전용 앱 준비중입니다
            </DialogTitle>
            <DialogDescription className="text-center">
              더 편리한 서비스를 위해 전용 앱을 준비하고 있습니다.
              <br />
              출시 전까지는 매장 방문 또는 전화로 편리하게 이용하세요.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button asChild className="w-full">
              <a
                href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                전화 문의 ({COMPANY_INFO.phone})
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpenDialog(false)}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceAppsList;
