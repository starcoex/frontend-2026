import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSuggestions } from '@starcoex-frontend/suggestions';
import { suggestionColumns } from './components/suggestion-columns';
import { SuggestionsTable } from './components/suggestions-table';
import { SuggestionPrimaryActions } from './components/suggestion-primary-actions';
import { SuggestionsAnalyticsPage } from './suggestions-analytics-page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PATH_STATUS_MAP, PATH_TITLE_MAP } from './data/suggestion-data';

const SuggestionsPage = () => {
  const location = useLocation();
  const { suggestions, isLoading, error, fetchSuggestions, setSuggestions } =
    useSuggestions();

  const pathSegment = location.pathname.split('/').pop() ?? '';
  const statusFilter = PATH_STATUS_MAP[pathSegment];
  const pageTitle = PATH_TITLE_MAP[pathSegment] ?? '건의사항';
  const isAnalytics = pathSegment === 'analytics';

  useEffect(() => {
    if (isAnalytics) return; // 통계 페이지는 별도 처리
    setSuggestions([]);
    fetchSuggestions(statusFilter ? { status: statusFilter } : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ✅ 통계 분석 페이지로 분기
  if (isAnalytics) {
    return <SuggestionsAnalyticsPage />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            건의사항을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
          <p className="text-muted-foreground">
            {statusFilter
              ? `${pageTitle} 목록입니다.`
              : '전체 건의사항 목록입니다.'}
          </p>
        </div>
        <SuggestionPrimaryActions />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                fetchSuggestions(
                  statusFilter ? { status: statusFilter } : undefined
                )
              }
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && suggestions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-semibold mb-2">건의사항이 없습니다</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {statusFilter
              ? `${pageTitle}이 없습니다.`
              : '첫 건의사항을 등록해 보세요.'}
          </p>
          {!statusFilter && <SuggestionPrimaryActions />}
        </div>
      )}

      {!error && suggestions.length > 0 && (
        <div className="flex-1">
          <SuggestionsTable data={suggestions} columns={suggestionColumns} />
        </div>
      )}
    </>
  );
};

export default SuggestionsPage;
