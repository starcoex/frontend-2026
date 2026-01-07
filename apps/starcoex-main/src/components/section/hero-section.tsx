import React from 'react';
import { ArrowRight, ExternalLink, Star, Users, Sparkles } from 'lucide-react';
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

  const slides = COMPANY_INFO.heroSlides;

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'services':
      case 'portal':
        document.getElementById('services')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        break;
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
        console.log('이벤트 페이지로 이동');
        break;
      case 'kakao-login':
        navigate('/auth/register/personal');
        break;
      case 'car-wash-app':
        window.open('https://car-wash.starcoex.com', '_blank');
        break;
      case 'car-wash':
      case 'service-info':
        navigate('/car-wash');
        break;
      default:
        break;
    }
  };

  return (
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
                        {/* 이벤트 등 특수 배지만 남김 (하이브리드 배지 삭제) */}
                        {slide.id === 'event1' && (
                          <Badge>
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            신년 특가 이벤트
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
                              {i < slide.description.split('\n').length - 1 && (
                                <br />
                              )}
                            </React.Fragment>
                          ))}
                        </CardDescription>

                        {isAuthenticated && slide.id === 'hybrid-platform' && (
                          <div className="mb-6 animate-fade-up animation-delay-300">
                            <Badge variant="outline" className="px-4 py-1.5">
                              <Users className="w-3 h-3 mr-2" />
                              회원님을 위한 맞춤 서비스가 준비되어 있습니다
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
                            {slide.primaryButton.action === 'car-wash-app' ? (
                              <ExternalLink className="ml-2 w-5 h-5" />
                            ) : (
                              <ArrowRight className="ml-2 w-5 h-5" />
                            )}
                          </Button>

                          <Button
                            size="lg"
                            variant="outline"
                            className="hover:scale-105 transition-all"
                            onClick={() =>
                              handleButtonClick(slide.secondaryButton.action)
                            }
                          >
                            {slide.secondaryButton.action === 'register' && (
                              <Users className="mr-2 w-5 h-5" />
                            )}
                            {slide.secondaryButton.action === 'kakao-login' && (
                              <Star className="mr-2 w-5 h-5" />
                            )}
                            {slide.secondaryButton.action === 'portal' && (
                              <Sparkles className="mr-2 w-5 h-5" />
                            )}
                            <span>{slide.secondaryButton.text}</span>
                          </Button>
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
  );
};
