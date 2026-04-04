import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SelectedEntity } from './entity-search.types';

interface SelectedEntityCardProps {
  entity: SelectedEntity;
  typeLabel: string;
  onClear: () => void;
}

export function SelectedEntityCard({
  entity,
  typeLabel,
  onClear,
}: SelectedEntityCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-green-900">{entity.label}</p>
        <p className="font-mono text-xs text-green-700">
          {typeLabel} {entity.displayId}
          <span className="ml-2 opacity-60">{entity.path}</span>
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 text-green-700 hover:text-destructive"
        onClick={onClear}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
