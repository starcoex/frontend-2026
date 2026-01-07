import {
  Phone,
  MapPin,
  Clock,
  Headphones,
  HeadphonesIcon,
  Fuel,
  Car,
  Truck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import SectionHeader from '@/components/section/components/section-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { COMPANY_INFO } from '@/app/config/company.config';

export const ContactSection = () => {
  return (
    <section className="">
      <div className="border-b">
        <SectionHeader
          iconTitle="고객 지원"
          title="언제든지 도움이 필요하시면 연락하세요"
          icon={Headphones}
          description="하나의 고객센터에서 모든 서비스에 대한 문의를 처리해드립니다"
        />
      </div>

      <div className="container border-x">
        <div className="mx-auto max-w-4xl pt-8 pb-4 md:pb-8 lg:pt-[3.75rem] lg:pb-[50px]">
          {/* 메인 연락처 정보 및 지도 */}
          <div className="mb-12">
            <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* 좌측: 전화번호 및 운영시간 */}
                  <div className="p-8 flex flex-col justify-center lg:border-r border-border/10">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="p-3 bg-blue-500 text-white rounded-full shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-600 mb-1 leading-none">
                          {COMPANY_INFO.phone}
                        </CardTitle>
                        <CardDescription className="mb-4">
                          통합 고객센터
                        </CardDescription>
                        <CardDescription>
                          가입, 이용, 결제, 기술 지원 등<br />
                          모든 문의사항을 처리해드립니다
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pt-6 border-t border-border/10">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium mb-1">운영 시간</div>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <CardDescription>
                            평일 {COMPANY_INFO.hours}
                          </CardDescription>
                          <CardDescription>토요일 09:00-13:00</CardDescription>
                          <CardDescription className="text-xs opacity-70 mt-2">
                            * 일요일 및 공휴일 휴무
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 우측: 지도 및 본사 위치 */}
                  <div className="relative h-[300px] lg:h-auto min-h-[300px] bg-muted">
                    <iframe
                      width="100%"
                      height="100%"
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      title="Company Location"
                      scrolling="no"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        COMPANY_INFO.address
                      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      style={{
                        filter: 'grayscale(1) contrast(1.2) opacity(0.8)',
                      }}
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/95 dark:bg-black/90 backdrop-blur-sm p-4 rounded-xl border shadow-sm flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium mb-0.5">본사 위치</div>
                          <div className="text-muted-foreground leading-snug">
                            {COMPANY_INFO.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 서비스 안내 */}
          <Card className="p-6 text-center">
            <CardContent className="p-0">
              <CardTitle className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <HeadphonesIcon className="w-5 h-5 text-primary" />
                상담 가능한 모든 서비스
              </CardTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mb-2 p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full text-orange-600 dark:text-orange-400">
                    <Fuel className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium">주유소</div>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mb-2 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                    <Car className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium">세차</div>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mb-2 p-3 bg-green-100 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium">난방유 배달</div>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="mb-2 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium">카케어</div>
                </div>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                가입, 이용, 결제, 기술 지원 등 모든 문의사항을 처리해드립니다
              </CardDescription>
            </CardContent>
          </Card>

          {/* 하단 안내 */}
          <div className="text-center mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <CardDescription className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>
                <strong>하이브리드 서비스:</strong> 포털에서 가입하시면 모든
                서비스 앱에서 동일한 고객지원을 받으실 수 있습니다
              </span>
            </CardDescription>
          </div>
        </div>
      </div>

      <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};
