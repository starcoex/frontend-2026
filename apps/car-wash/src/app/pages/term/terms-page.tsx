import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PageHead } from '@starcoex-frontend/common';
import { TermsPage, SITE_TERMS_CONFIG } from '@starcoex-frontend/common';
import type { TermsType } from '@starcoex-frontend/common';

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
        title="약관 및 정책 - 제라게 카케어"
        description="제라게카케어(대표: 고정훈)의 이용약관 및 개인정보처리방침을 확인하세요."
      />
      <TermsPage
        config={SITE_TERMS_CONFIG.ZERAGAE}
        activeType={activeType ?? undefined}
      />
    </>
  );
};
