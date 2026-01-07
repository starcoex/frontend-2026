import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const processSteps = [
  {
    step: '01',
    title: '예비 세척 (Pre-Rinse)',
    description:
      '초고압수로 차량 전체의 먼지와 오염물을 1차적으로 불려 제거합니다. 이 단계에서 대부분의 모래 입자가 제거되어 스크래치를 방지합니다.',
    image:
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop',
    features: ['초고압수 분사', '모래/먼지 1차 제거', '도장면 보호'],
  },
  {
    step: '02',
    title: '스노우 폼 (Snow Foam)',
    description:
      '쫀쫀한 스노우 폼을 차량 전체에 도포하여 오염물을 완벽하게 불립니다. pH 중성 폼이 도장면에 안전하게 작용합니다.',
    image:
      'https://images.unsplash.com/photo-1567594684926-e45f9434c384?q=80&w=800&auto=format&fit=crop',
    features: ['pH 중성 폼 사용', '오염물 불림', '5분간 침투'],
  },
  {
    step: '03',
    title: '핸드 워시 (Hand Wash)',
    description:
      '100% 양모 미트로 부드럽게 도장면을 터치합니다. 투버킷 방식으로 오염된 물이 다시 차에 닿지 않도록 합니다.',
    image:
      'https://images.unsplash.com/photo-1520340356584-7c9948871d62?q=80&w=800&auto=format&fit=crop',
    features: ['양모 미트 사용', '투버킷 방식', '스크래치 제로'],
  },
  {
    step: '04',
    title: '하부 세차 (Underbody Wash)',
    description:
      '눈에 보이지 않는 하부까지 꼼꼼하게 세척합니다. 겨울철 염화칼슘 제거에 특히 효과적입니다.',
    image:
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=800&auto=format&fit=crop',
    features: ['염화칼슘 제거', '부식 방지', '360도 세척'],
  },
  {
    step: '05',
    title: '린스 & 드라잉 (Rinse & Dry)',
    description:
      '깨끗한 정수로 헹군 후, 에어블로워와 극세사 타월로 물기를 완벽하게 제거합니다. 물 얼룩 걱정 없는 마무리.',
    image:
      'https://images.unsplash.com/photo-1605515298946-d063f2e92d2d?q=80&w=800&auto=format&fit=crop',
    features: ['에어블로워 드라잉', '극세사 타월 마감', '물얼룩 제로'],
  },
];

export const ProcessSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* 헤더 영역 */}
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            별표주유소의
            <br />
            <span className="text-primary">프리미엄 세차 프로세스</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            5단계의 체계적인 프로세스로 당신의 차량을 출고 당시의 빛나는
            모습으로 되돌립니다. 모든 과정에서 도장면 보호를 최우선으로
            생각합니다.
          </p>
        </div>

        {/* 프로세스 스텝 목록 */}
        <div className="space-y-24 md:space-y-32">
          {processSteps.map((item, index) => (
            <div
              key={item.step}
              className={`grid items-center gap-8 md:grid-cols-2 lg:gap-16 ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* 이미지 */}
              <div className={index % 2 === 1 ? 'md:order-2' : 'md:order-1'}>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 text-8xl font-black text-primary/10 select-none">
                    {item.step}
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-video w-full rounded-3xl object-cover shadow-2xl"
                  />
                </div>
              </div>

              {/* 텍스트 */}
              <div className={index % 2 === 1 ? 'md:order-1' : 'md:order-2'}>
                <div className="text-primary font-bold text-sm tracking-widest mb-2">
                  STEP {item.step}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {item.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* 특징 목록 */}
                <div className="space-y-3">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-24" />

        {/* CTA 영역 */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            지금 바로 프리미엄 세차를 경험하세요
          </h3>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            별표주유소의 전문 세차 서비스로 당신의 소중한 차량을 관리하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2" asChild>
              <a href="/services">
                세차 서비스 보기
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/location">주유소 찾기</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
