import { Badge } from '@/components/ui/badge';
import {
  JOB_STATUS_MAP,
  EMPLOYMENT_TYPE_MAP,
  type JobStatusValue,
  type EmploymentTypeValue,
} from '@/app/pages/dashboard/ecommerce/jobs/data/job-data';

export function JobStatusBadge({ status }: { status: JobStatusValue }) {
  const config = JOB_STATUS_MAP[status];
  return (
    <Badge variant={config?.variant as any}>{config?.label ?? status}</Badge>
  );
}

export function EmploymentTypeBadge({ type }: { type: EmploymentTypeValue }) {
  const config = EMPLOYMENT_TYPE_MAP[type];
  return <Badge variant="outline">{config?.label ?? type}</Badge>;
}

// re-export for convenience
export type { JobStatusValue, EmploymentTypeValue };
export { JOB_STATUS_MAP, EMPLOYMENT_TYPE_MAP };
