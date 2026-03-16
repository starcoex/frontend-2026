import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryTreeToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  onStatusFilterChange: (value: 'all' | 'active' | 'inactive') => void;
  totalRoot: number;
  totalSub: number;
  filteredRoot: number;
  filteredSub: number;
  isFiltering: boolean;
}

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
] as const;

export function CategoryTreeToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalRoot,
  totalSub,
  filteredRoot,
  filteredSub,
  isFiltering,
}: CategoryTreeToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <Input
        placeholder="카테고리명 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            상태
            {statusFilter !== 'all' && (
              <Badge
                variant="secondary"
                className="ml-2 rounded-sm px-1 font-normal"
              >
                {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {STATUS_OPTIONS.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={statusFilter === opt.value}
              onCheckedChange={() => onStatusFilterChange(opt.value)}
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {isFiltering && (
        <Button
          variant="ghost"
          onClick={() => {
            onSearchChange('');
            onStatusFilterChange('all');
          }}
          className="h-8 px-2 lg:px-3"
        >
          초기화
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}

      {/* 카운트 표시 */}
      <div className="text-muted-foreground ml-auto flex items-center gap-1.5 text-sm">
        {isFiltering ? (
          <>
            <span>
              최상위 <strong className="text-foreground">{filteredRoot}</strong>
              개
            </span>
            <span>·</span>
            <span>
              하위 <strong className="text-foreground">{filteredSub}</strong>개
            </span>
            <span className="text-muted-foreground/50">
              / 전체 {totalRoot + totalSub}개
            </span>
          </>
        ) : (
          <>
            <span>
              최상위 <strong className="text-foreground">{totalRoot}</strong>개
            </span>
            <span>·</span>
            <span>
              하위 <strong className="text-foreground">{totalSub}</strong>개
            </span>
            <span>·</span>
            <span>
              전체{' '}
              <strong className="text-foreground">
                {totalRoot + totalSub}
              </strong>
              개
            </span>
          </>
        )}
      </div>
    </div>
  );
}
