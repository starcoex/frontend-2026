import React from 'react';
import { COMPANY_INFO } from '@/app/config/company.config';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import {
  Droplets,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';

const BUSINESS_AREAS = [
  {
    icon: Droplets,
    title: '주유 서비스',
    description:
      '무연휘발유, 경유, 등유 등 고품질 연료를 합리적인 가격으로 제공합니다. 빠르고 친절한 서비스로 제주도민의 일상을 함께합니다.',
  },
  {
    icon: Sparkles,
    title: '프리미엄 세차',
    description:
      '5단계 자동세차 시스템으로 차량의 외관을 완벽하게 관리합니다. 세라믹 코팅부터 실내 디테일링까지 전문적인 케어를 제공합니다.',
  },
  {
    icon: Wrench,
    title: '차량 관리',
    description:
      '엔진오일 교환, 타이어 점검, 소모품 교체 등 기본적인 차량 유지관리 서비스를 원스톱으로 제공합니다.',
  },
  {
    icon: TrendingUp,
    title: '멤버십 혜택',
    description:
      '정기 이용 고객을 위한 멤버십 프로그램으로 포인트 적립, 할인 쿠폰, 우선 서비스 등 다양한 혜택을 누리실 수 있습니다.',
  },
] as const;

export const AboutPage: React.FC = () => {
  return (
    <AboutLayout title="회사소개" subtitle="스타코엑스를 소개합니다">
      <div className="space-y-16">
        {/* 히어로 섹션 */}
        <section className="border-y">
          <div className="flex flex-col max-lg:divide-y lg:flex-row">
            {/* 왼쪽: 메인 타이틀 + 회사 소개 이미지 */}
            <div className="flex-1 lg:border-l">
              <div className="lg:border-b lg:pr-8 lg:pb-5 lg:pl-2">
                <h2 className="text-[2rem] leading-[1.2] tracking-[-1.6px] md:text-[2.75rem] md:tracking-[-2px] font-bold">
                  제주의 길 위에서
                  <br />
                  <span className="text-primary">20년을 함께</span>했습니다
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed tracking-[-0.32px]">
                  2003년 <strong className="text-foreground">"별표"</strong>{' '}
                  석유를 시작으로, 제주도민의 일상과 함께 달려왔습니다. 끊임없는
                  도전과 혁신으로 2019년 주식회사 스타코엑스를 설립,
                  주유·세차·차량관리를 아우르는 종합 모빌리티 서비스 기업으로
                  성장하였습니다.
                </p>
              </div>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden lg:mr-8 lg:mb-8 lg:ml-2 rounded-xl bg-muted">
                <img
                  src="/images/about/company.jpg"
                  alt="스타코엑스 회사 전경"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
                  회사 전경 이미지
                </div>
              </div>
            </div>

            {/* 오른쪽: 징기스칸 인용 + 이미지 */}
            <div className="lg:border-x lg:px-8 lg:py-5 flex flex-col justify-between gap-8 py-8">
              <div className="flex justify-center gap-6">
                <div className="relative aspect-[3/4] w-[180px] lg:w-[220px] overflow-hidden rounded-xl bg-muted shrink-0">
                  <img
                    src="/images/about/genghis-khan.jpg"
                    alt="징기스칸"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs text-center px-2">
                    징기스칸 이미지
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-primary pl-5 py-2 space-y-1.5 text-muted-foreground italic">
                <p className="text-sm leading-relaxed">
                  집안이 나쁘다고 탓하지 마라.
                </p>
                <p className="text-sm leading-relaxed">
                  가난하다고 말하지 말라.
                </p>
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

        {/* 오시는 길 + 기본 정보 */}
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
