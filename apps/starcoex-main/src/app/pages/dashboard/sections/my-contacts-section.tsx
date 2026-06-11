import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Contact } from '@starcoex-frontend/contact';

const CONTACT_STATUS_LABEL: Record<string, { label: string; variant: string }> =
  {
    PENDING: { label: '접수 대기', variant: 'secondary' },
    IN_PROGRESS: { label: '처리 중', variant: 'warning' },
    RESOLVED: { label: '처리 완료', variant: 'success' },
    CLOSED: { label: '종료', variant: 'outline' },
  };

interface MyContactsSectionProps {
  contacts: Contact[];
}

export const MyContactsSection: React.FC<MyContactsSectionProps> = ({
  contacts,
}) => {
  const navigate = useNavigate();
  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">내 문의 내역</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground h-8"
          onClick={() => navigate('/my-contacts')}
        >
          전체 보기 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {recentContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
            <MessageCircle className="w-8 h-8 opacity-30" />
            <p className="text-sm">문의 내역이 없습니다.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/contact')}
              className="mt-1"
            >
              문의하기
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {recentContacts.map((contact) => {
              const statusConfig = CONTACT_STATUS_LABEL[contact.status] ?? {
                label: contact.status,
                variant: 'outline',
              };
              return (
                <button
                  key={contact.id}
                  onClick={() => navigate(`/my-contacts/${contact.id}`)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {contact.subject ?? contact.message.slice(0, 30) + '...'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(contact.createdAt), 'MM월 dd일 HH:mm', {
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
    </div>
  );
};
