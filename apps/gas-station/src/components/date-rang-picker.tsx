import * as React from 'react';
import { format, subDays, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DATE_PRESETS = [
  { label: '7일', days: 7 },
  { label: '14일', days: 14 },
  { label: '30일', days: 30 },
] as const;

interface DateRangePickerProps {
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  maxDays?: number;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  maxDays = 31,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  const selectedDays = differenceInDays(dateRange.to, dateRange.from);

  // Popover 열릴 때 tempRange 초기화
  React.useEffect(() => {
    if (isOpen) {
      setTempRange({ from: dateRange.from, to: dateRange.to });
    }
  }, [isOpen, dateRange]);

  const handlePresetClick = (days: number) => {
    onDateRangeChange({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };

  const handleSelect = (range: DateRange | undefined) => {
    setTempRange(range);
  };

  const handleApply = () => {
    if (!tempRange?.from) return;

    const from = tempRange.from;
    const to = tempRange.to || from;

    // 최대 기간 제한 (31일 초과 시 자동 조정)
    const daysDiff = differenceInDays(to, from);
    if (daysDiff > maxDays) {
      onDateRangeChange({
        from: subDays(to, maxDays),
        to: to,
      });
    } else {
      onDateRangeChange({ from, to });
    }

    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange({ from: dateRange.from, to: dateRange.to });
    setIsOpen(false);
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* 프리셋 버튼 (최근 7일, 14일, 30일) */}
      <div className="flex gap-1.5">
        {DATE_PRESETS.map((preset) => (
          <Button
            key={preset.days}
            variant={selectedDays === preset.days ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePresetClick(preset.days)}
            className="h-8 px-3 text-xs"
          >
            최근 {preset.label}
          </Button>
        ))}
      </div>

      {/* 캘린더 날짜 범위 선택 */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 justify-start text-left font-normal text-xs',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
            {format(dateRange.from, 'yyyy.MM.dd', { locale: ko })} -{' '}
            {format(dateRange.to, 'yyyy.MM.dd', { locale: ko })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={tempRange?.from || dateRange.from}
            selected={tempRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ko}
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date()}
          />
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-xs text-muted-foreground">
              최대 {maxDays}일까지 선택 가능
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempRange?.from || !tempRange?.to}
              >
                적용
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
