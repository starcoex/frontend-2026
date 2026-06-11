import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContacts } from '@starcoex-frontend/contact';
import { ChevronLeft, Loader2, Send, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  ContactCategoryBadge,
  ContactStatusBadge,
} from '../components/contact-status-badge';
import {
  NEXT_CONTACT_STATUS_MAP,
  CONTACT_CATEGORY_LABEL,
  type ContactStatusValue,
} from '../data/contact-data';
import { ContactStatusUpdateDialog } from '../components/contact-status-update-dialog';

export default function ContactsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentContact, isLoading, error, fetchContact, submitContactReply } =
    useContacts();
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    if (id) fetchContact(id);
  }, [id, fetchContact]);

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !id) return;
    setIsSending(true);
    try {
      const res = await submitContactReply({
        contactId: id,
        message: replyMessage.trim(),
        isInternal: false,
      });
      if (res.success) {
        toast.success('답변이 등록되었습니다.');
        setReplyMessage('');
        fetchContact(id);
      } else {
        toast.error(res.error?.message ?? '답변 등록에 실패했습니다.');
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            문의 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentContact) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '문의를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/contacts')}>
          문의 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const canChangeStatus =
    (NEXT_CONTACT_STATUS_MAP[currentContact.status as ContactStatusValue] ?? [])
      .length > 0;

  return (
    <>
      <PageHead
        title={`문의 #${currentContact.id} - ${COMPANY_INFO.name}`}
        description="문의 상세 정보"
        keywords={['문의 상세', `#${currentContact.id}`, COMPANY_INFO.name]}
        og={{
          title: `문의 #${currentContact.id} - ${COMPANY_INFO.name}`,
          description: '문의 상세 정보',
          image: '/images/og-contacts.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Button
                aria-label="뒤로가기"
                variant="outline"
                size="icon"
                onClick={() => navigate('/admin/contacts')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="font-display text-xl tracking-tight lg:text-2xl">
                문의 #{currentContact.id}
              </h1>
            </div>
            <div className="text-muted-foreground ml-12 flex flex-wrap gap-2 text-sm">
              <span>{currentContact.name}</span>
              <span>·</span>
              <span>
                {format(
                  new Date(currentContact.createdAt),
                  'yyyy년 MM월 dd일 HH:mm',
                  { locale: ko }
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canChangeStatus && (
              <Button
                variant="outline"
                onClick={() => setStatusDialogOpen(true)}
              >
                상태 변경
              </Button>
            )}
          </div>
        </div>

        {/* 상태 배지 */}
        <div className="flex flex-wrap gap-2">
          <ContactStatusBadge status={currentContact.status as any} />
          <ContactCategoryBadge category={currentContact.category as any} />
          <Badge variant="outline">
            {currentContact.contactUserType === 'MEMBER' ? '회원' : '비회원'}
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* 문의 내용 */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  문의 내용
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentContact.subject && (
                  <p className="font-semibold mb-2">{currentContact.subject}</p>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {currentContact.message}
                </p>
              </CardContent>
            </Card>

            {/* 답변 목록 */}
            {currentContact.replies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    답변 내역 ({currentContact.replies.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentContact.replies
                    .filter((r) => !r.isInternal)
                    .map((reply) => (
                      <div
                        key={reply.id}
                        className="rounded-lg border p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {reply.authorType === 'ADMIN' ? '관리자' : '고객'}
                            </Badge>
                            <span className="text-sm font-medium">
                              {reply.authorName}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(reply.createdAt), 'MM/dd HH:mm', {
                              locale: ko,
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {reply.message}
                        </p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* 답변 입력 */}
            <Card>
              <CardHeader>
                <CardTitle>답변 작성</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="고객에게 전달할 답변 내용을 입력하세요..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={5}
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() || isSending}
                >
                  {isSending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  답변 전송
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 문의자 정보 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  문의자 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold text-xs">
                          이름
                        </TableCell>
                        <TableCell className="text-xs">
                          {currentContact.name}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-xs">
                          이메일
                        </TableCell>
                        <TableCell className="text-xs">
                          {currentContact.email}
                        </TableCell>
                      </TableRow>
                      {currentContact.phone && (
                        <TableRow>
                          <TableCell className="font-semibold text-xs">
                            전화번호
                          </TableCell>
                          <TableCell className="text-xs">
                            {currentContact.phone}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-semibold text-xs">
                          카테고리
                        </TableCell>
                        <TableCell className="text-xs">
                          {CONTACT_CATEGORY_LABEL[currentContact.category] ??
                            currentContact.category}
                        </TableCell>
                      </TableRow>
                      {currentContact.sourceApp && (
                        <TableRow>
                          <TableCell className="font-semibold text-xs">
                            접속 앱
                          </TableCell>
                          <TableCell className="text-xs">
                            {currentContact.sourceApp}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* 관리자 메모 */}
            {currentContact.adminNote && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">관리자 메모</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {currentContact.adminNote}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ContactStatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        contact={currentContact}
        onSuccess={() => id && fetchContact(id)}
      />
    </>
  );
}
