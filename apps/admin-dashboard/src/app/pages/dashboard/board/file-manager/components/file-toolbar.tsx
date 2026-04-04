import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { FileWithUrl } from '@starcoex-frontend/graphql';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
} from '@starcoex-frontend/common';

const FILE_TYPE_OPTIONS = [
  { label: '이미지', value: 'image' },
  { label: '동영상', value: 'video' },
  { label: '문서', value: 'pdf' },
  { label: '오디오', value: 'audio' },
] as const;

interface FileToolbarProps {
  table: Table<FileWithUrl>;
}

export function FileToolbar({ table }: FileToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="파일명 검색..."
        value={
          (table.getColumn('originalName')?.getFilterValue() as string) ?? ''
        }
        onChange={(e) =>
          table.getColumn('originalName')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[280px]"
      />

      <DataTableFacetedFilter
        column={table.getColumn('mimeType')}
        title="파일 유형"
        options={FILE_TYPE_OPTIONS}
      />

      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          초기화
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}

      <div className="ml-auto">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
