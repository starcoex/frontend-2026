import { Fuel, Calendar, MapPin, Heart, ArrowDown } from 'lucide-react';

const milestones = [
  { year: '2003', event: '별표 석유 창업', icon: Fuel },
  { year: '2011', event: '현대식 주유소 오픈', icon: MapPin },
  { year: '2024', event: '20주년, 그리고 새로운 시작', icon: Heart },
];

export function GasStationAboutHero() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative bg-obsidian overflow-hidden px-2.5 lg:px-0">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="container relative z-10 p-0">
        <div className="flex flex-col gap-0 overflow-hidden px-6 py-12 md:px-16 md:py-20 lg:py-32">
          {/* 상단: 헤드라인 + 히스토리 */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 lg:mb-24">
            {/* 좌측: 메인 카피 */}
            <div className="flex flex-col">
              {/* 배지 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 w-fit">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm text-neutral-300">Since 2003</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                <span className="text-neutral-500 block text-2xl md:text-3xl font-medium mb-2">
                  제주에서 시작된
                </span>
                20년의
                <span className="text-primary"> 신뢰</span>
              </h1>

              <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-lg">
                작은 석유 공급업에서 시작해,
                <br />
                지금은{' '}
                <span className="text-neutral-200">
                  제주를 대표하는 에너지 파트너
                </span>
                가 되었습니다.
              </p>
            </div>

            {/* 우측: 마일스톤 타임라인 */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

              <div className="space-y-6">
                {milestones.map((item, index) => (
                  <div
                    key={item.year}
                    className="relative flex items-start gap-5 group"
                  >
                    {/* 타임라인 도트 */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          index === milestones.length - 1
                            ? 'bg-primary text-white'
                            : 'bg-white/5 border border-white/10 text-neutral-400 group-hover:border-primary/50 group-hover:text-primary'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="pt-2">
                      <div className="text-primary font-bold text-xl mb-1">
                        {item.year}
                      </div>
                      <div className="text-neutral-300 font-medium">
                        {item.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 중간: 핵심 메시지 카드 */}
          <div className="grid md:grid-cols-3 gap-4 mb-16 lg:mb-24">
            {[
              {
                title: '시작',
                desc: '2003년 "별표" 석유로 제주 연삼로에서 첫 걸음을 내딛었습니다.',
              },
              {
                title: '성장',
                desc: '끊임없는 도전과 시행착오를 거치며 고객님께 최고의 서비스를 제공해왔습니다.',
              },
              {
                title: '약속',
                desc: '친환경적이고 안전한 주유 서비스로 제주의 아름다운 자연과 함께합니다.',
              },
            ].map((card, index) => (
              <div
                key={card.title}
                className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="text-primary font-bold text-sm mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-primary" />
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 하단: 이미지 */}
          <div className="relative">
            {/* 이미지 라벨 */}
            <div className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
              <span className="text-sm text-white font-medium">
                별표주유소 전경
              </span>
            </div>

            {/* 메인 이미지 */}
            <div className="relative aspect-video md:aspect-[21/9] w-full rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="별표 주유소 전경"
                className="w-full h-full object-cover"
              />
              {/* 오버레이 그라디언트 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* 스크롤 안내 */}
            <button
              onClick={scrollToContent}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer group"
            >
              <ArrowDown className="w-5 h-5 text-neutral-400 group-hover:text-primary animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
