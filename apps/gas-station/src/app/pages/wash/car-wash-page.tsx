import React from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Check,
  CalendarDays,
  Ticket,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { APP_CONFIG } from '@/app/config/app.config';

export const CarWashPage: React.FC = () => {
  const products = [
    {
      id: 'sub-monthly',
      type: 'SUBSCRIPTION',
      title: '월간 무제한 구독',
      price: '₩29,900',
      period: '/ 월',
      description: '비가 와도, 눈이 와도 걱정 없는 매일 세차',
      features: [
        '월 횟수 제한 없는 자동세차',
        '구독자 전용 입장 라인 (대기 없음)',
        '프리미엄 왁스 코팅 포함',
        '실내 진공청소기 무료 이용',
      ],
      icon: CalendarDays,
      gradient: 'from-rose-500 to-pink-600',
      cta: '구독 시작하기',
    },
    {
      id: 'coupon-book',
      type: 'COUPON',
      title: '5+1 세차 쿠폰북',
      price: '₩50,000',
      period: '(6매)',
      description: '가족, 친구와 나눠 쓸 수 있는 알뜰 쿠폰',
      features: [
        '5장 가격에 6장 제공 (16% 할인)',
        '유효기간 1년 넉넉하게',
        '모바일 선물하기 가능',
        '차량 번호 등록 없이 누구나 사용',
      ],
      icon: Ticket,
      gradient: 'from-violet-500 to-purple-600',
      cta: '쿠폰북 구매하기',
      popular: true,
    },
  ];

  return (
    <>
      <PageHead
        title="세차 구독 & 쿠폰 - 별표주유소"
        description="매일 새 차 타는 기분. 합리적인 가격의 무제한 세차 구독과 쿠폰북을 만나보세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/store/carwash`}
      />

      <div className="min-h-screen bg-background pb-20">
        {/* 헤더 */}
        <div className="bg-obsidian border-b border-dark-gray py-20 text-center px-4">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-blue-500/10">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            언제나 새 차처럼, 반짝이게
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            최첨단 노터치 자동세차기를 무제한으로 이용하거나,
            <br />
            가족과 함께 쓰는 쿠폰으로 실속을 챙기세요.
          </p>
        </div>

        {/* 상품 목록 */}
        <div className="container mx-auto px-4 -mt-10">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`border-0 shadow-xl relative overflow-hidden ${
                  product.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {product.popular && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    BEST SELLER
                  </div>
                )}
                <div
                  className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${product.gradient}`}
                />

                <CardHeader className="pt-10 pb-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${product.gradient} text-white`}
                    >
                      <product.icon className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-muted-foreground tracking-wider uppercase">
                      {product.type}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {product.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{product.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-foreground">
                      {product.price}
                    </span>
                    <span className="text-muted-foreground">
                      {product.period}
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full h-12 text-lg" size="lg">
                    {product.cta} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 이용 가이드 이미지/섹션 (예시) */}
        <div className="container mx-auto px-4 mt-20 max-w-5xl">
          <div className="bg-muted/20 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">어떻게 이용하나요?</h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  step: '01',
                  title: '상품 구매',
                  desc: '웹사이트 또는 앱에서 구독/쿠폰 구매',
                },
                {
                  step: '02',
                  title: 'QR 코드 발급',
                  desc: '마이페이지에서 전용 QR코드 확인',
                },
                {
                  step: '03',
                  title: '즉시 세차',
                  desc: '세차기 입구 리더기에 스캔 후 입장',
                },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="text-4xl font-bold text-muted-foreground/20 mb-2">
                    {step.step}
                  </div>
                  <div className="text-lg font-bold mb-2">{step.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
