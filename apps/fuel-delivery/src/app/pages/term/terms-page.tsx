import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { TermsPage, SITE_TERMS_CONFIG } from '@starcoex-frontend/common';
import type { TermsType } from '@starcoex-frontend/common';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin } from 'lucide-react';

export const TermsPageRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation(); // ★ 추가

  // ★ 경로별 자동 타입 매핑
  const pathTypeMap: Record<string, TermsType> = {
    '/privacy': 'privacy',
    '/location-terms': 'location',
  };

  const activeType =
    (searchParams.get('type') as TermsType | null) ??
    pathTypeMap[pathname] ??
    undefined;

  return (
    <>
      <PageHead
        title="약관 및 정책 - 스타코엑스 난방유 배달"
        description="주식회사 스타코엑스 난방유 배달 서비스의 이용약관, 개인정보처리방침, 개인위치정보 처리방침을 확인하세요."
      />
      {/* 위치정보 서비스 안내 배너 */}
      <div className="container max-w-3xl pt-8 px-4 md:px-6">
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <MapPin className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-200">
            위치기반 서비스 안내
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300 text-xs">
            본 서비스는 배달 지점 확인을 위해 개인위치정보를 수집·이용합니다.
            아래 <strong>개인위치정보 처리방침</strong>을 반드시 확인해 주세요.
          </AlertDescription>
        </Alert>
      </div>
      <TermsPage
        config={SITE_TERMS_CONFIG.DELIVERY}
        activeType={activeType ?? undefined}
      />
    </>
  );
};
