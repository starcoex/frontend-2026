import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MessageCircle, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useContacts } from '@starcoex-frontend/contact';

const CONTACT_STATUS_LABEL: Record<string, { label: string; variant: string }> =
  {
    PENDING: { label: '접수 대기', variant: 'secondary' },
    IN_PROGRESS: { label: '처리 중', variant: 'warning' },
    RESOLVED: { label: '처리 완료', variant: 'success' },
    CLOSED: { label: '종료', variant: 'outline' },
  };

export const MyContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // fetchContact(contactId: string) 사용
  const { fetchContact, currentContact, isLoading } = useContacts();

  useEffect(() => {
    if (id) fetchContact(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !currentContact) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statusConfig = CONTACT_STATUS_LABEL[currentContact.status] ?? {
    label: currentContact.status,
    variant: 'outline',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">문의 상세</h1>
      </div>

      {/* 문의 내용 카드 */}
      <div className="rounded-2xl border bg-card p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="font-semibold text-base leading-snug">
              {currentContact.subject ?? '(제목 없음)'}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(currentContact.createdAt), 'yyyy.MM.dd HH:mm', {
                locale: ko,
              })}
            </p>
          </div>
          <Badge variant={statusConfig.variant as any} className="shrink-0">
            {statusConfig.label}
          </Badge>
        </div>
        <Separator />
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
          {currentContact.message}
        </p>
      </div>

      {/* 답변 목록 */}
      {currentContact.replies && currentContact.replies.length > 0 ? (
        <div className="space-y-3">
          {currentContact.replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-2xl border bg-muted/40 p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">관리자 답변</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {format(new Date(reply.createdAt), 'yyyy.MM.dd HH:mm', {
                    locale: ko,
                  })}
                </span>
              </div>
              <Separator />
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {reply.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-card p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <MessageCircle className="w-8 h-8 opacity-30" />
          <p className="text-sm">아직 답변이 등록되지 않았습니다.</p>
          <p className="text-xs">순차적으로 답변 드리겠습니다.</p>
        </div>
      )}
    </div>
  );
};
