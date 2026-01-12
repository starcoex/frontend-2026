import { useUsersContext } from '@starcoex-frontend/auth';
import { InvitationsTable } from '@/app/pages/dashboard/users/components/invitations-table';
import { columns } from '@/app/pages/dashboard/users/components/invitations-columns';

export function InvitationsPage() {
  const { invitations, invitationsLoading, invitationsError } =
    useUsersContext();

  if (invitationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">초대 목록 로딩 중...</div>
      </div>
    );
  }

  if (invitationsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">
          오류가 발생했습니다: {invitationsError}
        </div>
      </div>
    );
  }

  return <InvitationsTable data={invitations} columns={columns} />;
}
