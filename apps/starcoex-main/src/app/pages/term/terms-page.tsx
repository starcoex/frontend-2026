import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { TermsPage, SITE_TERMS_CONFIG } from '@starcoex-frontend/common';
import type { TermsType } from '@starcoex-frontend/common';

export const TermsPageRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

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
        title="약관 및 정책 - 스타코엑스"
        description="주식회사 스타코엑스의 이용약관, 개인정보처리방침, SMS 수신동의 약관을 확인하세요."
      />
      <TermsPage
        config={SITE_TERMS_CONFIG.MAIN}
        activeType={activeType ?? undefined}
      />
    </>
  );
};
