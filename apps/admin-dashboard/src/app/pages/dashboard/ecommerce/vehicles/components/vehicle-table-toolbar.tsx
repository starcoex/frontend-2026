import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';
import type { Vehicle } from '@starcoex-frontend/vehicles';
import {
  VEHICLE_STATUS_OPTIONS,
  GRADE_CONFIDENCE_OPTIONS,
} from '../data/vehicle-data';

interface VehicleTableToolbarProps {
  table: Table<Vehicle>;
  onRefresh?: () => void;
}

export function VehicleTableToolbar({
  table,
  onRefresh,
}: VehicleTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Label htmlFor="vehicle-search" className="sr-only">
          차량번호 검색
        </Label>
        <Input
          id="vehicle-search"
          placeholder="차량번호 또는 소유자 검색..."
          value={(table.getColumn('carNo')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('carNo')?.setFilterValue(e.target.value)
          }
          className="h-8 pl-8 w-full sm:w-[200px] lg:w-[280px]"
        />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        <DataTableFacetedFilter
          column={table.getColumn('status')}
          title="상태"
          options={VEHICLE_STATUS_OPTIONS}
        />
        <DataTableFacetedFilter
          column={table.getColumn('gradeConfidence')}
          title="신뢰도"
          options={GRADE_CONFIDENCE_OPTIONS}
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
      <div className="flex items-center gap-2 sm:ml-auto">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onRefresh}
          >
            새로고침
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
