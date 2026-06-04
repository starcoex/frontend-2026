import { useState } from 'react';
import { MoreHorizontal, Eye, Pencil, RefreshCw, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { QueueSession } from '@starcoex-frontend/queue';
import { QueueSessionStatus } from '@starcoex-frontend/queue';
import { QueueStatusUpdateDialog } from './queue-status-update-dialog';

const canChangeStatus = (status: QueueSessionStatus): boolean =>
  [
    QueueSessionStatus.WAITING,
    QueueSessionStatus.CALLED,
    QueueSessionStatus.IN_SERVICE,
  ].includes(status);

interface QueueRowActionsProps {
  session: QueueSession;
  onRefresh?: () => void; // ✅ 상태 변경 후 목록 재조회
}

export function QueueRowActions({ session, onRefresh }: QueueRowActionsProps) {
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState(false);

  const handleCopyTicketNumber = () => {
    navigator.clipboard.writeText(session.ticketNumber);
    toast.success('티켓 번호가 복사되었습니다.');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/queue/${session.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          {/* ✅ 비회원 세션만 수정 가능 */}
          {!session.userId && (
            <DropdownMenuItem
              onSelect={() => navigate(`/admin/queue/${session.id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              고객 정보 수정
            </DropdownMenuItem>
          )}
          {/* ✅ 상태 변경 가능한 세션만 표시 */}
          {canChangeStatus(session.status) && (
            <DropdownMenuItem onSelect={() => setStatusOpen(true)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              상태 변경
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={handleCopyTicketNumber}>
            <Copy className="mr-2 h-4 w-4" />
            티켓 번호 복사
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ✅ 상태 변경 다이얼로그 — onRefresh로 목록 재조회 */}
      <QueueStatusUpdateDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        session={session}
        onSuccess={() => {
          onRefresh?.();
        }}
      />
    </>
  );
}
