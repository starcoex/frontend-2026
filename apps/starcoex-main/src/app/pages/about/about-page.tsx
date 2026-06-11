import React from 'react';
import { COMPANY_INFO } from '@/app/config/company.config';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import {
  Droplets,
  MapPin,
  TrendingUp,
  Users,
  Wrench,
  Sparkles,
  ShoppingBag,
  Car,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// ✅ ImageSlide: 이미지 로드 성공/실패를 state로 분기 — fallback이 이미지를 덮지 않음
const ImageSlide: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [error, setError] = React.useState(false);

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      className="bg-muted flex items-center justify-center"
    >
      {error ? (
        <span className="text-muted-foreground text-sm">{alt}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

const GenghisKhanImage: React.FC<{ src: string }> = ({ src }) => {
  const [error, setError] = React.useState(false);

  return error ? (
    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center px-2">
      징기스칸
    </div>
  ) : (
    <img
      src={src}
      alt="징기스칸"
      className="w-full h-full object-cover"
      style={{ colorScheme: 'light' }} // 브라우저 다크모드 자동 필터 방지
      onError={() => setError(true)}
    />
  );
};

// 주유소 전경 이미지 목록 — URL 방식으로 교체 시 src만 변경하면 됩니다
const GALLERY_IMAGES = [
  {
    src: 'https://media.starcoex.com/starcoex-media/2026/06/files/hk/66a852ef-4311-4546-87ae-8c82998159da.jpg',
    alt: '별표주유소 전경 1',
  },
  {
    src: 'https://media.starcoex.com/starcoex-media/2026/06/files/6z/891f61da-cb62-42bd-9aab-8406613deabb.jpg',
    alt: '별표주유소 전경 2',
  },
  {
    src: 'https://media.starcoex.com/starcoex-media/2026/06/files/bd/7e984c0f-949c-49ba-bf5c-2d45897817bf.jpg',
    alt: '별표주유소 전경 3',
  },
  {
    src: 'https://media.starcoex.com/starcoex-media/2026/06/files/5a/26367d1c-82fb-4165-8d39-68e4723a62c2.jpg',
    alt: '별표주유소 전경 4',
  },
  {
    src: 'https://media.starcoex.com/starcoex-media/2026/06/files/h5/7a8bf671-a68b-420d-b15e-dba593731e3f.jpg',
    alt: '별표주유소 전경 5',
  },
] as const;

// terms-data.ts 기반 실제 사업 영역
const BUSINESS_AREAS = [
  {
    icon: Droplets,
    title: '주유 서비스 — 별표주유소',
    description:
      'SK 엔크린 공식 주유소로, 무연휘발유·경유·등유를 합리적인 가격에 제공합니다. 빠르고 친절한 주유원 서비스로 제주도민의 일상을 함께합니다.',
  },
  {
    icon: Sparkles,
    title: '세차 서비스',
    description:
      '풍성버블세차(7,000원), 아주 쎈 고압세차(7,000원), 전문가의 10분 완성 빠른 외부손세차(15,000원) 등 다양한 세차 옵션을 운영합니다.',
  },
  {
    icon: Car,
    title: '제라게카케어',
    description:
      '전문 카케어 브랜드 제라게카케어를 통해 세라믹 코팅, 유리막 코팅, 실내 디테일링 등 프리미엄 차량 관리 서비스를 제공합니다.',
  },
  {
    icon: ShoppingBag,
    title: '배달 서비스',
    description:
      '스타코엑스 배달 플랫폼을 통해 제주 지역 내 편의 상품을 신속하게 배달합니다. 위치 기반 실시간 배달 가능 여부를 확인할 수 있습니다.',
  },
  {
    icon: Wrench,
    title: '10분 완성 빠른 외부 손세차 서비스',
    description:
      '빠르게. 깨끗하게. 제라게. 전문 손세차 인력이 10분 안에 차량 외부를 깔끔하게 마무리합니다. 바쁜 일상 속에서도 내 차를 제대로 관리할 수 있습니다.',
  },
] as const;

export const AboutPage: React.FC = () => {
  return (
    <AboutLayout title="회사소개" subtitle="스타코엑스를 소개합니다">
      <div className="space-y-16">
        {/* 히어로 섹션 */}
        <section className="border-b pb-10">
          <h2 className="text-[2rem] leading-[1.2] tracking-[-1.6px] md:text-[2.75rem] md:tracking-[-2px] font-bold">
            제주의 길 위에서
            <br />
            <span className="text-primary">20년을 함께</span>했습니다
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed tracking-[-0.32px]">
            2003년 <strong className="text-foreground">"별표"</strong> 석유를
            시작으로, 제주도민의 일상과 함께 달려왔습니다. 끊임없는 도전과
            혁신으로 2019년 주식회사 스타코엑스를 설립, 주유·세차·차량관리를
            아우르는 종합 모빌리티 서비스 기업으로 성장하였습니다.
          </p>
        </section>

        {/* 주유소 전경 슬라이드 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>별표주유소 전경</span>
          </div>
          <div className="relative w-full overflow-hidden rounded-xl">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, A11y]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              navigation={true}
              a11y={{ enabled: true }}
              style={
                {
                  width: '100%',
                  aspectRatio: '16/9',
                  '--swiper-navigation-size': '20px',
                  '--swiper-navigation-color': '#ffffff',
                  '--swiper-pagination-color': '#ffffff', // 활성 점 흰색
                  '--swiper-pagination-bullet-inactive-color': '#ffffff', // 비활성 점도 흰색
                  '--swiper-pagination-bullet-inactive-opacity': '0.4', // 비활성은 반투명
                } as React.CSSProperties
              }
            >
              {GALLERY_IMAGES.map((img, i) => (
                <SwiperSlide key={i} style={{ height: '100%' }}>
                  <ImageSlide src={img.src} alt={img.alt} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* 징기스칸 섹션 */}
        <section className="flex flex-col sm:flex-row gap-8 items-start border rounded-xl p-6 bg-card">
          <div className="relative aspect-[3/4] w-[140px] sm:w-[160px] overflow-hidden rounded-xl bg-white shrink-0">
            <GenghisKhanImage src="https://media.starcoex.com/starcoex-media/2026/06/files/uf/0be8191c-c8c3-462d-b0a8-2420cd1423d9.png" />
          </div>
          <div className="flex flex-col gap-4">
            <blockquote className="border-l-4 border-primary pl-5 py-2 space-y-1.5 text-muted-foreground italic">
              <p className="text-sm leading-relaxed">
                집안이 나쁘다고 탓하지 마라.
              </p>
              <p className="text-sm leading-relaxed">가난하다고 말하지 말라.</p>
              <p className="text-sm leading-relaxed">
                작은 나라에서 태어났다고 말하지 말라.
              </p>
              <p className="text-sm leading-relaxed">
                배운게 없다고 힘이 없다고 탓하지 말라.
              </p>
              <p className="text-sm leading-relaxed">
                너무 막막하다고, 그래서 포기해야겠다고 말하지 말라.
              </p>
              <p className="font-semibold text-foreground not-italic text-base mt-3">
                나는 나를 극복하는 순간 칭기즈칸이 되어 있었다.
              </p>
              <footer className="text-xs text-muted-foreground/70 not-italic mt-2">
                — 징기스칸 명언
              </footer>
            </blockquote>
            <p className="text-muted-foreground text-sm leading-relaxed tracking-[-0.32px]">
              이 말을 항상 가슴에 간직하고 실천하는 기업인이 되도록 열심히
              노력하겠습니다.
            </p>
          </div>
        </section>

        {/* 주요 지표 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMPANY_INFO.stats.map((stat) => (
            <div
              key={stat.key}
              className="rounded-xl border bg-card p-5 text-center space-y-1"
            >
              <div className="text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* 대표 인사말 */}
        <section className="space-y-5 border-l-4 border-primary/30 pl-6 py-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>CEO Message</span>
          </div>
          <p className="text-foreground leading-relaxed text-base font-medium">
            "저희 홈페이지를 찾아주신 고객님을 진심으로 환영합니다."
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            스타코엑스는 단순한 주유소가 아닙니다. 제주의 아름다운 길 위에서
            고객 여러분의 안전하고 쾌적한 이동을 책임지는 파트너입니다. 20년이
            넘는 시간 동안 한결같은 마음으로 고객 곁에 있었고, 앞으로도 그
            마음은 변하지 않을 것입니다.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            앞으로도 더 나은 서비스, 더 깨끗한 환경, 더 친절한 사람들로
            보답하겠습니다. 고객 여러분의 아낌없는 성원에 감사드립니다.
          </p>
          <p className="text-sm font-semibold text-foreground mt-2">
            {COMPANY_INFO.representative} · 대표이사
          </p>
        </section>

        {/* 사업 영역 */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>What we do</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">사업 영역</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {BUSINESS_AREAS.map((area, index) => {
              const Icon = area.icon;
              return (
                <div className="flex gap-2.5" key={index}>
                  <Icon className="mt-0.5 size-[18px] shrink-0" />
                  <div>
                    <h3 className="text-lg !leading-none tracking-[-0.96px]">
                      {area.title}
                    </h3>
                    <p className="text-muted-foreground mt-2.5 text-sm tracking-[-0.36px]">
                      {area.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 기본 정보 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-xl font-bold">기본 정보</h2>
          </div>
          <div className="rounded-xl border bg-card divide-y">
            {[
              { label: '회사명', value: COMPANY_INFO.legalName },
              { label: '대표자', value: COMPANY_INFO.representative },
              { label: '사업자등록번호', value: COMPANY_INFO.businessNumber },
              { label: '주소', value: COMPANY_INFO.address },
              { label: '전화', value: COMPANY_INFO.phone },
              { label: '이메일', value: COMPANY_INFO.email },
              { label: '운영시간', value: COMPANY_INFO.hours },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-col sm:flex-row sm:items-center px-5 py-3.5 gap-1 sm:gap-4"
              >
                <span className="text-xs font-semibold text-muted-foreground w-32 shrink-0">
                  {row.label}
                </span>
                <span className="text-sm text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AboutLayout>
  );
};
