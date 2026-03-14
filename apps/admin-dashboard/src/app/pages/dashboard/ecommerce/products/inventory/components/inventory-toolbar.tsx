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
import { ColumnsIcon, PlusIcon } from 'lucide-react';
import type { InventoryRow } from './inventory-columns';

interface InventoryToolbarProps {
  table: Table<InventoryRow>;
  onAddClick: () => void;
}

export function InventoryToolbar({ table, onAddClick }: InventoryToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <Input
        placeholder="제품명으로 검색..."
        value={(table.getColumn('product')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('product')?.setFilterValue(e.target.value)
        }
        className="max-w-xs"
      />

      {/* 판매 가능 필터 */}
      <Select
        defaultValue="all"
        onValueChange={(val) => {
          if (val === 'all') {
            table.getColumn('isAvailable')?.setFilterValue(undefined);
          } else {
            table.getColumn('isAvailable')?.setFilterValue(val === 'true');
          }
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="판매 상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="true">판매 가능</SelectItem>
          <SelectItem value="false">판매 불가</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto flex gap-2">
        {/* 컬럼 토글 */}
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

        <Button onClick={onAddClick}>
          <PlusIcon className="mr-2 size-4" />
          재고 등록
        </Button>
      </div>
    </div>
  );
}
