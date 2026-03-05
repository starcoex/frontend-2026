import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSuggestions } from '@starcoex-frontend/suggestions';
import {
  suggestionStatuses,
  suggestionCategories,
  suggestionPriorities,
} from './data/suggestion-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function SuggestionsAnalyticsPage() {
  const { suggestions, isLoading, fetchSuggestions } = useSuggestions();

  useEffect(() => {
    // 통계를 위해 전체 목록 조회
    fetchSuggestions({ limit: 100 });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // ✅ 상태별 건수 계산
  const statusCounts = suggestionStatuses.map((s) => ({
    ...s,
    count: suggestions.filter((sg) => sg.status === s.value).length,
    url: `/admin/suggestions/${s.value.toLowerCase().replace(/_/g, '-')}`,
  }));

  // ✅ 카테고리별 건수 계산
  const categoryCounts = suggestionCategories.map((c) => ({
    ...c,
    count: suggestions.filter((sg) => sg.category === c.value).length,
  }));

  // ✅ 우선순위별 건수 계산
  const priorityCounts = suggestionPriorities.map((p) => ({
    ...p,
    count: suggestions.filter((sg) => sg.priority === p.value).length,
  }));

  const totalCount = suggestions.length;
  const resolvedCount = suggestions.filter(
    (s) => s.status === 'COMPLETED' || s.status === 'REJECTED'
  ).length;
  const pendingCount = suggestions.filter((s) => s.status === 'PENDING').length;
  const processingRate =
    totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  const statusColors: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-700',
    REVIEWING: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">건의사항 통계</h2>
        <p className="text-muted-foreground">
          전체 건의사항 현황을 확인합니다.
        </p>
      </div>

      {/* ✅ 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 건의사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              대기중
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              처리 완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {resolvedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              처리율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {processingRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ 상태별 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">상태별 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {statusCounts.map((s) => (
            <Link
              key={s.value}
              to={s.url}
              className="flex items-center justify-between rounded-lg p-3 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{s.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {/* 진행바 */}
                <div className="hidden sm:block w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width:
                        totalCount > 0
                          ? `${(s.count / totalCount) * 100}%`
                          : '0%',
                    }}
                  />
                </div>
                <Badge
                  className={`min-w-[2.5rem] justify-center ${
                    statusColors[s.value]
                  }`}
                >
                  {s.count}건
                </Badge>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* ✅ 카테고리별 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">카테고리별 현황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryCounts
              .sort((a, b) => b.count - a.count)
              .map((c) => (
                <div
                  key={c.value}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{c.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width:
                            totalCount > 0
                              ? `${(c.count / totalCount) * 100}%`
                              : '0%',
                        }}
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className="min-w-[2.5rem] justify-center"
                    >
                      {c.count}건
                    </Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* ✅ 우선순위별 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">우선순위별 현황</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorityCounts.map((p) => {
              const colorMap: Record<string, string> = {
                HIGH: 'bg-red-100 text-red-700',
                MEDIUM: 'bg-orange-100 text-orange-700',
                LOW: 'bg-gray-100 text-gray-600',
              };
              return (
                <div
                  key={p.value}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <p.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width:
                            totalCount > 0
                              ? `${(p.count / totalCount) * 100}%`
                              : '0%',
                        }}
                      />
                    </div>
                    <Badge
                      className={`min-w-[2.5rem] justify-center ${
                        colorMap[p.value]
                      }`}
                    >
                      {p.count}건
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
