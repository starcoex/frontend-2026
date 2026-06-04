import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Search } from 'lucide-react';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import type { Address } from '@starcoex-frontend/address';
import {
  ADDRESS_STATUS_FILTER_OPTIONS,
  ADDRESS_BUILDING_TYPE_FILTER_OPTIONS,
  ADDRESS_DATA_SOURCE_FILTER_OPTIONS,
} from '../data/address-data';

interface AddressTableToolbarProps {
  table: Table<Address>;
  // 서버사이드 keyword 검색
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  isLoading?: boolean;
  // 일괄 삭제
  onBulkDelete: (
    ids: number[]
  ) => Promise<{ success: boolean; error?: { message?: string } }>;
  onDeleteSuccess?: () => void;
}

export function AddressTableToolbar({
  table,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  isLoading,
  onBulkDelete,
  onDeleteSuccess,
}: AddressTableToolbarProps) {
  // 클라이언트 필터 + 서버 검색어 중 하나라도 활성화 시 초기화 버튼 표시
  const isClientFiltered = table.getState().columnFilters.length > 0;
  const isFiltered = isClientFiltered || !!searchValue;

  const handleReset = () => {
    table.resetColumnFilters();
    onSearchChange('');
    onSearchSubmit();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 서버사이드 키워드 검색 */}
      <div className="flex items-center gap-1.5">
        <Input
          placeholder="도로명 또는 지번 검색..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
          className="h-8 w-[200px] lg:w-[260px]"
          disabled={isLoading}
        />
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2"
          onClick={onSearchSubmit}
          disabled={isLoading || !searchValue.trim()}
        >
          <Search className="size-3.5" />
        </Button>
      </div>

      {/* 상태 — 클라이언트 Faceted 멀티셀렉 */}
      {table.getColumn('status') && (
        <DataTableFacetedFilter
          column={table.getColumn('status')}
          title="상태"
          options={ADDRESS_STATUS_FILTER_OPTIONS}
        />
      )}

      {/* 건물 유형 — 클라이언트 Faceted 멀티셀렉 */}
      {table.getColumn('buildingType') && (
        <DataTableFacetedFilter
          column={table.getColumn('buildingType')}
          title="건물 유형"
          options={ADDRESS_BUILDING_TYPE_FILTER_OPTIONS}
        />
      )}

      {/* 출처 — 클라이언트 Faceted 멀티셀렉 */}
      {table.getColumn('dataSource') && (
        <DataTableFacetedFilter
          column={table.getColumn('dataSource')}
          title="출처"
          options={ADDRESS_DATA_SOURCE_FILTER_OPTIONS}
        />
      )}

      {/* 필터 초기화 */}
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={handleReset}
          className="h-8 px-2 lg:px-3"
          disabled={isLoading}
        >
          초기화
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}

      {/* 일괄 삭제 */}
      <BulkDeleteToolbar
        table={table}
        onDelete={onBulkDelete}
        onSuccess={onDeleteSuccess}
        itemLabel="주소"
        deleteDescription="선택한 주소를 삭제합니다. 이 작업은 되돌릴 수 없습니다."
      />

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
