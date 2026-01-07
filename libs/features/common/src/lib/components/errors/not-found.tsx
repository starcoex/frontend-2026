import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import React from 'react';
import { ErrorImages } from '../../errors';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="p-4 bg-background grid h-screen items-center pb-8 lg:grid-cols-2 lg:pb-0">
      <div className="text-center">
        <p className="text-muted-foreground text-base font-semibold">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-muted-foreground mt-6 text-base leading-7">
          죄송합니다. 원하시는 페이지를 찾을 수 없습니다.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-2">
          <Button size="lg" asChild>
            <Link to="/">홈으로</Link>
          </Button>
          <Button size="lg" variant="ghost">
            지원팀에 문의하세요 <ArrowRight className="ms-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="hidden lg:block">
        <img src={ErrorImages.error404} alt="404 Not Found" />
      </div>
    </div>
  );
};
