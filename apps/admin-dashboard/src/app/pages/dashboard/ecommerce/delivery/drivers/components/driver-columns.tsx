import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { DataTableColumnHeader } from '@starcoex-frontend/common';
import type { DeliveryDriver } from '@starcoex-frontend/delivery';
import {
  DRIVER_STATUS_CONFIG,
  VEHICLE_TYPE_CONFIG,
  formatDeliveryFee,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';
import { DriverRowActions } from './driver-row-actions';

// 컬럼에서 상태 변경 콜백을 받기 위한 팩토리 패턴
interface DriverColumnsOptions {
  onStatusChange: (driverId: number, status: DeliveryDriver['status']) => void;
  onAvailabilityChange: (driverId: number, isAvailable: boolean) => void;
  onDeleted: (driverId: number) => void; // ✅ 추가
}

export const getDriverColumns = ({
  onStatusChange,
  onAvailabilityChange,
  onDeleted, // ✅ 추가
}: DriverColumnsOptions): ColumnDef<DeliveryDriver>[] => [
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
    id: 'info',
    header: '기사 정보',
    cell: ({ row }) => {
      const d = row.original;
      return (
        <div>
          <p className="font-medium">{d.name}</p>
          <p className="text-muted-foreground font-mono text-xs">
            {d.driverCode}
          </p>
          <p className="text-muted-foreground text-xs">{d.phone}</p>
        </div>
      );
    },
  },
  {
    id: 'vehicle',
    header: '차량',
    // ✅ accessorFn 추가 → getFacetedUniqueValues가 값을 읽을 수 있음
    accessorFn: (row) => row.vehicleType,
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.vehicleType);
    },
    cell: ({ row }) => {
      const d = row.original;
      return (
        <div>
          <p className="text-sm">{VEHICLE_TYPE_CONFIG[d.vehicleType].label}</p>
          {d.vehicleNumber && (
            <p className="text-muted-foreground font-mono text-xs">
              {d.vehicleNumber}
            </p>
          )}
          {d.vehicleModel && (
            <p className="text-muted-foreground text-xs">{d.vehicleModel}</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    enableColumnFilter: true, // ✅ 명시적으로 필터 활성화
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="상태" />
    ),
    cell: ({ row }) => (
      <Badge variant={DRIVER_STATUS_CONFIG[row.original.status].variant}>
        {DRIVER_STATUS_CONFIG[row.original.status].label}
      </Badge>
    ),
    filterFn: (row, _, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original.status);
    },
  },
  {
    accessorKey: 'isAvailable',
    header: '가용',
    cell: ({ row }) => (
      <Switch
        checked={row.original.isAvailable}
        onCheckedChange={() =>
          onAvailabilityChange(row.original.id, !row.original.isAvailable)
        }
        disabled={row.original.status !== 'ACTIVE'}
      />
    ),
  },
  {
    accessorKey: 'totalDeliveries',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="총 배송" />
    ),
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">
        {row.original.totalDeliveries}건
      </span>
    ),
  },
  {
    accessorKey: 'completionRate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="완료율" />
    ),
    cell: ({ row }) =>
      row.original.completionRate != null ? (
        <span className="text-sm tabular-nums">
          {Number(row.original.completionRate).toFixed(1)}%
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      ),
  },
  {
    accessorKey: 'avgRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="평점" />
    ),
    cell: ({ row }) =>
      row.original.avgRating ? (
        <span className="text-sm tabular-nums">
          ⭐ {Number(row.original.avgRating).toFixed(1)}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      ),
  },
  {
    id: 'rate',
    header: '수수료',
    cell: ({ row }) => {
      const d = row.original;
      if (d.ratePerDelivery)
        return (
          <span className="text-sm tabular-nums">
            {formatDeliveryFee(d.ratePerDelivery)}/건
          </span>
        );
      if (d.hourlyRate)
        return (
          <span className="text-sm tabular-nums">
            {formatDeliveryFee(d.hourlyRate)}/h
          </span>
        );
      return <span className="text-muted-foreground text-sm">-</span>;
    },
  },
  {
    id: 'workingAreas',
    header: '근무 지역',
    cell: ({ row }) => {
      const areas = row.original.workingAreas as unknown as string[];
      if (!areas?.length)
        return <span className="text-muted-foreground text-sm">-</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {areas.slice(0, 2).map((area) => (
            <Badge key={area} variant="outline" className="text-xs">
              {area}
            </Badge>
          ))}
          {areas.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{areas.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <DriverRowActions
        driver={row.original}
        onStatusChange={onStatusChange}
        onAvailabilityChange={onAvailabilityChange}
        onDeleted={onDeleted} // ✅ 추가
      />
    ),
  },
];
