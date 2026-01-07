import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Fuel, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import React from 'react';

export const MembershipSection: React.FC = () => (
  <div className="bg-background py-16 lg:py-24 border-t">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* 셀프 주유소 이용 가이드 */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-foreground text-background p-6 flex items-center gap-4">
            <div className="bg-background/20 p-3 rounded-xl">
              <Fuel className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">셀프 주유소 할인 이용 방법</h3>
              <p className="text-background/80 text-sm">
                앱으로 결제하고 바로 주유하세요
              </p>
            </div>
          </div>
          <CardContent className="p-8">
            <ol className="relative border-l border-muted ml-3 space-y-8">
              {[
                {
                  title: '앱에서 미리 결제',
                  desc: '금액 선택 및 할인 쿠폰 적용 후 결제',
                },
                {
                  title: '예약 번호 발급',
                  desc: '결제 완료 시 6자리 예약 번호 발급',
                },
                {
                  title: '주유기 입력',
                  desc: '[모바일/예약] 버튼 누르고 번호 입력',
                },
              ].map((step, idx) => (
                <li key={idx} className="ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-muted rounded-full -left-4 ring-4 ring-background">
                    <span className="font-bold text-sm">{idx + 1}</span>
                  </span>
                  <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* 멤버십 혜택 안내 */}
        <Card className="border shadow-sm overflow-hidden flex flex-col">
          <div className="bg-muted p-6 flex items-center gap-4">
            <div className="bg-foreground/10 p-3 rounded-xl">
              <Star className="w-8 h-8 text-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                스타코엑스 리워드 멤버십
              </h3>
              <p className="text-muted-foreground text-sm">
                주유할 때마다 별이 쏟아집니다
              </p>
            </div>
          </div>
          <CardContent className="p-8 flex flex-col h-full">
            <div className="mb-6">
              <p className="text-lg font-medium leading-relaxed mb-6">
                주유 금액이 멤버십 실적(별)에{' '}
                <span className="text-primary font-bold">100% 반영</span>
                됩니다.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-3 bg-muted/50 p-4 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold block">별 적립</span>
                    <span className="text-sm text-muted-foreground">
                      1만원당 별 1개 적립, 등급에 따라 추가 혜택
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-muted/50 p-4 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold block">VIP 전용 혜택</span>
                    <span className="text-sm text-muted-foreground">
                      VIP 등급 달성 시 추가 할인 및 특별 서비스
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-4">
              <Button asChild className="w-full h-12 text-lg">
                <Link to="/membership">
                  멤버십 자세히 보기 <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
