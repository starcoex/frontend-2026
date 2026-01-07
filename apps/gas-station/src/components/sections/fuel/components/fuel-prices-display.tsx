import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FuelPricesErrorProps {
  error: string;
  onRetry: () => void;
  isLoading: boolean;
}

const SECTION_CLASSES = 'bg-obsidian relative overflow-hidden px-2.5 lg:px-0';
const CONTAINER_CLASSES =
  'container flex flex-col items-center justify-center gap-8 overflow-hidden py-12 text-center md:py-20';

const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <section className={SECTION_CLASSES}>
    <div className={CONTAINER_CLASSES}>{children}</div>
  </section>
);

const LoadingSpinner: React.FC = () => (
  <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
);

const ErrorIcon: React.FC = () => (
  <div className="w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
  </div>
);

const LoadingMessage: React.FC = () => (
  <div className="text-center">
    <LoadingSpinner />
    <h3 className="text-lg font-semibold text-foreground mb-2">
      연료 가격 정보 로딩 중...
    </h3>
    <p className="text-muted-foreground">최신 유가 정보를 가져오고 있습니다</p>
  </div>
);

const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      유가 정보 로드 실패
    </h3>
    <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
  </div>
);

const RetryButton: React.FC<{ onRetry: () => void; isLoading: boolean }> = ({
  onRetry,
  isLoading,
}) => (
  <Button
    onClick={onRetry}
    variant="outline"
    size="sm"
    disabled={isLoading}
    className="min-w-[120px]"
  >
    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
    다시 시도
  </Button>
);

const ErrorContent: React.FC<FuelPricesErrorProps> = ({
  error,
  onRetry,
  isLoading,
}) => (
  <div className="text-center space-y-4">
    <ErrorIcon />
    <div>
      <ErrorMessage error={error} />
      <RetryButton onRetry={onRetry} isLoading={isLoading} />
    </div>
  </div>
);

// ==============================================================================
// 메인 컴포넌트들
// ==============================================================================

export const FuelPricesLoading: React.FC = () => (
  <SectionWrapper>
    <LoadingMessage />
  </SectionWrapper>
);

export const FuelPricesError: React.FC<FuelPricesErrorProps> = ({
  error,
  onRetry,
  isLoading,
}) => {
  const displayError = error?.trim() || '알 수 없는 오류가 발생했습니다.';
  return (
    <SectionWrapper>
      <ErrorContent
        error={displayError}
        onRetry={onRetry}
        isLoading={isLoading}
      />
    </SectionWrapper>
  );
};
