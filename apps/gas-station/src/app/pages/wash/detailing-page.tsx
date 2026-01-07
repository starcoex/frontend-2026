import React from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Droplets,
  Sparkles,
  Wrench,
  CalendarClock,
  PhoneCall,
} from 'lucide-react';
import { APP_CONFIG } from '@/app/config/app.config';

export const DetailingPage: React.FC = () => {
  const services = [
    {
      id: 'gloss',
      title: '미러 글라스 광택',
      price: '150,000원 ~',
      desc: '스크래치 제거 및 도장면 본연의 광택 복원',
      icon: Sparkles,
      gradient: 'from-amber-400 to-orange-500',
      process: ['철분 제거', '마스킹', '초벌/중벌/마무리 광택', '탈지 세차'],
    },
    {
      id: 'glass-care',
      title: '유막 제거 & 발수 코팅',
      price: '50,000원',
      desc: '비 오는 날 완벽한 시야 확보를 위한 필수 케어',
      icon: Droplets,
      gradient: 'from-sky-400 to-blue-500',
      process: ['유리 세정', '전용 머신 유막제거', '친수 확인', '초발수 코팅'],
    },
    {
      id: 'whitening',
      title: '화이트닝 미백 세차',
      price: '80,000원 ~',
      desc: '흰색 차량의 황변과 찌든 때를 완벽하게 제거',
      icon: Wrench,
      gradient: 'from-slate-400 to-slate-600',
      process: ['프리 워시', '철분/타르 제거', '미백 약품 처리', '왁스 코팅'],
    },
  ];

  return (
    <>
      <PageHead
        title="프리미엄 디테일링 - 별표주유소"
        description="전문가의 손길로 완성되는 프리미엄 카 케어. 광택, 유막제거, 미백 세차를 예약하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/store/detailing`}
      />

      <div className="min-h-screen bg-background pb-20">
        {/* 헤더 */}
        <div className="relative bg-jet overflow-hidden py-24 px-4">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
          <div className="relative container mx-auto text-center z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Masterpiece Detailing
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              당신의 차량을 작품으로 만듭니다.
              <br />
              별표주유소의 인증된 마스터가 제공하는 하이엔드 케어 서비스.
            </p>
          </div>
        </div>

        {/* 서비스 목록 */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-12">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="overflow-hidden border-border/50 bg-muted/10"
              >
                <div className="flex flex-col md:flex-row">
                  {/* 아이콘/이미지 영역 */}
                  <div
                    className={`md:w-1/3 min-h-[200px] bg-gradient-to-br ${service.gradient} flex items-center justify-center p-8`}
                  >
                    <service.icon className="w-24 h-24 text-white drop-shadow-lg" />
                  </div>

                  {/* 내용 영역 */}
                  <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h2 className="text-3xl font-bold">{service.title}</h2>
                      <span className="text-2xl font-bold text-primary">
                        {service.price}
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground mb-8">
                      {service.desc}
                    </p>

                    <div className="bg-background/50 rounded-lg p-6 mb-8">
                      <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                        Service Process
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.process.map((step, i) => (
                          <React.Fragment key={i}>
                            <span className="font-medium">{step}</span>
                            {i < service.process.length - 1 && (
                              <span className="text-muted-foreground">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Button
                        size="lg"
                        className="flex-1 md:flex-none min-w-[200px]"
                      >
                        <CalendarClock className="w-5 h-5 mr-2" /> 예약하기
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 md:flex-none"
                      >
                        <PhoneCall className="w-5 h-5 mr-2" /> 전화 상담
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 예약 안내 */}
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            * 디테일링 서비스는 100% 예약제로 운영되며, 차량 상태에 따라 추가
            비용이 발생할 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
};
