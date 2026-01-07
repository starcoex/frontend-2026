import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { toasts } from '@/components/ui/toast.helpers';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DeleteActions() {
  const [opened, setOpened] = useState(false);

  const [value, setValue] = useState('');
  const [type, setType] = useState<'delete' | 'deactivate'>('delete');

  const handleDeactivate = () => {
    setOpened(false);

    if (type === 'delete') {
      // ✅ 일반 성공 토스트 사용
      toasts.action.success(
        '사용자 삭제 완료',
        '사용자가 시스템에서 성공적으로 삭제되었습니다.',
        { action: type, timestamp: new Date() },
        {
          action: {
            label: '실행 취소',
            onClick: () => console.log('삭제 실행 취소'),
          },
        }
      );
    } else {
      // ✅ 비활성화 토스트
      toasts.action.success(
        '계정 비활성화 완료',
        '사용자 계정이 성공적으로 비활성화되었습니다.',
        { action: type, timestamp: new Date() }
      );
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpened(true);
          setType('deactivate');
        }}
        variant="outline"
        type="button"
        className="text-red-500"
      >
        Deactivate Account
      </Button>

      <Button
        onClick={() => {
          setOpened(true);
          setType('delete');
        }}
        type="button"
        variant="destructive"
      >
        Delete Account
      </Button>

      <ConfirmDialog
        open={opened}
        onOpenChange={() => setOpened((prev) => !prev)}
        handleConfirm={handleDeactivate}
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
              Are you sure you want to {type} the account
              <br />
              {type === 'delete' &&
                'This action will remove the user with the role from the system. Please proceed with caution.'}
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
                Please be carefull, this operation can not be rolled back.
              </AlertDescription>
            </Alert>
          </div>
        }
        confirmText={<p className="capitalize">{type}</p>}
        destructive
      />
    </>
  );
}
