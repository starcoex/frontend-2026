import { Badge } from './ui';

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'destructive'
  | 'outline'
  | 'default'
  | 'secondary';

export interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

interface StatusBadgeProps {
  config: StatusConfig;
}

export function StatusBadge({ config }: StatusBadgeProps) {
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
