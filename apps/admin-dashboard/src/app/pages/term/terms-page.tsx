import React from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { TermsPage, SITE_TERMS_CONFIG } from '@starcoex-frontend/common';
import type { TermsType } from '@starcoex-frontend/common';

export const TermsPageRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const pathTypeMap: Record<string, TermsType> = {
    '/privacy': 'privacy',
    '/terms/security': 'security', // ★ 추가
  };

  const activeType =
    (searchParams.get('type') as TermsType | null) ??
    pathTypeMap[pathname] ??
    undefined;

  return (
    <>
      <PageHead
        title="약관 및 정책 - 스타코엑스 관리자"
        description="주식회사 스타코엑스 관리자 시스템의 이용약관 및 개인정보처리방침을 확인하세요."
      />
      <TermsPage config={SITE_TERMS_CONFIG.ADMIN} activeType={activeType} />
    </>
  );
};
