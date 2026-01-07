import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Facebook,
  Linkedin,
  Twitter,
} from 'lucide-react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Team 캐로셀 컴포넌트 인라인 정의
const TEAM = [
  {
    name: '김대표',
    position: '대표이사',
    image: '/images/about/team/1.webp',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: '이부장',
    position: '운영부장',
    image: '/images/about/team/2.webp',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: '박과장',
    position: '안전관리자',
    image: '/images/about/team/3.webp',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  {
    name: '최직원',
    position: '고객서비스 담당',
    image: '/images/about/team/4.webp',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
];

export const GasStationTeamCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="bg-obsidian overflow-hidden px-2.5 lg:px-0">
      <div className="container p-0">
        <div className="border-b-dark-gray border-l-dark-gray border-r-dark-gray flex flex-col gap-8 overflow-hidden border-r border-b border-l px-6 py-12 md:px-16 md:py-20 md:pt-32">
          <div className="max-w-xl">
            <h1 className="text-foreground mb-2.5 text-3xl tracking-tight md:text-5xl">
              별표 주유소 팀
            </h1>
            <p className="font-inter-tight text-mid-gray text-base">
              별표 주유소는 20여 년간 제주도에서 연료 공급과 고객 서비스 분야의
              전문가들로 구성된 열정적인 소규모 팀이 운영하고 있습니다. 모든
              고객에게 안전하고 신뢰할 수 있는 주유 서비스를 제공한다는 하나의
              목표로 뭉쳐있습니다.
            </p>
          </div>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <div className="border-b-dark-gray border-l-dark-gray border-r-dark-gray gap-0 border-r border-b border-l">
            <CarouselContent className="ml-0 w-[calc(100%+1px)] gap-0">
              {TEAM.map((member) => (
                <CarouselItem
                  key={member.name}
                  className="border-r-dark-gray basis-full border-r p-0 md:basis-1/4"
                >
                  <div className="relative aspect-square w-full">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-foreground p-4">
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {member.position}
                    </div>
                    <div className="mt-10 flex items-end justify-end gap-3">
                      <Link to={member.facebook} aria-label="Facebook">
                        <Facebook size={20} className="hover:text-foreground" />
                      </Link>
                      <Link to={member.twitter} aria-label="Twitter">
                        <Twitter size={20} className="hover:text-foreground" />
                      </Link>
                      <Link to={member.linkedin} aria-label="LinkedIn">
                        <Linkedin size={20} className="hover:text-foreground" />
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
          <div className="border-dark-gray relative flex h-20 items-center justify-end gap-2 border-r border-b border-l px-2.5">
            <CarouselPrevious className="text-foreground !static flex size-11 !translate-y-0 items-center justify-center bg-transparent transition-colors hover:bg-white hover:text-black">
              <ArrowLeft size={24} />
            </CarouselPrevious>

            <CarouselNext className="text-foreground !static flex size-11 !translate-y-0 items-center justify-center bg-transparent transition-colors hover:bg-white hover:text-black">
              <ArrowRight size={24} />
            </CarouselNext>
          </div>
        </Carousel>
      </div>
    </section>
  );
};
