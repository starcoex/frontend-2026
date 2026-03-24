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
import {
  Loader2,
  Calendar,
  Clock,
  Settings2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceCard } from './service-card';
import { ServiceTemplateDialog } from './service-template-dialog';
import { ServiceGenerateSlotsDialog } from './service-generate-slots-dialog';
import { ServiceCreateDialog } from '@/app/pages/dashboard/ecommerce/reservations/services/create/service-create-dialog';
import { ServiceEditDialog } from '@/app/pages/dashboard/ecommerce/reservations/services/edit/service-edit-dialog';

export function ServiceManagementTab() {
  const {
    fetchReservableServices,
    fetchScheduleTemplates,
    deleteReservableService,
    isLoading,
  } = useReservations();
  const { stores, fetchStores } = useStores();

  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const [templates, setTemplates] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [slotsOpen, setSlotsOpen] = useState(false);

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
    loadServices(selectedStoreId);
  }, [selectedStoreId]);

  const loadTemplates = (serviceId: number) => {
    fetchScheduleTemplates(serviceId).then((res) => {
      if (res.success && res.data) setTemplates(res.data);
    });
  };

  useEffect(() => {
    if (!selectedServiceId) return;
    loadTemplates(selectedServiceId);
  }, [selectedServiceId]);

  const handleDelete = async (serviceId: number, serviceName: string) => {
    if (!window.confirm(`"${serviceName}" 서비스를 삭제하시겠습니까?`)) return;
    const res = await deleteReservableService(serviceId);
    if (res.success) {
      toast.success('서비스가 삭제되었습니다.');
      if (selectedServiceId === serviceId) setSelectedServiceId(null);
      if (selectedStoreId) loadServices(selectedStoreId);
    } else {
      toast.error(res.error?.message ?? '삭제에 실패했습니다.');
    }
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div className="space-y-6">
      {/* 매장 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">매장 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedStoreId ? String(selectedStoreId) : ''}
            onValueChange={(v) => {
              setSelectedStoreId(Number(v));
              setSelectedServiceId(null);
            }}
          >
            <SelectTrigger className="w-full max-w-sm">
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
        </CardContent>
      </Card>

      {/* 서비스 목록 */}
      {selectedStoreId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">서비스 목록</h2>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 size-4" />
              서비스 추가
            </Button>
          </div>

          {isLoading && services.length === 0 ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-muted-foreground text-sm">
                불러오는 중...
              </span>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-muted-foreground text-sm">
                해당 매장에 등록된 서비스가 없습니다.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 size-4" />첫 서비스 추가
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedServiceId === service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  onEdit={() => setEditingService(service)}
                  onDelete={() => handleDelete(service.id, service.name)}
                  onSettings={() => setSelectedServiceId(service.id)} // ← 추가: 카드 선택과 동일
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 선택된 서비스 운영 설정 */}
      {selectedService && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">
              <span className="text-primary">{selectedService.name}</span> 운영
              설정
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTemplateOpen(true)}
              >
                <Clock className="mr-2 size-4" />
                템플릿 생성
              </Button>
              <Button
                size="sm"
                onClick={() => setSlotsOpen(true)}
                disabled={templates.filter((t) => t.isActive).length === 0}
              >
                <Calendar className="mr-2 size-4" />
                슬롯 생성
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Settings2 className="size-4 opacity-60" />
                  운영 템플릿
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => loadTemplates(selectedServiceId!)}
                >
                  <RefreshCw className="size-3.5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    불러오는 중...
                  </span>
                </div>
              ) : templates.length === 0 ? (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    등록된 템플릿이 없습니다.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    ⚠️ 슬롯 생성 전에 운영 템플릿을 먼저 만들어야 합니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className="flex items-center justify-between rounded-md border px-4 py-3"
                    >
                      <div className="space-y-0.5">
                        <p className="font-medium">{tmpl.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {tmpl.openTime} ~ {tmpl.closeTime}
                          {tmpl.slotDuration &&
                            ` / ${tmpl.slotDuration}분 단위`}
                          {' / '}동시 예약 {tmpl.maxConcurrentBookings}건
                        </p>
                        <p className="text-muted-foreground text-xs">
                          적용 요일:{' '}
                          {['일', '월', '화', '수', '목', '금', '토']
                            .filter((_, i) => tmpl.applicableDays?.includes(i))
                            .join(', ')}
                        </p>
                      </div>
                      <Badge variant={tmpl.isActive ? 'default' : 'secondary'}>
                        {tmpl.isActive ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  ))}
                  {templates.filter((t) => t.isActive).length === 0 && (
                    <p className="text-muted-foreground text-xs">
                      ⚠️ 활성화된 템플릿이 없습니다. 슬롯 생성이 불가합니다.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 다이얼로그 */}
      <ServiceCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        storeId={selectedStoreId ?? 0}
        onSuccess={() => selectedStoreId && loadServices(selectedStoreId)}
      />
      <ServiceEditDialog
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        service={editingService}
        onSuccess={() => selectedStoreId && loadServices(selectedStoreId)}
      />
      <ServiceTemplateDialog
        open={templateOpen}
        onOpenChange={setTemplateOpen}
        serviceId={selectedServiceId}
        onSuccess={() => selectedServiceId && loadTemplates(selectedServiceId)}
      />
      <ServiceGenerateSlotsDialog
        open={slotsOpen}
        onOpenChange={setSlotsOpen}
        serviceId={selectedServiceId}
      />
    </div>
  );
}
