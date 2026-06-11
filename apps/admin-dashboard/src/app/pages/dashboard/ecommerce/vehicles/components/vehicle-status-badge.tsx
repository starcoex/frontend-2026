import { Badge } from '@/components/ui/badge';
import {
  GRADE_CONFIDENCE_OPTIONS,
  GradeConfidenceValue,
  VEHICLE_SIZE_GRADE_OPTIONS,
  VEHICLE_STATUS_OPTIONS,
  VehicleSizeGradeValue,
  VehicleStatusValue,
} from '@/app/pages/dashboard/ecommerce/vehicles/data/vehicle-data';

const VEHICLE_STATUS_MAP = Object.fromEntries(
  VEHICLE_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<VehicleStatusValue, (typeof VEHICLE_STATUS_OPTIONS)[number]>;

const SIZE_GRADE_MAP = Object.fromEntries(
  VEHICLE_SIZE_GRADE_OPTIONS.map((o) => [o.value, o])
) as Record<VehicleSizeGradeValue, (typeof VEHICLE_SIZE_GRADE_OPTIONS)[number]>;

const CONFIDENCE_MAP = Object.fromEntries(
  GRADE_CONFIDENCE_OPTIONS.map((o) => [o.value, o])
) as Record<GradeConfidenceValue, (typeof GRADE_CONFIDENCE_OPTIONS)[number]>;

export function VehicleStatusBadge({ status }: { status: VehicleStatusValue }) {
  const config = VEHICLE_STATUS_MAP[status];
  return (
    <Badge variant={config?.variant as any}>{config?.label ?? status}</Badge>
  );
}

export function VehicleSizeGradeBadge({
  grade,
}: {
  grade: VehicleSizeGradeValue;
}) {
  const config = SIZE_GRADE_MAP[grade];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        config?.color ?? ''
      }`}
    >
      {config?.label ?? grade}
    </span>
  );
}

export function GradeConfidenceBadge({
  confidence,
}: {
  confidence: GradeConfidenceValue;
}) {
  const config = CONFIDENCE_MAP[confidence];
  return (
    <Badge variant={config?.variant as any} className="text-xs">
      {config?.label ?? confidence}
    </Badge>
  );
}

export { VEHICLE_STATUS_MAP };
