import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EntitySearchProduct } from './entity-search-product';
import { EntitySearchOrder } from './entity-search-order';
import { EntitySearchPayment } from './entity-search-payment';
import { EntitySearchReservation } from './entity-search-reservation';
import type { SelectedEntity } from './entity-search.types';

export type EntityType = 'product' | 'order' | 'payment' | 'reservation';

const ENTITY_TYPE_OPTIONS: Array<{ value: EntityType; label: string }> = [
  { value: 'order', label: '주문' },
  { value: 'payment', label: '결제' },
  { value: 'reservation', label: '예약' },
  { value: 'product', label: '제품' },
];

interface EntitySelectorProps {
  entityType: EntityType | undefined;
  selectedEntity: SelectedEntity | null;
  onTypeChange: (type: EntityType | undefined) => void;
  onSelectEntity: (entity: SelectedEntity) => void;
  onClearEntity: () => void;
}

export function EntitySelector({
  entityType,
  selectedEntity,
  onTypeChange,
  onSelectEntity,
  onClearEntity,
}: EntitySelectorProps) {
  const handleTypeChange = (v: string) => {
    onTypeChange(v === '__none__' ? undefined : (v as EntityType));
  };

  const renderSearch = () => {
    if (!entityType) return null;

    const commonProps = {
      selected: selectedEntity,
      onSelect: onSelectEntity,
      onClear: onClearEntity,
    };

    switch (entityType) {
      case 'product':
        return <EntitySearchProduct {...commonProps} />;
      case 'order':
        return <EntitySearchOrder {...commonProps} />;
      case 'payment':
        return <EntitySearchPayment {...commonProps} />;
      case 'reservation':
        return <EntitySearchReservation {...commonProps} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 종류 선택 */}
      <div className="space-y-1.5">
        <Label>데이터 종류</Label>
        <Select value={entityType ?? ''} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="연결할 데이터 종류 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__none__">연결 안 함</SelectItem>
              {ENTITY_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 종류별 검색 컴포넌트 */}
      {entityType && (
        <div className="space-y-1.5">
          <Label>
            {ENTITY_TYPE_OPTIONS.find((o) => o.value === entityType)?.label}{' '}
            검색 *
          </Label>
          {renderSearch()}
        </div>
      )}
    </div>
  );
}
