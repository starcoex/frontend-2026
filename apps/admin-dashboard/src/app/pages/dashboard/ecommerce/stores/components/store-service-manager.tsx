import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
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
import { useStores } from '@starcoex-frontend/stores';
import type { Store } from '@starcoex-frontend/stores';

interface Props {
  store: Store;
}

export function StoreServiceManager({ store }: Props) {
  const { addStoreService, removeStoreService } = useStores();
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState('');
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // 이 매장의 businessType에서 허용 서비스 목록
  const allowedServices = store.businessType?.allowedServices ?? [];

  // 이미 등록된 serviceTypeId 목록
  const registeredIds = new Set(
    store.storeServices.map((ss) => ss.serviceTypeId)
  );

  // 추가 가능한 서비스 (허용 서비스 중 미등록)
  const availableServices = allowedServices.filter(
    (s) => !registeredIds.has(s.id)
  );

  const handleAdd = async () => {
    if (!selectedServiceTypeId) return;
    setIsAdding(true);
    try {
      const res = await addStoreService({
        storeId: store.id,
        serviceTypeId: parseInt(selectedServiceTypeId),
      });
      if (res.success) {
        toast.success('서비스가 추가되었습니다.');
        setSelectedServiceTypeId('');
      } else {
        toast.error(res.error?.message ?? '서비스 추가에 실패했습니다.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (serviceTypeId: number) => {
    const res = await removeStoreService({
      storeId: store.id,
      serviceTypeId,
    });
    if (res.success) {
      toast.success('서비스가 삭제되었습니다.');
    } else {
      toast.error(res.error?.message ?? '서비스 삭제에 실패했습니다.');
    }
    setRemovingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>운영 서비스</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 현재 운영 서비스 목록 */}
        {store.storeServices.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            등록된 서비스가 없습니다.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {store.storeServices.map((ss) => (
              <div key={ss.id} className="flex items-center gap-1">
                <Badge
                  variant={ss.isActive ? 'default' : 'secondary'}
                  className="pr-1"
                >
                  {ss.serviceType?.name ?? String(ss.serviceTypeId)}
                  <button
                    type="button"
                    onClick={() => setRemovingId(ss.serviceTypeId)}
                    className="ml-1.5 rounded-full p-0.5 hover:bg-black/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* 서비스 추가 */}
        {availableServices.length > 0 && (
          <div className="flex gap-2">
            <Select
              value={selectedServiceTypeId}
              onValueChange={setSelectedServiceTypeId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="추가할 서비스 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableServices.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={!selectedServiceTypeId || isAdding}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              추가
            </Button>
          </div>
        )}

        {availableServices.length === 0 && allowedServices.length > 0 && (
          <p className="text-muted-foreground text-xs">
            허용된 모든 서비스가 등록되었습니다.
          </p>
        )}

        {allowedServices.length === 0 && (
          <p className="text-muted-foreground text-xs">
            이 비즈니스 타입에 허용된 서비스가 없습니다.
          </p>
        )}
      </CardContent>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={removingId !== null}
        onOpenChange={(v) => !v && setRemovingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>서비스 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 서비스를 매장에서 제거합니다. 계속하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => removingId !== null && handleRemove(removingId)}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
