import { Badge } from '@/components/ui/badge';
import {
  CONTACT_STATUS_OPTIONS,
  CONTACT_CATEGORY_OPTIONS,
  type ContactStatusValue,
  type ContactCategoryValue,
} from '../data/contact-data';

const CONTACT_STATUS_MAP = Object.fromEntries(
  CONTACT_STATUS_OPTIONS.map((o) => [o.value, o])
) as Record<ContactStatusValue, (typeof CONTACT_STATUS_OPTIONS)[number]>;

const CONTACT_CATEGORY_MAP = Object.fromEntries(
  CONTACT_CATEGORY_OPTIONS.map((o) => [o.value, o])
) as Record<ContactCategoryValue, (typeof CONTACT_CATEGORY_OPTIONS)[number]>;

export function ContactStatusBadge({ status }: { status: ContactStatusValue }) {
  const config = CONTACT_STATUS_MAP[status];
  return (
    <Badge variant={config?.variant as any}>{config?.label ?? status}</Badge>
  );
}

export function ContactCategoryBadge({
  category,
}: {
  category: ContactCategoryValue;
}) {
  const config = CONTACT_CATEGORY_MAP[category];
  return <Badge variant="outline">{config?.label ?? category}</Badge>;
}

export { CONTACT_STATUS_MAP };
