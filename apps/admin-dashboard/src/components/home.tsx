import { Badge } from '@/components/ui/badge';
import { COMPANY_INFO } from '@/app/config/company-config';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { StarLogo } from '@starcoex-frontend/common';
import { Server, Sparkle, Users, Zap } from 'lucide-react';

const Home = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="border-x border-t border-dashed px-4 py-20 md:px-16">
          <div className="mx-auto max-w-3xl">
            <div className="bg-muted mx-auto mb-4 flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm">
              <Badge>New</Badge>
              스타코엑스 관리자 시스템 v1.0
            </div>
            <h1 className="my-4 mb-6 text-center text-3xl font-semibold lg:text-8xl">
              통합 관리 대시보드
            </h1>
            <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-center lg:text-xl">
              {COMPANY_INFO.name}의 모든 서비스를 한 곳에서 효율적으로
              관리하세요.
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button
                size="lg"
                className="w-full gap-2 sm:w-auto lg:mt-10"
                asChild
              >
                <Link to="/auth/login">
                  <div className="size-2 rounded-full bg-green-400"></div>
                  관리자 로그인
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 sm:w-auto lg:mt-10"
                asChild
              >
                <Link to="/auth/register">
                  <Avatar className="ring-input size-8 rounded-full ring-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <StarLogo format="svg" width={20} height={20} />
                    </div>
                  </Avatar>
                  계정 신청하기
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="relative grid border-x border-dashed md:grid-cols-3">
          <Sparkle className="fill-primary absolute right-0 top-0 h-auto w-5 -translate-y-2.5 translate-x-2.5" />
          <Sparkle className="fill-primary absolute left-0 top-0 h-auto w-5 -translate-x-2.5 -translate-y-2.5" />
          <div className="flex items-center gap-6 border-t border-dashed p-4 font-medium md:justify-center lg:p-10 lg:text-lg">
            <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md text-sm lg:size-12 lg:text-base">
              <Zap className="w-5 lg:w-6" />
            </span>
            실시간 분석 대시보드
          </div>
          <div className="flex items-center gap-6 border-x border-t border-dashed p-4 font-medium md:justify-center lg:p-10 lg:text-lg">
            <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md text-sm lg:size-12 lg:text-base">
              <Users className="w-5 lg:w-6" />
            </span>
            통합 사용자 관리
          </div>
          <div className="flex items-center gap-6 border-t border-dashed p-4 font-medium md:justify-center lg:p-10 lg:text-lg">
            <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md text-sm lg:size-12 lg:text-base">
              <Server className="w-5 lg:w-6" />
            </span>
            24시간 시스템 모니터링
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
