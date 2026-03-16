import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSuggestions } from '@starcoex-frontend/suggestions';
import { suggestionColumns } from './components/suggestion-columns';
import { SuggestionsTable } from './components/suggestions-table';
import { SuggestionsAnalyticsPage } from './suggestions-analytics-page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PATH_STATUS_MAP } from './data/suggestion-data';

const SuggestionsPage = () => {
  const location = useLocation();
  const { suggestions, isLoading, error, fetchSuggestions, setSuggestions } =
    useSuggestions();

  const pathSegment = location.pathname.split('/').pop() ?? '';
  const statusFilter = PATH_STATUS_MAP[pathSegment];
  const isAnalytics = pathSegment === 'analytics';

  useEffect(() => {
    if (isAnalytics) return;
    setSuggestions([]);
    fetchSuggestions(statusFilter ? { status: statusFilter } : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (isAnalytics) {
    return <SuggestionsAnalyticsPage />;
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            건의사항을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
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

      {!error && (
        <SuggestionsTable data={suggestions} columns={suggestionColumns} />
      )}
    </div>
  );
};

export default SuggestionsPage;
