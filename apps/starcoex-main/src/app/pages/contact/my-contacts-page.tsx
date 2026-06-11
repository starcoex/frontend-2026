import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export const MyContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const { contacts, fetchMyContacts, isLoading } = useContacts();

  useEffect(() => {
    fetchMyContacts(50, 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">내 문의 내역</h1>
        </div>
        <Button size="sm" onClick={() => navigate('/contact')}>
          <Plus className="w-4 h-4 mr-1" />
          문의하기
        </Button>
      </div>

      {/* 목록 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <MessageCircle className="w-10 h-10 opacity-30" />
          <p className="text-sm">문의 내역이 없습니다.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/contact')}
          >
            문의하기
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden divide-y">
          {contacts.map((contact) => {
            const statusConfig = CONTACT_STATUS_LABEL[contact.status] ?? {
              label: contact.status,
              variant: 'outline',
            };
            return (
              <button
                key={contact.id}
                onClick={() => navigate(`/my-contacts/${contact.id}`)}
                className="w-full flex items-center justify-between gap-4 px-4 py-4 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm font-medium truncate">
                    {contact.subject ?? contact.message.slice(0, 40) + '...'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(contact.createdAt), 'yyyy.MM.dd HH:mm', {
                      locale: ko,
                    })}
                  </p>
                </div>
                <Badge
                  variant={statusConfig.variant as any}
                  className="text-xs shrink-0"
                >
                  {statusConfig.label}
                </Badge>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
