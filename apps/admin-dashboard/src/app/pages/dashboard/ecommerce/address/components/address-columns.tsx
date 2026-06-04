import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Address } from '@starcoex-frontend/address';
import {
  ADDRESS_STATUS_CONFIG,
  ADDRESS_DATA_SOURCE_CONFIG,
  ADDRESS_BUILDING_TYPE_CONFIG,
} from '../data/address-data';
import { AddressRowActions } from './address-row-actions';

interface GetAddressColumnsOptions {
  onDelete?: (id: number) => void;
}

export const getAddressColumns = (
  options: GetAddressColumnsOptions = {}
): ColumnDef<Address>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="전체 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'roadFullAddr',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="도로명주소" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[280px]">
        <p className="truncate text-sm font-medium">
          {row.original.roadFullAddr}
        </p>
        {row.original.addrDetail && (
          <p className="text-muted-foreground truncate text-xs">
            {row.original.addrDetail}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'zipNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="우편번호" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.zipNo}</span>
    ),
  },
  {
    id: 'region',
    header: '지역',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {[row.original.siNm, row.original.sggNm, row.original.emdNm]
          .filter(Boolean)
          .join(' ')}
      </span>
    ),
  },
  {
    accessorKey: 'buildingType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="건물 유형" />
    ),
    cell: ({ row }) => {
      const config = ADDRESS_BUILDING_TYPE_CONFIG[row.original.buildingType];
      return (
        <Badge variant="outline" className="text-xs">
          {config?.label ?? row.original.buildingType}
        </Badge>
      );
    },
    // 클라이언트 멀티셀렉 필터
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.buildingType);
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => {
      const config = ADDRESS_STATUS_CONFIG[row.original.status];
      return config ? (
        <Badge variant={config.variant}>{config.label}</Badge>
      ) : (
        <Badge variant="outline">{row.original.status}</Badge>
      );
    },
    // 클라이언트 멀티셀렉 필터
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    accessorKey: 'dataSource',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="출처" />
    ),
    cell: ({ row }) => {
      const config = ADDRESS_DATA_SOURCE_CONFIG[row.original.dataSource];
      return config ? (
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      ) : (
        <Badge variant="outline">{row.original.dataSource}</Badge>
      );
    },
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.dataSource);
    },
  },
  {
    accessorKey: 'usageCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사용 횟수" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.usageCount}회
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {format(new Date(row.original.createdAt), 'yyyy.MM.dd', { locale: ko })}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <AddressRowActions address={row.original} onDelete={options.onDelete} />
    ),
  },
];
