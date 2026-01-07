import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { User } from '@starcoex-frontend/graphql'; // ✅ GraphQL 타입 사용
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@starcoex-frontend/auth'; // ✅ useAuth만 사용
import { userToasts } from '@/components/ui/toast.helpers';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
  onSuccess?: () => void; // ✅ 추가
}

export function UsersDeactivateDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: Props) {
  const [value, setValue] = useState('');
  const { deleteUserByAdmin } = useAuth(); // ✅ useAuth에서 직접 가져오기

  const handleDeactivate = async () => {
    if (value.trim() !== currentRow.email) return;

    try {
      // ✅ 실제 GraphQL mutation 호출
      const response = await deleteUserByAdmin(Number(currentRow.id));

      if (response.success) {
        userToasts.deactivate(currentRow);
        setValue('');
        onOpenChange(false);
        onSuccess?.(); // ✅ 성공 콜백 호출
      }
    } catch (error) {
      console.error('User deactivation failed:', error);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDeactivate}
      disabled={value.trim() !== currentRow.email}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          Deactivate
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to deactivate the account with the email{' '}
            <span className="font-bold">{currentRow.email}</span>?
            <br />
            This action will remove the user with the role of{' '}
            <span className="font-bold">
              {currentRow.role?.toUpperCase()}
            </span>{' '}
            from the system. Please proceed with caution.
          </p>

          <Label className="my-2">
            Email:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter the email to confirm deactivation."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Deactivate"
      destructive
    />
  );
}
