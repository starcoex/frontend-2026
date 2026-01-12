import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { IconMailForward, IconTrash } from '@tabler/icons-react';
import { Row } from '@tanstack/react-table';
import { UserInvitation } from '@starcoex-frontend/graphql';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useUsersContext } from '@starcoex-frontend/auth';
import { toast } from 'sonner';

interface Props {
  row: Row<UserInvitation>;
}

export function InvitationRowActions({ row }: Props) {
  const { handleResendInvitation, handleCancelInvitation } = useUsersContext();
  const invitation = row.original;

  // ✅ 문자열 비교로 수정
  const canResend =
    invitation.status === 'PENDING' || invitation.status === 'EXPIRED';
  const canCancel = invitation.status === 'PENDING';

  const handleResend = async () => {
    try {
      const response = await handleResendInvitation(invitation.id);
      if (response.success) {
        toast.success(`초대가 ${invitation.email}로 재발송되었습니다.`);
      } else {
        toast.error(response.error?.message || '초대 재발송에 실패했습니다.');
      }
    } catch (error) {
      toast.error('초대 재발송 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = async () => {
    try {
      const response = await handleCancelInvitation(invitation.id);
      if (response.success) {
        toast.success(`${invitation.email}의 초대가 취소되었습니다.`);
      } else {
        toast.error(response.error?.message || '초대 취소에 실패했습니다.');
      }
    } catch (error) {
      toast.error('초대 취소 중 오류가 발생했습니다.');
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {canResend && (
          <DropdownMenuItem onClick={handleResend}>
            Resend Invitation
            <DropdownMenuShortcut>
              <IconMailForward size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {canResend && canCancel && <DropdownMenuSeparator />}
        {canCancel && (
          <DropdownMenuItem onClick={handleCancel} className="text-red-500!">
            Cancel Invitation
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {!canResend && !canCancel && (
          <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
