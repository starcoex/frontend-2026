import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  ExternalLink,
  PlayCircle,
  Star,
  Users,
  X,
  VolumeX,
  Volume2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import { useAuth } from '@starcoex-frontend/auth';
import { COMPANY_INFO } from '@/app/config/company.config';
import DiagonalPattern from '@/components/diagonal-pattern';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  // 비디오 모달 상태
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [videoOrientation, setVideoOrientation] = useState<
    'portrait' | 'landscape'
  >('landscape');
  const videoRef = useRef<HTMLVideoElement>(null);

  const slides = COMPANY_INFO.heroSlides;

  // 외부 링크 action 목록 — 아이콘 분기에만 사용 (media-video 제거)
  const EXTERNAL_ACTIONS = new Set([
    'zeragae-pricing',
    'zeragae-about',
    'zeragae',
    'staroil',
    'delivery-order',
    'delivery-about',
    'car-wash',
    'car-wash-app',
  ]);

  // 비디오 팝업 액션
  const VIDEO_ACTIONS = new Set(['media-video']);

  const isExternal = (action: string) => EXTERNAL_ACTIONS.has(action);
  const isVideo = (action: string) => VIDEO_ACTIONS.has(action);

  const openVideoModal = (url: string) => {
    setCurrentVideoUrl(url);
    setIsMuted(true);
    setVideoOrientation('landscape'); // 로딩 전 기본값
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
    setIsMuted(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'staroil':
        window.open('https://staroil.starcoex.co.kr', '_blank');
        break;
      case 'zeragae':
        window.open('https://zeragae.starcoex.co.kr', '_blank');
        break;
      case 'services':
      case 'portal':
      case 'register':
        navigate('/auth/register');
        break;
      case 'phone':
        window.location.href = `tel:${COMPANY_INFO.phone.replace(
          /[^0-9]/g,
          ''
        )}`;
        break;
      case 'apps':
        document.getElementById('service-apps')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case 'event':
        document.getElementById('services')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case 'kakao-login':
        navigate('/auth/register/personal');
        break;
      case 'car-wash-app':
        window.open('https://zeragae.starcoex.co.kr/app', '_blank');
        break;
      case 'car-wash':
        window.open('https://zeragae.starcoex.co.kr', '_blank');
        break;
      case 'service-info':
        document.getElementById('services')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
      case 'zeragae-pricing':
        window.open('https://zeragae.starcoex.co.kr/pricing', '_blank');
        break;
      case 'zeragae-about':
        window.open('https://zeragae.starcoex.co.kr/about', '_blank');
        break;
      case 'media-video':
        openVideoModal(
          'https://media.starcoex.com/starcoex-media/2026/06/videos/6a9b52f3-0e59-4547-9004-91466317b617.mp4'
        );
        break;
      case 'delivery-order':
        window.open('https://delivery.starcoex.co.kr/order', '_blank');
        break;
      case 'delivery-about':
        window.open('https://delivery.starcoex.co.kr', '_blank');
        break;
      default:
        break;
    }
  };

  return (
    <>
      <section className="relative text-center overflow-hidden">
        {/* 좌우 패턴 영역 */}
        <div className="absolute left-0 top-0 w-[10vw] h-[45vh] min-h-[500px] max-h-[700px] bg-muted/5 border-r border-border z-0">
          <DiagonalPattern className="h-full" patternOpacity={0.08} />
        </div>
        <div className="absolute right-0 top-0 w-[10vw] h-[45vh] min-h-[500px] max-h-[700px] bg-muted/5 border-l border-border z-0">
          <DiagonalPattern className="h-full" patternOpacity={0.08} />
        </div>

        {/* 메인 컨텐츠 */}
        <div className="px-[10vw]">
          <div className="relative h-[45vh] min-h-[500px] max-h-[700px] z-10">
            <Carousel
              plugins={[plugin.current]}
              className="relative w-full h-full"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{ loop: true, align: 'start' }}
            >
              <CarouselContent className="h-[45vh] min-h-[500px] max-h-[700px] ml-0">
                {slides.map((slide, index) => (
                  <CarouselItem key={slide.id} className="pl-0 h-full">
                    <Card className="h-full rounded-none border-0">
                      <CardContent className="relative p-0 h-full flex items-center justify-center">
                        <div className="max-w-4xl mx-auto px-4 text-center z-10">
                          {/* 이벤트 등 특수 배지만 남김 */}
                          {slide.id === 'event1' && (
                            <Badge>
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              세차전용카드 적립 혜택
                            </Badge>
                          )}

                          {/* 메인 텍스트 강조 */}
                          <CardTitle className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-up tracking-tight leading-tight">
                            {slide.title}
                            <CardDescription className="block mt-3 font-medium text-xl md:text-3xl">
                              {slide.subtitle}
                            </CardDescription>
                          </CardTitle>

                          <CardDescription className="md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-up animation-delay-200 opacity-90">
                            {slide.description.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                {i <
                                  slide.description.split('\n').length - 1 && (
                                  <br />
                                )}
                              </React.Fragment>
                            ))}
                          </CardDescription>

                          {isAuthenticated && slide.id === 'event1' && (
                            <div className="mb-6 animate-fade-up animation-delay-300">
                              <Badge variant="outline" className="px-4 py-1.5">
                                <Users className="w-3 h-3 mr-2" />
                                회원님을 위한 적립 혜택이 준비되어 있습니다
                              </Badge>
                            </div>
                          )}

                          {/* 버튼 스타일 통일 */}
                          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-400">
                            <Button
                              size="lg"
                              variant="default"
                              className="hover:scale-105 transition-all"
                              onClick={() =>
                                handleButtonClick(slide.primaryButton.action)
                              }
                            >
                              {slide.primaryButton.text}
                              {isVideo(slide.primaryButton.action) ? (
                                <PlayCircle className="ml-2 w-5 h-5" />
                              ) : isExternal(slide.primaryButton.action) ? (
                                <ExternalLink className="ml-2 w-5 h-5" />
                              ) : (
                                <ArrowRight className="ml-2 w-5 h-5" />
                              )}
                            </Button>

                            {slide.secondaryButton && (
                              <Button
                                size="lg"
                                variant="outline"
                                className="hover:scale-105 transition-all"
                                onClick={() =>
                                  handleButtonClick(
                                    slide.secondaryButton!.action
                                  )
                                }
                              >
                                {isVideo(slide.secondaryButton.action) ? (
                                  <PlayCircle className="mr-2 w-5 h-5" />
                                ) : isExternal(slide.secondaryButton.action) ? (
                                  <ExternalLink className="mr-2 w-5 h-5" />
                                ) : (
                                  <ArrowRight className="mr-2 w-5 h-5" />
                                )}
                                <span>{slide.secondaryButton.text}</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-4  h-12 w-12" />
              <CarouselNext className="right-4 h-12 w-12" />
            </Carousel>
          </div>
        </div>

        {/* 하단 패턴 바 */}
        <div className="flex h-8 gap-1 max-lg:hidden opacity-50">
          <div className="flex-1 border-t border-border" />
          <DiagonalPattern className="w-52" />
          <div className="w-24 border-t border-border" />
          <DiagonalPattern className="w-52" />
          <div className="w-24 border-t border-border" />
          <DiagonalPattern className="w-52" />
          <div className="flex-1 border-t border-border" />
        </div>
      </section>

      {/* 비디오 모달 */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div
            className={[
              'relative bg-black rounded-lg overflow-hidden',
              videoOrientation === 'portrait'
                ? 'h-[90vh] w-auto' // 세로형: 높이 기준으로 너비 자동
                : 'w-full max-w-4xl', // 가로형: 너비 기준
            ].join(' ')}
          >
            {/* 컨트롤 바 */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={toggleMute}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                title={isMuted ? '소리 켜기' : '소리 끄기'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={closeVideoModal}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                title="닫기"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 비디오 플레이어 — aspect-video 래퍼 제거, 영상 자체가 크기 결정 */}
            <video
              ref={videoRef}
              className={[
                'block',
                videoOrientation === 'portrait'
                  ? 'h-[90vh] w-auto' // 세로형: 높이에 맞춰 너비 자동
                  : 'w-full aspect-video', // 가로형: 16:9 비율 유지
              ].join(' ')}
              controls
              autoPlay
              muted={isMuted}
              playsInline
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                setVideoOrientation(
                  video.videoHeight > video.videoWidth
                    ? 'portrait'
                    : 'landscape'
                );
              }}
              onLoadStart={() => console.log('비디오 로딩 시작')}
              onError={() => console.error('비디오 로딩 오류')}
            >
              <source src={currentVideoUrl} type="video/mp4" />
              <p>Your browser does not support the video tag.</p>
            </video>
          </div>

          {/* 모달 배경 클릭 시 닫기 */}
          <div className="absolute inset-0 -z-10" onClick={closeVideoModal} />
        </div>
      )}
    </>
  );
};
