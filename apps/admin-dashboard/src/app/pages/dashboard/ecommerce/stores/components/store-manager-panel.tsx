import { useState } from 'react';
import { toast } from 'sonner';
import { UserPlus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common'; // ✅ add-order-form 패턴 동일
import { useStores } from '@starcoex-frontend/stores';
import type { Store, ManagerRole } from '@starcoex-frontend/stores';

const ROLE_LABELS: Record<ManagerRole, string> = {
  OWNER: '점주',
  MANAGER: '매니저',
  STAFF: '직원',
};

const ROLE_VARIANTS: Record<ManagerRole, 'default' | 'secondary' | 'outline'> =
  {
    OWNER: 'default',
    MANAGER: 'secondary',
    STAFF: 'outline',
  };

interface Props {
  store: Store;
}

export function StoreManagerPanel({ store }: Props) {
  const { addStoreManager, removeStoreManager } = useStores();

  // ✅ CustomerSearch 패턴 — 직접 userId 입력 대신 사용자 검색/선택
  const [selectedUser, setSelectedUser] = useState<SelectedCustomer | null>(
    null
  );
  const [role, setRole] = useState<ManagerRole>('STAFF');
  const [removingUserId, setRemovingUserId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSelectUser = (user: SelectedCustomer) => {
    setSelectedUser(user);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
  };

  const handleAdd = async () => {
    if (!selectedUser) {
      toast.error('관리자로 지정할 사용자를 선택하세요.');
      return;
    }

    // 이미 등록된 관리자인지 확인
    if (store.storeManagers.some((m) => m.userId === selectedUser.userId)) {
      toast.error('이미 이 매장의 관리자로 등록된 사용자입니다.');
      return;
    }

    setIsAdding(true);
    try {
      const res = await addStoreManager({
        storeId: store.id,
        userId: selectedUser.userId,
        role,
      });
      if (res.success) {
        toast.success(`${selectedUser.name}님이 관리자로 추가되었습니다.`);
        setSelectedUser(null);
        setRole('STAFF');
      } else {
        toast.error(res.error?.message ?? '관리자 추가에 실패했습니다.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (targetUserId: number) => {
    const res = await removeStoreManager({
      storeId: store.id,
      userId: targetUserId,
    });
    if (res.success) {
      toast.success('관리자가 삭제되었습니다.');
    } else {
      toast.error(res.error?.message ?? '관리자 삭제에 실패했습니다.');
    }
    setRemovingUserId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>매장 관리자</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 현재 관리자 목록 */}
        {store.storeManagers.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            등록된 관리자가 없습니다.
          </p>
        ) : (
          <div className="divide-y rounded-md border">
            {store.storeManagers.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={ROLE_VARIANTS[m.role]} className="text-xs">
                    {ROLE_LABELS[m.role]}
                  </Badge>
                  <span className="text-sm font-medium">User #{m.userId}</span>
                  {!m.isActive && (
                    <span className="text-muted-foreground text-xs">
                      (비활성)
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive h-7 w-7"
                  onClick={() => setRemovingUserId(m.userId)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* ✅ 관리자 추가 — CustomerSearch 패턴 */}
        <div className="space-y-3">
          <p className="text-xs font-medium">관리자 추가</p>

          {/* 사용자 검색 */}
          <CustomerSearch
            selected={selectedUser}
            onSelect={handleSelectUser}
            onClear={handleClearUser}
            enableCreate={false} // 신규 사용자 생성 불필요
          />

          {/* 역할 선택 + 추가 버튼 */}
          {selectedUser && (
            <div className="flex gap-2">
              <Select
                value={role}
                onValueChange={(v) => setRole(v as ManagerRole)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(Object.keys(ROLE_LABELS) as ManagerRole[]).map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="sm"
                onClick={handleAdd}
                disabled={isAdding}
              >
                <UserPlus className="mr-1.5 h-4 w-4" />
                추가
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={removingUserId !== null}
        onOpenChange={(v) => !v && setRemovingUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>관리자 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              User #{removingUserId}을(를) 이 매장의 관리자에서 제거합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                removingUserId !== null && handleRemove(removingUserId)
              }
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
