import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Building2, CheckCircle2, Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { StoreStatsOutput } from '@starcoex-frontend/stores';
import { ExportButton, useDetailDrawer } from '@starcoex-frontend/common';

interface Store {
  id: number;
  name?: string;
  isActive: boolean;
  isVisible: boolean;
}

interface Props {
  stores: Store[];
  statistics: StoreStatsOutput | null;
  isLoading: boolean;
}

const EXPORT_COLUMNS = [
  { header: '매장명', key: 'name' },
  { header: '활성여부', key: 'isActiveLabel' },
  { header: '노출여부', key: 'isVisibleLabel' },
];

// ─── 상세 드로어 ──────────────────────────────────────────────────────────────
function StoreDetailDrawer({
  open,
  onOpenChange,
  store,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  store: Store | null;
}) {
  const navigate = useNavigate();
  if (!store) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>{store.name ?? `매장 #${store.id}`}</SheetTitle>
          <SheetDescription>매장 상세 정보</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">매장 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">매장 ID</dt>
                <dd className="font-medium">#{store.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">활성 상태</dt>
                <dd>
                  <Badge variant={store.isActive ? 'default' : 'secondary'}>
                    {store.isActive ? '활성' : '비활성'}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">노출 상태</dt>
                <dd>
                  <Badge variant={store.isVisible ? 'default' : 'secondary'}>
                    {store.isVisible ? '노출' : '숨김'}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SheetFooter className="flex-col gap-2 px-4 sm:px-6">
          <Button
            className="w-full"
            onClick={() => navigate(`/admin/stores/${store.id}`)}
          >
            상세 페이지로 이동
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/admin/stores/${store.id}/edit`)}
          >
            수정
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" className="w-full">
              닫기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function OverviewStoreStats({ stores, statistics, isLoading }: Props) {
  const navigate = useNavigate();
  const { selected, open, setOpen, openDrawer } = useDetailDrawer<Store>();

  const total = statistics?.current?.totalStores ?? stores.length;
  const active =
    statistics?.current?.activeStores ??
    stores.filter((s) => s.isActive).length;
  const visible = stores.filter((s) => s.isVisible).length;

  const summaryItems = [
    {
      label: '전체 매장',
      value: total,
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      label: '활성 매장',
      value: active,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    { label: '노출 매장', value: visible, icon: Eye, color: 'text-violet-500' },
  ];

  const exportData = stores.map((s) => ({
    name: s.name ?? `#${s.id}`,
    isActiveLabel: s.isActive ? '활성' : '비활성',
    isVisibleLabel: s.isVisible ? '노출' : '숨김',
  }));

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>매장 현황</CardTitle>
              <CardDescription>전체 매장 운영 현황</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <ExportButton
                data={exportData}
                columns={EXPORT_COLUMNS}
                fileName="stores"
                pdfTitle="매장 현황"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => navigate('/admin/stores')}
              >
                전체보기
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 요약 수치 */}
          <div className="space-y-2">
            {summaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    <span className="font-bold">
                      {(item.value ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 최근 매장 목록 */}
          {!isLoading && stores.length > 0 && (
            <div className="space-y-2">
              <Separator />
              {stores.slice(0, 3).map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="text-sm font-medium">
                    {store.name ?? `매장 #${store.id}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={store.isActive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {store.isActive ? '활성' : '비활성'}
                    </Badge>
                    {/* ⋮ 메뉴 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDrawer(store)}>
                          상세보기
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/admin/stores/${store.id}/edit`)
                          }
                        >
                          수정
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <StoreDetailDrawer open={open} onOpenChange={setOpen} store={selected} />
    </>
  );
}
