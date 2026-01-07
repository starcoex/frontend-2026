import React from 'react';
import { useRouteError } from 'react-router-dom';
import { AlertCircle, RefreshCw, Fuel } from 'lucide-react';
import { Button } from '../ui';

export const OpinetErrorBoundary: React.FC = () => {
  const error = useRouteError();

  const isOpinetError = React.useMemo(() => {
    if (error instanceof Error) {
      return (
        error.message.includes('localhost:4117') ||
        error.message.includes('graphql') ||
        error.message.includes('INTERNAL_SERVER_ERROR')
      );
    }
    return false;
  }, [error]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <section className="bg-obsidian min-h-[400px] flex items-center justify-center px-4">
      <div className="bg-jet border border-dark-gray rounded-2xl p-8 md:p-12 max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/10 p-4 rounded-full">
            {isOpinetError ? (
              <Fuel className="w-12 h-12 text-red-400" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-400" />
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-3">
          {isOpinetError
            ? '유가 정보를 불러올 수 없습니다'
            : '페이지 로드 실패'}
        </h2>

        <p className="text-gray-400 mb-6">
          {isOpinetError
            ? 'Opinet API 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
            : '예상치 못한 오류가 발생했습니다.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleRetry} variant="default">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
          >
            홈으로 이동
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error instanceof Error && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">
              개발자 정보
            </summary>
            <pre className="mt-2 p-3 bg-black/50 rounded text-xs text-red-300 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </section>
  );
};
