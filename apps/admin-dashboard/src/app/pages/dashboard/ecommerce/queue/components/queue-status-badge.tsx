import { Badge } from '@/components/ui/badge';
import {
  QUEUE_STATUS_OPTIONS,
  type QueueStatusValue,
} from '@/app/pages/dashboard/ecommerce/queue/data/queue-data';

const QUEUE_STATUS_MAP = Object.fromEntries(
  QUEUE_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<QueueStatusValue, (typeof QUEUE_STATUS_OPTIONS)[number]>;

export function QueueStatusBadge({ status }: { status: QueueStatusValue }) {
  const config = QUEUE_STATUS_MAP[status];
  return (
    <Badge variant={config?.variant as any}>{config?.label ?? status}</Badge>
  );
}

export { QUEUE_STATUS_MAP };
