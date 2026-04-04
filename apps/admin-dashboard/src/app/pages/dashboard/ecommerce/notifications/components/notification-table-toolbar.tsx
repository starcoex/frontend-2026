import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { CheckCheck, UserSearch, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  type Notification,
  useNotifications,
} from '@starcoex-frontend/notifications';
import {
  DataTableFacetedFilter,
  DataTableViewOptions,
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common';
import {
  NOTIFICATION_STATUS_OPTIONS,
  NOTIFICATION_TYPE_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/notifications/data/notification-data';

interface NotificationTableToolbarProps {
  table: Table<Notification>;
}

export function NotificationTableToolbar({
  table,
}: NotificationTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { markAllAsRead, fetchAdminAllNotifications } = useNotifications();

  // 유저 필터 상태
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [filteredUser, setFilteredUser] = useState<SelectedCustomer | null>(
    null
  );

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if (res.success) {
      toast.success('모든 알림을 읽음 처리했습니다.');
    } else {
      toast.error(res.error?.message ?? '처리에 실패했습니다.');
    }
  };

  // 유저 선택 시 해당 유저의 알림만 조회
  const handleSelectUser = (customer: SelectedCustomer) => {
    setFilteredUser(customer);
    setUserPopoverOpen(false);
    fetchAdminAllNotifications({
      userId: customer.userId,
      limit: 50,
      offset: 0,
    });
  };

  // 유저 필터 해제 → 전체 알림 재조회
  const handleClearUser = () => {
    setFilteredUser(null);
    fetchAdminAllNotifications({ limit: 50, offset: 0 });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="제목으로 검색..."
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onChange={(e) =>
          table.getColumn('title')?.setFilterValue(e.target.value)
        }
        className="h-8 w-[200px] lg:w-[240px]"
      />

      {/* 유저 검색 필터 */}
      {filteredUser ? (
        // 선택된 유저 표시 + 해제 버튼
        <div className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
          <UserSearch className="size-3 opacity-60" />
          <span className="font-medium">{filteredUser.name}</span>
          <Badge variant="outline" className="ml-1 font-mono text-xs">
            #{filteredUser.userId}
          </Badge>
          <button
            type="button"
            onClick={handleClearUser}
            className="text-muted-foreground hover:text-foreground ml-1"
            aria-label="유저 필터 해제"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <UserSearch className="size-3.5" />
              유저 필터
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <p className="text-muted-foreground mb-2 text-xs">
              특정 유저의 알림만 조회합니다.
            </p>
            <CustomerSearch
              selected={null}
              onSelect={handleSelectUser}
              // onClear={() => {}}
              enableCreate={false}
            />
          </PopoverContent>
        </Popover>
      )}

      <DataTableFacetedFilter
        column={table.getColumn('type')}
        title="타입"
        options={NOTIFICATION_TYPE_OPTIONS}
      />

      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="상태"
        options={NOTIFICATION_STATUS_OPTIONS}
      />

      {(isFiltered || filteredUser) && (
        <Button
          variant="ghost"
          onClick={() => {
            table.resetColumnFilters();
            handleClearUser();
          }}
          className="h-8 px-2 lg:px-3"
        >
          초기화
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleMarkAllAsRead}
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          전체 읽음
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
