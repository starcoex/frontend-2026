import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Order } from '@starcoex-frontend/orders';
import {
  ORDER_FULFILLMENT_OPTIONS,
  ORDER_PAYMENT_STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS,
  ORDER_TAB_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/orders/data/order-data';
import { DataTableFacetedFilter } from '@/app/pages/dashboard/ecommerce/orders/components/data-table-faceted-filter';
import { DataTableViewOptions } from '@/app/pages/dashboard/ecommerce/orders/components/data-table-view-options';

interface OrderToolbarProps {
  table: Table<Order>;
}

export function OrderToolbar({ table }: OrderToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="space-y-3">
      {/* 탭 필터 */}
      <Tabs
        defaultValue="all"
        onValueChange={(v) =>
          table
            .getColumn('status')
            ?.setFilterValue(v === 'all' ? undefined : [v])
        }
      >
        <TabsList>
          {ORDER_TAB_OPTIONS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 검색 + 필터 행 */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="주문번호 검색..."
          value={
            (table.getColumn('orderNumber')?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table.getColumn('orderNumber')?.setFilterValue(e.target.value)
          }
          className="h-8 w-[200px] lg:w-[280px]"
        />

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
            className="h-8 px-2 lg:px-3"
          >
            초기화
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}

        <div className="ml-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
