import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../ui';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError() as any;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <AlertTriangle className="w-full h-full" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            오류가 발생했습니다
          </h1>

          <p className="text-gray-600 mb-6">
            {error?.message || '페이지를 불러오는 중 문제가 발생했습니다.'}
          </p>

          <div className="space-y-3">
            <Button onClick={handleRefresh} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              다시 시도
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <summary className="cursor-pointer font-medium text-red-800">
              개발자 정보
            </summary>
            <pre className="mt-2 text-xs text-red-700 overflow-auto">
              {error?.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};
