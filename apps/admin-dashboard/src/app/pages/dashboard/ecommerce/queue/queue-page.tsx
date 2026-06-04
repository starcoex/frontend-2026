import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useQueue } from '@starcoex-frontend/queue';
import { QueueTable } from './components/queue-table';

export default function QueuePage() {
  const { sessions, isLoading, error, fetchQueueSessions } = useQueue();

  useEffect(() => {
    fetchQueueSessions({});
  }, [fetchQueueSessions]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            대기열 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`대기열 관리 - ${COMPANY_INFO.name}`}
        description="대기열 세션 목록을 관리하고 상태를 확인하세요."
        keywords={['대기열 관리', '대기열 목록', COMPANY_INFO.name]}
        og={{
          title: `대기열 관리 - ${COMPANY_INFO.name}`,
          description: '대기열 세션 조회 및 상태 관리 시스템',
          image: '/images/og-queue.jpg',
          type: 'website',
        }}
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchQueueSessions({})}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && (
        <QueueTable data={sessions} onRefresh={() => fetchQueueSessions({})} />
      )}
    </>
  );
}
