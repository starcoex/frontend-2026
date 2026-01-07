import { MapPin } from 'lucide-react';

export function LocationHero() {
  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container flex flex-col justify-center gap-8 overflow-hidden py-12 md:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* 메인 타이틀 */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-neutral-400 text-2xl md:text-3xl lg:text-4xl font-medium block mb-2">
              제주의 중심에서
            </span>
            당신을 기다립니다
          </h1>

          {/* 서브 카피 */}
          <p className="text-neutral-500 text-lg md:text-xl mb-10 max-w-xl">
            언제 오셔도, 어디서 오셔도
            <br className="sm:hidden" />
            <span className="text-neutral-500">
              {' '}
              가장 가까운 길로 안내해 드릴게요
            </span>
          </p>

          {/* 주소 */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 mb-10">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-neutral-500 text-sm md:text-base">
              제주특별자치도 제주시 연동
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
