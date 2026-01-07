import React, { useState, useRef } from 'react';
import { PlayCircle, X, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';

export const HeroSection: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [isHeroVideoMuted, setIsHeroVideoMuted] = useState(true); // 히어로 비디오 음소거 상태
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null); // 히어로 비디오 참조

  const handleHighPressureService = () => {
    setCurrentVideoUrl(
      'https://media.starcoex.com/starcoex-media/2025/11/videos/c8234251-699d-48b1-a0e8-5d5ff1c1b3ea.mp4'
    );
    setIsVideoModalOpen(true);
  };

  const handleCarWashService = () => {
    setCurrentVideoUrl(
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    );
    setIsVideoModalOpen(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // 히어로 비디오 음소거 토글
  const toggleHeroVideoMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !heroVideoRef.current.muted;
      setIsHeroVideoMuted(heroVideoRef.current.muted);
    }
  };

  const closeModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
    setIsMuted(true);
  };

  return (
    <>
      <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
        <div className="relative container px-5">
          <div className="grid gap-12 py-8 lg:grid-cols-[65fr_35fr] lg:py-14 lg:pl-12">
            <div className="flex flex-col items-start justify-center gap-5 lg:gap-7 relative z-10">
              <CardTitle className="text-3xl tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                제주도 최고의 별표주유소
              </CardTitle>

              <CardDescription className="text-muted-foreground text-base">
                24시간 운영하는 제주도의 믿을 수 있는 주유소입니다. 최고 품질의
                연료와 합리적인 가격, 친절한 서비스로 고객 만족을 위해 최선을
                다하고 있습니다.
              </CardDescription>

              <div className="flex flex-wrap items-start gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                  onClick={handleHighPressureService}
                >
                  <PlayCircle className="w-5 h-5" />
                  아주 센 고압서비스
                </Button>
                <Button
                  size="lg"
                  // variant="secondary"
                  className="flex items-center gap-2"
                  onClick={handleCarWashService}
                >
                  <PlayCircle className="w-5 h-5" />
                  별표 손세차
                </Button>
              </div>
            </div>
            <div className="bg-muted/20 rounded-sm p-2 sm:p-3 md:p-4 lg:rounded-md relative">
              {/* 히어로 비디오 음소거 컨트롤 */}
              <button
                onClick={toggleHeroVideoMute}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                title={isHeroVideoMuted ? '소리 켜기' : '소리 끄기'}
              >
                {isHeroVideoMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <div className="relative aspect-[522/360] size-full overflow-hidden rounded-sm lg:min-h-[345px] lg:min-w-full lg:rounded-md">
                <video
                  ref={heroVideoRef}
                  className="w-full h-full object-cover object-center"
                  autoPlay
                  muted={isHeroVideoMuted}
                  loop
                  playsInline
                >
                  <source
                    src="https://media.starcoex.com/starcoex-media/2025/11/videos/c8234251-699d-48b1-a0e8-5d5ff1c1b3ea.mp4"
                    type="video/mp4"
                  />
                  {/* 대체 이미지 */}
                  <img
                    src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="주유소 전경"
                    className="w-full h-full object-cover object-center"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 비디오 모달 */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-background rounded-lg overflow-hidden max-w-4xl w-full">
            {/* 컨트롤 바 */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {/* 음소거 토글 버튼 */}
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

              {/* 닫기 버튼 */}
              <button
                onClick={closeModal}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                title="닫기"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 자체 비디오 플레이어 */}
            <div className="aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full"
                controls
                autoPlay
                muted={isMuted}
                playsInline
                onLoadStart={() => console.log('비디오 로딩 시작')}
                onError={() => console.error('비디오 로딩 오류')}
              >
                <source src={currentVideoUrl} type="video/mp4" />
                <p>Your browser does not support the video tag.</p>
              </video>
            </div>
          </div>

          {/* 모달 배경 클릭 시 닫기 */}
          <div className="absolute inset-0 -z-10" onClick={closeModal} />
        </div>
      )}
    </>
  );
};
