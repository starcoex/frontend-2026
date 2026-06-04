import { Badge } from '@/components/ui/badge';
import {
  NOTICE_STATUS_MAP,
  NOTICE_TYPE_MAP,
  MANUAL_STATUS_MAP,
  NOTICE_TYPE_ICONS,
  type NoticeStatusValue,
  type NoticeTypeValue,
  type ManualStatusValue,
} from '@/app/pages/dashboard/ecommerce/notices/data/notices-data';

export function NoticeStatusBadge({ status }: { status: NoticeStatusValue }) {
  const config = NOTICE_STATUS_MAP[status];
  return (
    <Badge variant={config?.variant as any}>{config?.label ?? status}</Badge>
  );
}

export function NoticeTypeBadge({ type }: { type: NoticeTypeValue }) {
  const config = NOTICE_TYPE_MAP[type];
  return (
    <Badge variant={config?.variant as any}>
      {NOTICE_TYPE_ICONS[type]} {config?.label ?? type}
    </Badge>
  );
}

export function ManualStatusBadge({ status }: { status: ManualStatusValue }) {
  const config = MANUAL_STATUS_MAP[status];
  return (
    <Badge variant={config?.variant as any}>{config?.label ?? status}</Badge>
  );
}
