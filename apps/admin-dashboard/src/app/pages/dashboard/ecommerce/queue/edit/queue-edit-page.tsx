import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueue } from '@starcoex-frontend/queue';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import EditQueueForm from './edit-queue-form';

export default function QueueEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSession, isLoading, error, fetchQueueSessions } = useQueue();

  useEffect(() => {
    // 단건 조회 — getQueueSession 추가 시 교체
    if (id) fetchQueueSessions({ limit: 1, offset: 0 });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            대기열 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentSession) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '대기열 세션을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/queue')}>
          대기열 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`티켓 ${currentSession.ticketNumber} 수정 - ${COMPANY_INFO.name}`}
        description="대기열 세션 정보를 수정하세요."
        keywords={[
          '대기열 수정',
          currentSession.ticketNumber,
          COMPANY_INFO.name,
        ]}
        og={{
          title: `티켓 ${currentSession.ticketNumber} 수정 - ${COMPANY_INFO.name}`,
          description: '대기열 세션 정보를 수정하세요.',
          image: '/images/og-queue.jpg',
          type: 'website',
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-lg)">
        <EditQueueForm session={currentSession} />
      </div>
    </>
  );
}
