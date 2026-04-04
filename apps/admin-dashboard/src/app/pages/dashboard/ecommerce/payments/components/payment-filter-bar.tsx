import { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { PaymentsFilter } from '@starcoex-frontend/payments';
import { PAYMENT_STATUS_OPTIONS } from '../data/payment-data';

interface PaymentFilterBarProps {
  filter: PaymentsFilter;
  onFilterChange: (filter: Partial<PaymentsFilter>) => void;
  onReset: () => void;
  isLoading: boolean;
}

export function PaymentFilterBar({
  filter,
  onFilterChange,
  onReset,
  isLoading,
}: PaymentFilterBarProps) {
  const [orderNameSearch, setOrderNameSearch] = useState(
    filter.orderNameSearch ?? ''
  );

  // 주문명 검색 — Enter 또는 버튼 클릭 시 서버 호출
  const handleSearchSubmit = () => {
    onFilterChange({ orderNameSearch: orderNameSearch || undefined });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const handleReset = () => {
    setOrderNameSearch('');
    onReset();
  };

  const hasActiveFilter =
    !!filter.status ||
    !!filter.startDate ||
    !!filter.endDate ||
    !!filter.orderNameSearch;

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-3">
          {/* 주문명 검색 */}
          <div className="flex min-w-[200px] flex-1 items-center gap-2">
            <Input
              placeholder="주문명 검색..."
              value={orderNameSearch}
              onChange={(e) => setOrderNameSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8"
              disabled={isLoading}
            />
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3"
              onClick={handleSearchSubmit}
              disabled={isLoading}
            >
              <Search className="size-3.5" />
            </Button>
          </div>

          {/* 결제 상태 필터 */}
          <Select
            value={filter.status ?? 'ALL'}
            onValueChange={(v) =>
              onFilterChange({ status: v === 'ALL' ? undefined : (v as any) })
            }
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="전체 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체 상태</SelectItem>
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 시작 날짜 */}
          <Input
            type="date"
            className="h-8 w-[150px]"
            value={filter.startDate ?? ''}
            onChange={(e) =>
              onFilterChange({ startDate: e.target.value || undefined })
            }
            disabled={isLoading}
          />

          {/* 종료 날짜 */}
          <Input
            type="date"
            className="h-8 w-[150px]"
            value={filter.endDate ?? ''}
            onChange={(e) =>
              onFilterChange({ endDate: e.target.value || undefined })
            }
            disabled={isLoading}
          />

          {/* 초기화 버튼 */}
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="mr-1 size-3.5" />
              초기화
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
