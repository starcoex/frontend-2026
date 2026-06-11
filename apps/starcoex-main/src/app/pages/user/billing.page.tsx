import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BillingForm } from '@starcoex-frontend/common';

export const BillingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">결제 정보</h1>
          <p className="text-sm text-muted-foreground">
            결제 수단 및 청구지 정보를 관리합니다.
          </p>
        </div>
      </div>

      <BillingForm />
    </div>
  );
};
