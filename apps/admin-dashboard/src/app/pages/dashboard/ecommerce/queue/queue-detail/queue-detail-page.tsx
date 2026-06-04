import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2, Pencil, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useQueue } from '@starcoex-frontend/queue';
import { QueueSessionStatus } from '@starcoex-frontend/queue';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { QueueStatusBadge } from '../components/queue-status-badge';
import { QueueStatusUpdateDialog } from '../components/queue-status-update-dialog';
import type { QueueStatusValue } from '@/app/pages/dashboard/ecommerce/queue/data/queue-data';

const canChangeStatus = (status: QueueSessionStatus): boolean =>
  [
    QueueSessionStatus.WAITING,
    QueueSessionStatus.CALLED,
    QueueSessionStatus.IN_SERVICE,
  ].includes(status);

export default function QueueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSession, isLoading, error } = useQueue();
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {}, [id]);

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
        title={`대기 티켓 ${currentSession.ticketNumber} - ${COMPANY_INFO.name}`}
        description="대기열 세션 상세 정보"
        keywords={[
          '대기열 상세',
          currentSession.ticketNumber,
          COMPANY_INFO.name,
        ]}
        og={{
          title: `대기 티켓 ${currentSession.ticketNumber} - ${COMPANY_INFO.name}`,
          description: '대기열 세션 상세 정보',
          image: '/images/og-queue.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              aria-label="뒤로가기"
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin/queue')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-display text-xl tracking-tight lg:text-2xl">
                티켓 #{currentSession.ticketNumber}
              </h1>
              <p className="text-muted-foreground text-sm">
                지점 #{currentSession.storeId} · 순번 {currentSession.position}
              </p>
            </div>
          </div>

          {/* ✅ 헤더 액션 버튼 */}
          <div className="flex items-center gap-2">
            {canChangeStatus(currentSession.status) && (
              <Button variant="outline" onClick={() => setStatusOpen(true)}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                상태 변경
              </Button>
            )}
            {!currentSession.userId && (
              <Button
                onClick={() =>
                  navigate(`/admin/queue/${currentSession.id}/edit`)
                }
              >
                <Pencil className="mr-1.5 h-4 w-4" />
                고객 정보 수정
              </Button>
            )}
          </div>
        </div>

        {/* 상태 배지 */}
        <QueueStatusBadge status={currentSession.status as QueueStatusValue} />

        {/* 상세 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>세션 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">티켓 번호</TableCell>
                    <TableCell className="font-mono">
                      {currentSession.ticketNumber}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">
                      Redis 티켓 ID
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {currentSession.redisTicketId}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">지점 ID</TableCell>
                    <TableCell>#{currentSession.storeId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">서비스 ID</TableCell>
                    <TableCell>#{currentSession.serviceId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">순번</TableCell>
                    <TableCell>{currentSession.position}</TableCell>
                  </TableRow>
                  {/* ✅ 고객 정보 */}
                  {currentSession.userId ? (
                    <TableRow>
                      <TableCell className="font-semibold">회원 ID</TableCell>
                      <TableCell>#{currentSession.userId}</TableCell>
                    </TableRow>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell className="font-semibold">
                          고객 이름
                        </TableCell>
                        <TableCell>{currentSession.guestName ?? '-'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          전화번호
                        </TableCell>
                        <TableCell>
                          {currentSession.guestPhone ?? '-'}
                        </TableCell>
                      </TableRow>
                      {currentSession.guestVehicleNumber && (
                        <TableRow>
                          <TableCell className="font-semibold">
                            차량번호
                          </TableCell>
                          <TableCell className="font-mono">
                            {currentSession.guestVehicleNumber}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                  <TableRow>
                    <TableCell className="font-semibold">예상 입장</TableCell>
                    <TableCell>
                      {format(
                        new Date(currentSession.estimatedEntryAt),
                        'yyyy년 MM월 dd일 HH:mm',
                        { locale: ko }
                      )}
                    </TableCell>
                  </TableRow>
                  {currentSession.actualEntryAt && (
                    <TableRow>
                      <TableCell className="font-semibold">실제 입장</TableCell>
                      <TableCell>
                        {format(
                          new Date(currentSession.actualEntryAt),
                          'yyyy년 MM월 dd일 HH:mm',
                          { locale: ko }
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                  {currentSession.completedAt && (
                    <TableRow>
                      <TableCell className="font-semibold">완료 시각</TableCell>
                      <TableCell>
                        {format(
                          new Date(currentSession.completedAt),
                          'yyyy년 MM월 dd일 HH:mm',
                          { locale: ko }
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                  {currentSession.durationSec != null && (
                    <TableRow>
                      <TableCell className="font-semibold">소요 시간</TableCell>
                      <TableCell>
                        {Math.round(currentSession.durationSec / 60)}분
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-semibold">접수 시각</TableCell>
                    <TableCell>
                      {format(
                        new Date(currentSession.createdAt),
                        'yyyy년 MM월 dd일 HH:mm',
                        { locale: ko }
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ 상태 변경 다이얼로그 */}
      <QueueStatusUpdateDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        session={currentSession}
        onSuccess={() => navigate('/admin/queue')}
      />
    </>
  );
}
