import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserInvitation } from '@starcoex-frontend/graphql';
import { useAuth } from '@starcoex-frontend/auth';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  BulkDeleteToolbar,
} from '@starcoex-frontend/common';
import { toast } from 'sonner';

interface Props {
  table: Table<UserInvitation>;
  onDeleted?: () => void;
}

const statusOptions = [
  { label: '대기 중', value: 'PENDING' },
  { label: '수락됨', value: 'ACCEPTED' },
  { label: '만료됨', value: 'EXPIRED' },
  { label: '취소됨', value: 'CANCELLED' },
];

export function InvitationsToolbar({ table, onDeleted }: Props) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { deleteInvitations } = useAuth();

  // 취소/만료 상태만 삭제 가능 — 선택된 행 중 불가능한 항목이 있으면 경고
  const handleDelete = async (ids: number[]) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const deletableIds = selectedRows
      .filter((row) => {
        const status = row.original.status;
        return status === 'CANCELLED' || status === 'EXPIRED';
      })
      .map((row) => row.original.id);

    if (deletableIds.length === 0) {
      toast.warning('취소됨 또는 만료됨 상태의 초대만 삭제할 수 있습니다.');
      return { success: false };
    }

    if (deletableIds.length < ids.length) {
      toast.warning(
        `${ids.length - deletableIds.length}건은 삭제 불가 상태입니다. ${
          deletableIds.length
        }건만 삭제합니다.`
      );
    }

    return deleteInvitations(deletableIds);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="이메일 검색..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title="상태"
              options={statusOptions}
            />
          )}
        </div>
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
        {/* ✅ 공통 BulkDeleteToolbar 사용 */}
        <BulkDeleteToolbar
          table={table}
          onDelete={handleDelete}
          onSuccess={onDeleted}
          itemLabel="초대"
          deleteDescription="선택한 초대를 영구 삭제합니다. 취소됨/만료됨 상태만 삭제 가능합니다."
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
