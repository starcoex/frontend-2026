import { useEffect } from 'react';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  useNotifications,
  EmailStatus,
} from '@starcoex-frontend/notifications';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const EMAIL_STATUS_CONFIG: Record<
  EmailStatus,
  {
    label: string;
    variant:
      | 'default'
      | 'secondary'
      | 'outline'
      | 'destructive'
      | 'success'
      | 'warning';
  }
> = {
  [EmailStatus.PENDING]: { label: '대기', variant: 'warning' },
  [EmailStatus.SENDING]: { label: '발송 중', variant: 'default' },
  [EmailStatus.SENT]: { label: '발송 완료', variant: 'success' },
  [EmailStatus.FAILED]: { label: '실패', variant: 'destructive' },
  [EmailStatus.CANCELLED]: { label: '취소', variant: 'secondary' },
};

export default function EmailsPage() {
  const { emails, isLoading, error, fetchEmails } = useNotifications();

  useEffect(() => {
    fetchEmails({ page: 1, limit: 50, sortBy: 'createdAt', sortOrder: 'desc' });
  }, [fetchEmails]);

  if (isLoading) {
    return <LoadingSpinner message="이메일 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`이메일 관리 - ${COMPANY_INFO.name}`}
        description="발송된 이메일 목록을 관리합니다."
        keywords={['이메일 관리', COMPANY_INFO.name]}
        og={{
          title: `이메일 관리 - ${COMPANY_INFO.name}`,
          description: '이메일 발송 내역 조회',
          image: '/images/og-components.jpg',
          type: 'website',
        }}
      />

      {error && (
        <ErrorAlert
          error={error}
          onRetry={() =>
            fetchEmails({
              page: 1,
              limit: 50,
              sortBy: 'createdAt',
              sortOrder: 'desc',
            })
          }
        />
      )}

      {!error && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>수신자</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>우선순위</TableHead>
                <TableHead>발송일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.length ? (
                emails.map((email) => {
                  const statusConfig = EMAIL_STATUS_CONFIG[email.status];
                  return (
                    <TableRow key={email.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {email.toName ?? '-'}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {email.toEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[240px] truncate text-sm">
                          {email.subject}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-xs">
                          {email.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-xs">
                          {format(new Date(email.createdAt), 'MM/dd HH:mm', {
                            locale: ko,
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-24 text-center"
                  >
                    발송된 이메일이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
