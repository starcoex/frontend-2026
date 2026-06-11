import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useContacts } from '@starcoex-frontend/contact';
import { ContactTable } from './components/contact-table';

export default function ContactsPage() {
  const { contacts, isLoading, error, fetchAdminContacts } = useContacts();

  useEffect(() => {
    fetchAdminContacts();
  }, [fetchAdminContacts]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            문의 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title={`문의 관리 - ${COMPANY_INFO.name}`}
        description="고객 문의 목록을 관리하고 상태를 변경하세요."
        keywords={['문의 관리', '고객 문의', COMPANY_INFO.name]}
        og={{
          title: `문의 관리 - ${COMPANY_INFO.name}`,
          description: '고객 문의 목록 조회 및 처리 시스템',
          image: '/images/og-contacts.jpg',
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
              onClick={() => fetchAdminContacts()}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && (
        <ContactTable data={contacts} onRefresh={fetchAdminContacts} />
      )}
    </>
  );
}
