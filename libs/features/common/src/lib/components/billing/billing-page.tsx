import React from 'react';
import { BillingForm } from './billing-form';

interface BillingPageProps {
  ContentSection?: React.ComponentType<{
    title: string;
    desc: string;
    children: React.ReactNode;
  }>;
}

export const BillingPage: React.FC<BillingPageProps> = ({ ContentSection }) => {
  const content = <BillingForm />;

  if (ContentSection) {
    return (
      <ContentSection
        title="결제 설정"
        desc="결제 수단 및 구독 정보를 관리합니다."
      >
        {content}
      </ContentSection>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold">결제 정보</h1>
        <p className="text-sm text-muted-foreground mt-1">
          결제 수단 및 청구지 정보를 관리합니다.
        </p>
      </div>
      {content}
    </div>
  );
};
