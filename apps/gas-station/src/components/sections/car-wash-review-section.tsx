import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay'; // Autoplay 플러그인 임포트
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 비디오 데이터
const videos = [
  {
    id: 1,
    src: 'https://cdn.pixabay.com/video/2024/05/24/213353_large.mp4',
    poster:
      'https://images.unsplash.com/photo-1625043484555-79cb6a8b5144?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    src: 'https://cdn.pixabay.com/video/2023/10/12/184734-873923036_large.mp4',
    poster:
      'https://images.unsplash.com/photo-1567594684926-e45f9434c384?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    src: 'https://cdn.pixabay.com/video/2021/04/15/71109-537232032_large.mp4',
    poster:
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    src: 'https://cdn.pixabay.com/video/2020/06/18/42308-430741624_large.mp4',
    poster:
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop',
  },
];

const reviews = [
  {
    id: 1,
    name: '김*수',
    car: 'GV80',
    rating: 5,
    text: '제주도에서 제일 세차 잘하는 곳입니다. 하부세차 수압이 장난 아니네요.',
  },
  {
    id: 2,
    name: '이*영',
    car: 'E-Class',
    rating: 5,
    text: '직원분들이 너무 친절하시고 꼼꼼합니다. 멤버십 혜택도 좋아요.',
  },
  {
    id: 3,
    name: '박*준',
    car: 'Model 3',
    rating: 5,
    text: '노터치 방식이라 기스 걱정 없이 맡길 수 있어서 안심됩니다.',
  },
  {
    id: 4,
    name: '최*민',
    car: 'X5',
    rating: 5,
    text: '세차 후 광택이 살아나서 새 차 같아요. 항상 여기만 이용합니다.',
  },
  {
    id: 5,
    name: '정*우',
    car: 'Cayenne',
    rating: 5,
    text: '디테일링 샵 못지 않은 퀄리티입니다. 강력 추천합니다.',
  },
];

export const CarWashReviewSection: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Autoplay 플러그인 설정 (3초마다 이동, 마우스 호버시 멈춤)
  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) return;
    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };
    updateScrollState();
    api.on('select', updateScrollState);
    api.on('reInit', updateScrollState);
  }, [api]);

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container flex flex-col justify-center gap-8 overflow-hidden py-12 md:py-32">
        {/* 1. 상단 타이틀 */}
        <div className="mb-16 text-left">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            눈으로 확인하는 <span className="text-primary">압도적 성능</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl">
            백 번의 설명보다 한 번 보는 것이 확실합니다.
            <br />
            별표주유소의 강력한 퍼포먼스를 영상으로 확인하세요.
          </p>
        </div>

        {/* 2. 동영상 영역 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-32">
          {videos.map((video) => (
            <div
              key={video.id}
              className="relative w-full aspect-[210/373] rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl ring-1 ring-white/5"
            >
              <video
                className="w-full h-full object-cover opacity-90"
                autoPlay
                muted
                loop
                playsInline
                poster={video.poster}
              >
                <source src={video.src} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* 3. 하단 리뷰 섹션 */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* 좌측: 리뷰 통계 */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>
              <span className="text-lg font-bold text-white">4.9/5.0</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold leading-tight">
              리얼 디테일러들에게
              <br />
              사랑받는
            </h3>
            <p className="text-primary text-xl md:text-2xl font-semibold">
              734개 이상의 리뷰
            </p>
            <p className="text-neutral-400 mt-2">
              실제 방문해주신 고객님들이
              <br />
              직접 남겨주신 소중한 이야기입니다.
            </p>
          </div>

          {/* 우측: 리뷰 슬라이드 (자동 재생) */}
          <div
            className="lg:col-span-8 relative"
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            {/* 네비게이션 버튼 */}
            <div className="flex gap-2 justify-end mb-4 md:absolute md:-top-16 md:right-0">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-neutral-800 bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
              >
                <ArrowLeft className="size-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-neutral-800 bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
              >
                <ArrowRight className="size-5" />
              </Button>
            </div>

            <Carousel
              setApi={setApi}
              plugins={[plugin.current]} // 플러그인 적용
              opts={{
                align: 'start',
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {reviews.map((review) => (
                  <CarouselItem
                    key={review.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full group cursor-default">
                      <div className="flex flex-col h-full gap-4 p-4 rounded-xl transition-colors hover:bg-white/5">
                        {/* ... existing code ... */}
                        <Quote className="w-8 h-8 text-neutral-800 rotate-180 group-hover:text-primary/50 transition-colors" />
                        <p className="text-neutral-300 text-sm leading-relaxed line-clamp-4 min-h-[5rem]">
                          "{review.text}"
                        </p>
                        <div className="mt-auto pt-4 border-t border-neutral-800 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white text-sm">
                              {review.name} 고객님
                            </div>
                            <div className="text-xs text-neutral-500 mt-0.5">
                              {review.car}
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'w-3 h-3',
                                  i < review.rating
                                    ? 'text-neutral-600 fill-neutral-600 group-hover:fill-primary group-hover:text-primary transition-colors'
                                    : 'text-neutral-800'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};
