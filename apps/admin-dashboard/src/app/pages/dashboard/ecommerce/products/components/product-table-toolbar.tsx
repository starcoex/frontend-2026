import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColumnsIcon, XIcon } from 'lucide-react';
import type { Product } from '@starcoex-frontend/products';

interface ProductsTableToolbarProps {
  table: Table<Product>;
}

const STATUS_OPTIONS = [
  { value: 'all', label: '전체 상태' },
  { value: 'active', label: '판매 중' },
  { value: 'out-of-stock', label: '품절' },
  { value: 'closed-for-sale', label: '판매 중단' },
] as const;

export function ProductsTableToolbar({ table }: ProductsTableToolbarProps) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getColumn('name')?.getFilterValue();

  return (
    <div className="flex items-center gap-3">
      {/* 검색 */}
      <Input
        placeholder="제품명으로 검색..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('name')?.setFilterValue(e.target.value)
        }
        className="max-w-xs"
      />

      {/* 상태 필터 */}
      <Select
        defaultValue="all"
        onValueChange={(val) =>
          table
            .getColumn('status')
            ?.setFilterValue(val === 'all' ? undefined : val)
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 필터 초기화 */}
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          초기화
          <XIcon className="ml-1 size-3.5" />
        </Button>
      )}

      {/* 컬럼 토글 */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ColumnsIcon className="size-4" />
              <span className="hidden lg:inline">컬럼</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(value)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
