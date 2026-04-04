import { useEffect, useState } from 'react';
import { useReservations } from '@starcoex-frontend/reservations';
import { useStores } from '@starcoex-frontend/stores';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, RefreshCw, BanIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ScheduleBlockedDate } from '@starcoex-frontend/reservations';
import { BlockedDateCreateDialog } from '@/app/pages/dashboard/ecommerce/reservations/components/blocked-data-create-dialog';

export function BlockedDatesTab() {
  const {
    fetchReservableServices,
    fetchScheduleBlockedDates,
    deleteScheduleBlockedDate,
    bulkDeleteScheduleBlockedDates,
    isLoading,
  } = useReservations();
  const { stores, fetchStores } = useStores();

  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [blockedDates, setBlockedDates] = useState<ScheduleBlockedDate[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const loadServices = (storeId: number) => {
    fetchReservableServices({ storeId, isActive: true }).then((res) => {
      if (res.success && res.data?.services) setServices(res.data.services);
    });
  };

  useEffect(() => {
    if (!selectedStoreId) return;
    setSelectedServiceId(null);
    setServices([]);
    setBlockedDates([]);
    loadServices(selectedStoreId);
  }, [selectedStoreId]);

  const loadBlockedDates = (serviceId: number) => {
    fetchScheduleBlockedDates({ serviceId }).then((res) => {
      if (res.success && res.data?.blockedDates) {
        setBlockedDates(res.data.blockedDates);
      }
    });
  };

  useEffect(() => {
    if (!selectedServiceId) return;
    setSelectedIds([]);
    loadBlockedDates(selectedServiceId);
  }, [selectedServiceId]);

  const handleDelete = async (id: number, dateLabel: string) => {
    if (!window.confirm(`${dateLabel} 휴무일을 삭제하시겠습니까?`)) return;
    const res = await deleteScheduleBlockedDate(id);
    if (res.success) {
      toast.success('휴무일이 삭제되었습니다.');
      if (selectedServiceId) loadBlockedDates(selectedServiceId);
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (
      !window.confirm(
        `선택한 ${selectedIds.length}개 휴무일을 삭제하시겠습니까?`
      )
    )
      return;
    const res = await bulkDeleteScheduleBlockedDates(selectedIds);
    if (res.success) {
      toast.success('선택한 휴무일이 삭제되었습니다.');
      setSelectedIds([]);
      if (selectedServiceId) loadBlockedDates(selectedServiceId);
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDateLabel = (bd: ScheduleBlockedDate): string => {
    try {
      return format(parseISO(bd.date), 'yyyy.MM.dd (EEE)', { locale: ko });
    } catch {
      return bd.date;
    }
  };

  return (
    <div className="space-y-4">
      {/* 매장 / 서비스 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">서비스 선택</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Select
            value={selectedStoreId ? String(selectedStoreId) : ''}
            onValueChange={(v) => {
              setSelectedStoreId(Number(v));
              setSelectedServiceId(null);
            }}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="매장을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={String(store.id)}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedStoreId && (
            <Select
              value={selectedServiceId ? String(selectedServiceId) : ''}
              onValueChange={(v) => setSelectedServiceId(Number(v))}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="서비스를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* 휴무일 목록 */}
      {selectedServiceId && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              휴무일 목록
              {blockedDates.length > 0 && (
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  ({blockedDates.length}개)
                </span>
              )}
            </h2>
            <div className="flex gap-2">
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 size-4" />
                  선택 삭제 ({selectedIds.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadBlockedDates(selectedServiceId)}
              >
                <RefreshCw className="mr-2 size-4" />
                새로고침
              </Button>
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 size-4" />
                휴무일 추가
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-muted-foreground text-sm">
                불러오는 중...
              </span>
            </div>
          ) : blockedDates.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <BanIcon className="text-muted-foreground mx-auto mb-3 size-10" />
              <p className="text-muted-foreground text-sm">
                등록된 휴무일이 없습니다.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 size-4" />첫 휴무일 추가
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {blockedDates.map((bd) => {
                const dateLabel = formatDateLabel(bd);
                const isChecked = selectedIds.includes(bd.id);
                return (
                  <Card
                    key={bd.id}
                    className={
                      isChecked ? 'border-primary/50 bg-primary/5' : ''
                    }
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(bd.id)}
                          className="size-4 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <p className="font-medium">{dateLabel}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                bd.isFullDay ? 'destructive' : 'secondary'
                              }
                            >
                              {bd.isFullDay
                                ? '종일 휴무'
                                : `${bd.blockedStartTime} ~ ${bd.blockedEndTime}`}
                            </Badge>
                            {bd.reason && (
                              <span className="text-muted-foreground text-xs">
                                {bd.reason}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(bd.id, dateLabel)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {selectedServiceId && (
        <BlockedDateCreateDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          serviceId={selectedServiceId}
          onSuccess={() => loadBlockedDates(selectedServiceId)}
        />
      )}
    </div>
  );
}
