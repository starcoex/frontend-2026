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
          계정 비활성화
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            <span className="font-bold">{currentRow.email}</span> 계정을 정말로
            비활성화하시겠습니까?
            <br />
            <span className="font-bold">
              {currentRow.role?.toUpperCase()}
            </span>{' '}
            권한을 가진 이 사용자가 시스템에서 제거됩니다. 신중하게
            진행해주세요.
          </p>

          <Label className="my-2">
            확인을 위해 이메일을 입력하세요:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="이메일을 입력하여 비활성화를 확인하세요."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              이 작업은 되돌릴 수 없습니다. 신중하게 진행해주세요.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="비활성화"
      destructive
    />
  );
}
