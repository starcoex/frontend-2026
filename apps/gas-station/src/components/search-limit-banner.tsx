import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchLimitBannerProps {
  remainingSearches: number;
  totalLimit: number;
  isLimitReached: boolean;
}

export const SearchLimitBanner: React.FC<SearchLimitBannerProps> = ({
  remainingSearches,
  totalLimit,
  isLimitReached,
}) => {
  if (isLimitReached) {
    // 제한 도달 시
    return (
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          오늘의 무료 검색 횟수를 모두 사용했습니다
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          무료 회원가입 후 무제한으로 주유소를 검색하세요!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/auth/register">
              <UserPlus className="w-4 h-4 mr-2" />
              무료 회원가입
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auth/login">로그인</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          내일 자정에 무료 검색 횟수가 초기화됩니다
        </p>
      </div>
    );
  }

  // 남은 횟수 표시
  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg mb-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Search className="w-4 h-4" />
        <span>
          오늘 남은 무료 검색:{' '}
          <strong className="text-foreground">
            {remainingSearches}/{totalLimit}회
          </strong>
        </span>
      </div>
      <Link
        to="/auth/register"
        className="text-xs text-primary hover:underline"
      >
        무제한 검색하기 →
      </Link>
    </div>
  );
};
