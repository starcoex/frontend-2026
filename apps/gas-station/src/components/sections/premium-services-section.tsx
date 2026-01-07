import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

// 데이터는 기존 유지
const services = [
  {
    id: 'premium-wash',
    title: 'PREMIUM WASH',
    subtitle: '프리미엄 자동세차',
    image:
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600&auto=format&fit=crop',
    link: '/services/wash',
  },
  {
    id: 'detailing',
    title: 'DETAILING',
    subtitle: '디테일링 & 광택',
    image:
      'https://images.unsplash.com/photo-1605515298946-d063f2e92d2d?q=80&w=600&auto=format&fit=crop',
    link: '/services/detailing',
  },
  {
    id: 'high-pressure',
    title: 'HIGH PRESSURE',
    subtitle: '초고압 하부세차',
    image:
      'https://images.unsplash.com/photo-1520340356584-7c9948871d62?q=80&w=600&auto=format&fit=crop',
    link: '/services/underbody',
  },
  {
    id: 'interior',
    title: 'INTERIOR',
    subtitle: '실내 클리닝',
    image:
      'https://images.unsplash.com/photo-1583203187768-36c82a59c9e3?q=80&w=600&auto=format&fit=crop',
    link: '/services/interior',
  },
  {
    id: 'coating',
    title: 'COATING',
    subtitle: '유리막 코팅',
    image:
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop',
    link: '/services/coating',
  },
];

export const PremiumServicesSection: React.FC = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateScrollState = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateScrollState();
    carouselApi.on('select', updateScrollState);
    carouselApi.on('reInit', updateScrollState);
  }, [carouselApi]);

  const title = '별표주유소 프리미엄 카케어';
  const description =
    '단순한 주유소를 넘어, 당신의 차를 가장 완벽하게 관리하는 프로페셔널 서비스를 만나보세요.';

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="bg-jet container overflow-hidden py-12 md:py-32">
        {/* 헤더 영역: 기존 타이틀 유지, 상단 화살표 제거 */}
        <div className="mb-8 flex flex-col gap-4 md:mb-14 lg:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-lg text-lg">
            {description}
          </p>
        </div>

        <div className="w-full relative group">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              breakpoints: {
                '(max-width: 768px)': {
                  dragFree: true,
                },
              },
            }}
            className="w-full"
          >
            <CarouselContent className="!ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
              {services.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className={cn(
                    'max-w-[280px] lg:max-w-[320px]',
                    index === 0 ? '!pl-0' : 'pl-[20px]'
                  )}
                >
                  <a
                    href={item.link}
                    className="group/card rounded-xl block h-full"
                  >
                    <div className="aspect-[3/4] relative h-full min-h-[24rem] w-full overflow-hidden rounded-xl bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute h-full w-full object-cover object-center transition-transform duration-500 group-hover/card:scale-110"
                      />
                      {/* 그라디언트 오버레이 */}
                      <div className="absolute inset-0 h-full bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover/card:opacity-90" />

                      {/* 텍스트 컨텐츠 */}
                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8 text-white">
                        <div className="mb-2 text-xl font-bold tracking-wide md:mb-3">
                          {item.title}
                        </div>
                        <div className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                          {item.subtitle}
                        </div>
                        {/* Read More 삭제됨 */}
                      </div>
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* 호버 시 나타나는 네비게이션 버튼 (좌/우 끝) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg size-12 bg-white/90 hover:bg-white text-black"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ArrowLeft className="size-6" />
              <span className="sr-only">Previous slide</span>
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden md:block">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg size-12 bg-white/90 hover:bg-white text-black"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ArrowRight className="size-6" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>

        {/* 하단 인디케이터 및 전체 보기 버튼 */}
        <div className="container mt-8 md:mt-12">
          {/* 슬라이드 인디케이터 (모바일 등에서 유용) */}
          <div className="mb-8 flex justify-center gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-all duration-300',
                  currentSlide === index
                    ? 'bg-primary w-6'
                    : 'bg-primary/20 hover:bg-primary/40'
                )}
                onClick={() => carouselApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* 맨 하단 전체 보기 버튼 */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 border-primary/20 hover:bg-primary hover:text-white transition-all"
              onClick={() => (window.location.href = '/services')}
            >
              모든 서비스 보기
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
