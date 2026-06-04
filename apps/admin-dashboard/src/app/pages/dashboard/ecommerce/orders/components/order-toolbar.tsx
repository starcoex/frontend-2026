import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order, useOrders } from '@starcoex-frontend/orders';
import {
  ORDER_FULFILLMENT_OPTIONS,
  ORDER_PAYMENT_STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS,
  ORDER_TAB_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/orders/data/order-data';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface OrderToolbarProps {
  table: Table<Order>;
  onRefresh?: () => void;
}

export function OrderToolbar({ table, onRefresh }: OrderToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteOrders } = useOrders();

  const handleDeleteSuccess = async () => {
    table.resetRowSelection(); // ← 체크박스 선택 초기화
    onRefresh?.(); // ← 서버에서 최신 목록 재조회
  };

  return (
    <div className="space-y-3">
      {/* ── 탭 필터: 모바일 가로 스크롤 ── */}
      <div className="w-full overflow-x-auto scrollbar-none -mx-1 px-1">
        <Tabs
          defaultValue="all"
          onValueChange={(v) =>
            table
              .getColumn('status')
              ?.setFilterValue(v === 'all' ? undefined : [v])
          }
        >
          <TabsList className="w-max min-w-full sm:w-auto">
            {ORDER_TAB_OPTIONS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── 검색 + 필터 행 ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {/* 검색창: 모바일 전체 너비 */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Label htmlFor="order-search" className="sr-only">
            주문번호 검색
          </Label>
          <Input
            id="order-search"
            placeholder="주문번호 검색..."
            aria-label="주문번호 검색"
            value={
              (table.getColumn('orderNumber')?.getFilterValue() as string) ?? ''
            }
            onChange={(e) =>
              table.getColumn('orderNumber')?.setFilterValue(e.target.value)
            }
            className="h-8 pl-8 w-full sm:w-[200px] lg:w-[280px]"
          />
        </div>

        {/* 필터 버튼들: 모바일 가로 스크롤 */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="주문 상태"
            options={ORDER_STATUS_OPTIONS}
          />
          <DataTableFacetedFilter
            column={table.getColumn('paymentStatus')}
            title="결제 상태"
            options={ORDER_PAYMENT_STATUS_OPTIONS}
          />
          <DataTableFacetedFilter
            column={table.getColumn('fulfillmentType')}
            title="처리 방식"
            options={ORDER_FULFILLMENT_OPTIONS}
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3 shrink-0"
            >
              초기화
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 벌크삭제 + 뷰옵션: 우측 정렬 */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <BulkDeleteToolbar
            table={table}
            onDelete={deleteOrders}
            onSuccess={handleDeleteSuccess}
            itemLabel="주문"
            deleteDescription="선택한 주문은 CANCELLED 상태로 변경 후 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
          />
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
