import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import type { Vehicle } from '@starcoex-frontend/vehicles';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  VehicleStatusBadge,
  VehicleSizeGradeBadge,
  GradeConfidenceBadge,
} from './vehicle-status-badge';
import { VehicleRowActions } from './vehicle-row-actions';
import type {
  VehicleStatusValue,
  VehicleSizeGradeValue,
  GradeConfidenceValue,
} from '../data/vehicle-data';

export const vehicleColumns: ColumnDef<Vehicle>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="전체 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'carNo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="차량번호" />
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium">
        {row.original.carNo}
      </span>
    ),
  },
  {
    accessorKey: 'ownerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="소유자" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.ownerName}</span>
    ),
  },
  {
    accessorKey: 'apiCarName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="차명" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.apiCarName ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'resolvedGrade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="사이즈 등급" />
    ),
    cell: ({ row }) => {
      const grade = row.original.resolvedGrade;
      if (!grade)
        return <span className="text-muted-foreground text-xs">미결정</span>;
      return <VehicleSizeGradeBadge grade={grade as VehicleSizeGradeValue} />;
    },
  },
  {
    accessorKey: 'gradeConfidence',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="신뢰도" />
    ),
    cell: ({ row }) => {
      const conf = row.original.gradeConfidence;
      if (!conf)
        return <span className="text-muted-foreground text-xs">-</span>;
      return <GradeConfidenceBadge confidence={conf as GradeConfidenceValue} />;
    },
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => (
      <VehicleStatusBadge status={row.original.status as VehicleStatusValue} />
    ),
    filterFn: (row, id, value: string[]) =>
      !value?.length || value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'dataSource',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="소스" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.dataSource}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="등록일" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'MM/dd HH:mm', { locale: ko }),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <VehicleRowActions vehicle={row.original} />,
  },
];
