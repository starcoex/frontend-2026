import React from 'react';
import { MapSection } from '@/components/sections/locations/map-section';
import { ContactSidebar } from '@/components/sections/locations/contact-sidebar';
import { Car, Navigation, MapPin } from 'lucide-react';

export const LocationSection: React.FC = () => {
  // 교통수단 선택 State 제거 (자가용 단일 안내로 변경)

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container flex flex-col items-center justify-center gap-8 overflow-hidden py-12 text-center md:py-32">
        {/* 상단 헤더 */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            별표주유소 위치 안내
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            24시간 운영하는 제주도 최고의 주유소, 언제나 편리하게 찾아오세요.
          </p>
        </div>

        {/* 메인 컨텐츠 그리드 */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_380px]">
          {/* 좌측: 지도 및 자가용 안내 */}
          <div className="space-y-8">
            <MapSection />

            {/* 자가용 상세 안내 (TransportSection 대체) */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <div className="p-2.5 bg-primary/10 rounded-full text-primary">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">자가용 이용 상세 안내</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Navigation className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">네비게이션 검색</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        '별표주유소' 또는 '제주시 공항로 123'을 검색하세요.
                        <br />
                        공항에서 출발 시 약 15분 소요됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">주차 및 진입 안내</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        대로변 우측 진입로를 이용해주세요.
                        <br />
                        동시 10대 이상 수용 가능한 넓은 드라이잉 존과 대형 차량
                        전용 주차 공간이 완비되어 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 연락처 사이드바 (리뷰 제거됨) */}
          <ContactSidebar />
        </div>
      </div>
    </section>
  );
};
