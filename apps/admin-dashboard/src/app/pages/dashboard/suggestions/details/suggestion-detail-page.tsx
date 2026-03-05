import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCalendar,
  IconTag,
  IconMessage,
} from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { useSuggestions } from '@starcoex-frontend/suggestions';
import type { SuggestionStatus } from '@starcoex-frontend/suggestions';
import {
  suggestionCategories,
  suggestionPriorities,
  suggestionStatuses,
} from '../data/suggestion-data';
import {
  StatusChangeDialog,
  STATUS_TRANSITIONS,
  STATUS_BUTTON_LABELS,
  STATUS_BUTTON_VARIANTS,
} from './components/status-change-dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@starcoex-frontend/auth';

export default function SuggestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // ← 현재 로그인 유저
  const isAdmin =
    currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';
  const {
    currentSuggestion,
    isLoading,
    error,
    fetchSuggestionById,
    updateSuggestionStatus,
  } = useSuggestions();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<SuggestionStatus | null>(
    null
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // useEffect(() => {
  //   if (id) fetchSuggestionById(Number(id));
  // }, [id, fetchSuggestionById]);

  useEffect(() => {
    if (!id) return;

    const numericId = Number(id);
    // ✅ id가 유효한 숫자인지 검사
    if (isNaN(numericId) || numericId <= 0) {
      navigate('/admin/suggestions', { replace: true });
      return;
    }

    fetchSuggestionById(numericId);
  }, [id, fetchSuggestionById, navigate]);

  useEffect(() => {
    if (!isLoading && error) {
      navigate('/admin/suggestions', { replace: true });
    }
  }, [isLoading, error, navigate]);

  const handleStatusClick = (status: SuggestionStatus) => {
    setTargetStatus(status);
    setDialogOpen(true);
  };

  const handleConfirm = async (adminResponse: string) => {
    if (!targetStatus || !currentSuggestion) return;
    setIsUpdating(true);
    await updateSuggestionStatus({
      id: currentSuggestion.id,
      status: targetStatus,
      adminResponse: adminResponse || undefined,
    });
    setIsUpdating(false);
    setDialogOpen(false);
    setTargetStatus(null);
  };

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

  if (!currentSuggestion) return null;

  const suggestion = currentSuggestion;
  const status = suggestionStatuses.find((s) => s.value === suggestion.status);
  const priority = suggestionPriorities.find(
    (p) => p.value === suggestion.priority
  );
  const category = suggestionCategories.find(
    (c) => c.value === suggestion.category
  );

  // ✅ 관리자만 다음 상태 버튼 표시
  const nextStatuses = isAdmin
    ? STATUS_TRANSITIONS[suggestion.status] ?? []
    : [];

  // ✅ adminResponse: metadata에서 추출
  const adminResponse = suggestion.metadata?.['adminResponse'] as
    | string
    | undefined;

  // ✅ 버그 신고 관련 추가 정보 존재 여부
  const hasBugInfo =
    suggestion.metadata?.['pageUrl'] ||
    suggestion.metadata?.['errorMessage'] ||
    (Array.isArray(suggestion.metadata?.['reproductionSteps']) &&
      suggestion.metadata['reproductionSteps'].length > 0);

  const PriorityIcon =
    suggestion.priority === 'HIGH'
      ? IconArrowUp
      : suggestion.priority === 'MEDIUM'
      ? IconArrowRight
      : IconArrowDown;

  const priorityColor =
    suggestion.priority === 'HIGH'
      ? 'bg-red-100 text-red-700 hover:bg-red-100 hover:text-red-700'
      : suggestion.priority === 'MEDIUM'
      ? 'bg-orange-100 text-orange-700 hover:bg-orange-100 hover:text-orange-700'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-600';

  const statusColor =
    suggestion.status === 'COMPLETED'
      ? 'border-green-200 bg-green-100 text-green-700'
      : suggestion.status === 'IN_PROGRESS'
      ? 'border-blue-200 bg-blue-100 text-blue-700'
      : suggestion.status === 'REJECTED'
      ? 'border-red-200 bg-red-100 text-red-700'
      : suggestion.status === 'REVIEWING'
      ? 'border-yellow-200 bg-yellow-100 text-yellow-700'
      : '';

  return (
    <div>
      <div className="max-w-3xl">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin/suggestions">건의사항</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>#{suggestion.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-3xl">
        {/* 제목 + 상태 변경 버튼 (관리자만) */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {category && <Badge variant="outline">{category.label}</Badge>}
              {suggestion.targetApp && (
                <Badge variant="secondary">{suggestion.targetApp}</Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold">{suggestion.title}</h1>
            {suggestion.tags && suggestion.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {suggestion.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 text-xs text-muted-foreground"
                  >
                    <IconTag className="h-3 w-3" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ 관리자 전용 상태 변경 버튼 */}
          {isAdmin && nextStatuses.length > 0 && (
            <div className="flex flex-col gap-2 shrink-0">
              {nextStatuses.map((next) => (
                <Button
                  key={next}
                  size="sm"
                  variant={STATUS_BUTTON_VARIANTS[next] ?? 'outline'}
                  onClick={() => handleStatusClick(next)}
                  disabled={isUpdating}
                >
                  {next === 'COMPLETED' && '✅ '}
                  {next === 'REJECTED' && '❌ '}
                  {STATUS_BUTTON_LABELS[next]}
                </Button>
              ))}
            </div>
          )}

          {/* 최종 상태 뱃지 */}
          {(!isAdmin || nextStatuses.length === 0) && (
            <Badge
              variant="outline"
              className={`text-sm px-3 py-1 ${statusColor}`}
            >
              {status?.label}
            </Badge>
          )}
        </div>

        {/* ✅ 거부/완료 사유 표시 (adminResponse) */}
        {adminResponse && (
          <div
            className={`mb-6 rounded-lg border p-4 text-sm ${
              suggestion.status === 'REJECTED'
                ? 'border-red-200 bg-red-50'
                : 'border-green-200 bg-green-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-semibold">
              <IconMessage className="h-4 w-4" />
              <span>
                {suggestion.status === 'REJECTED' ? '거부 사유' : '관리자 메모'}
              </span>
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {adminResponse}
            </p>
          </div>
        )}

        {/* 메타 정보 그리드 */}
        <div className="bg-card mb-6 grid grid-cols-1 gap-x-8 gap-y-4 rounded-lg border p-6 text-sm md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-24">우선순위</span>
              <div className="flex items-center gap-1">
                <PriorityIcon className="h-3.5 w-3.5" />
                <Badge className={`text-xs ${priorityColor}`}>
                  {priority?.label ?? '-'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-24">작성자</span>
              <span>
                {suggestion.userEmail ?? `사용자 #${suggestion.userId}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-24">등록일</span>
              <div className="flex items-center gap-1">
                <IconCalendar className="text-muted-foreground h-3.5 w-3.5" />
                <span>
                  {format(new Date(suggestion.createdAt), 'yyyy년 MM월 dd일', {
                    locale: ko,
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-24">수정일</span>
              <div className="flex items-center gap-1">
                <IconCalendar className="text-muted-foreground h-3.5 w-3.5" />
                <span>
                  {format(new Date(suggestion.updatedAt), 'yyyy년 MM월 dd일', {
                    locale: ko,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-24">상태</span>
              <Badge variant="outline" className={`text-xs ${statusColor}`}>
                {status?.label ?? suggestion.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-24">카테고리</span>
              <span>{category?.label ?? suggestion.category}</span>
            </div>
            {suggestion.resolvedAt && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-24">완료일</span>
                <div className="flex items-center gap-1">
                  <IconCalendar className="text-muted-foreground h-3.5 w-3.5" />
                  <span>
                    {format(
                      new Date(suggestion.resolvedAt),
                      'yyyy년 MM월 dd일',
                      { locale: ko }
                    )}
                  </span>
                </div>
              </div>
            )}
            {suggestion.targetApp && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-24">대상 앱</span>
                <span>{suggestion.targetApp}</span>
              </div>
            )}
          </div>
        </div>

        {/* 탭 */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="text-sm">
            <TabsTrigger value="description">내용</TabsTrigger>
            {/* ✅ 버그 신고 관련 정보가 있을 때만 탭 표시 */}
            {hasBugInfo && (
              <TabsTrigger value="metadata">버그 상세 정보</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose prose-sm text-muted-foreground max-w-none whitespace-pre-wrap rounded-lg border p-4">
              {suggestion.description}
            </div>
          </TabsContent>

          {hasBugInfo && (
            <TabsContent value="metadata" className="mt-4">
              <div className="space-y-3 rounded-lg border p-4 text-sm">
                {suggestion.metadata?.['pageUrl'] && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-32 shrink-0">
                      페이지 URL
                    </span>
                    <span className="break-all">
                      {suggestion.metadata['pageUrl']}
                    </span>
                  </div>
                )}
                {suggestion.metadata?.['errorMessage'] && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-32 shrink-0">
                      에러 메시지
                    </span>
                    <span className="font-mono text-xs text-red-600 break-all">
                      {suggestion.metadata['errorMessage']}
                    </span>
                  </div>
                )}
                {Array.isArray(suggestion.metadata?.['reproductionSteps']) &&
                  suggestion.metadata['reproductionSteps'].length > 0 && (
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-32 shrink-0">
                        재현 단계
                      </span>
                      <ol className="list-decimal pl-4 space-y-1">
                        {(
                          suggestion.metadata['reproductionSteps'] as string[]
                        ).map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <StatusChangeDialog
        open={dialogOpen}
        targetStatus={targetStatus}
        currentStatus={suggestion.status} // ← 추가
        onConfirm={handleConfirm}
        onCancel={() => {
          setDialogOpen(false);
          setTargetStatus(null);
        }}
        isLoading={isUpdating}
      />
    </div>
  );
}
