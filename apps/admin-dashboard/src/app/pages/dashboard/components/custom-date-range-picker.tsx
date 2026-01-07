import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  startOfYear,
  startOfWeek,
} from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { useEffect, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

const dateFilterPresets = [
  { name: 'Today', value: 'today' },
  { name: 'Yesterday', value: 'yesterday' },
  { name: 'This Week', value: 'thisWeek' },
  { name: 'Last 7 Days', value: 'last7Days' },
  { name: 'Last 28 Days', value: 'last28Days' },
  { name: 'This Month', value: 'thisMonth' },
  { name: 'Last Month', value: 'lastMonth' },
  { name: 'This Year', value: 'thisYear' },
];

interface CalendarDateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onChange?: (dateRange: DateRange | undefined) => void;
  value?: DateRange | undefined;
}

export default function CalendarDateRangePicker({
  className,
  onChange,
  value,
  ...props
}: CalendarDateRangePickerProps) {
  const isMobile = useIsMobile();
  const today = new Date();
  const twentyEightDaysAgo = startOfDay(subDays(today, 27));

  // Initialize with "Last 28 days" as default or controlled value
  const [date, setDate] = useState<DateRange | undefined>(
    value ?? {
      from: twentyEightDaysAgo,
      to: endOfDay(today),
    }
  );
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Update internal state when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      setDate(value);
      if (value?.from) {
        setCurrentMonth(value.from);
      }
    }
  }, [value]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    // If not controlled, update internal state
    if (value === undefined) {
      setDate(newDate);
    }

    // Always notify parent of changes
    onChange?.(newDate);

    if (newDate?.from) {
      setCurrentMonth(newDate.from);
    }
  };

  const handleQuickSelect = (from: Date, to: Date) => {
    const newDate = { from, to };
    handleDateChange(newDate);
  };

  const changeHandle = (type: string) => {
    const today = new Date();

    switch (type) {
      case 'today':
        handleQuickSelect(startOfDay(today), endOfDay(today));
        break;
      case 'yesterday': {
        const yesterday = subDays(today, 1);
        handleQuickSelect(startOfDay(yesterday), endOfDay(yesterday));
        break;
      }
      case 'thisWeek': {
        const startOfCurrentWeek = startOfWeek(today);
        handleQuickSelect(startOfDay(startOfCurrentWeek), endOfDay(today));
        break;
      }
      case 'last7Days': {
        const sevenDaysAgo = subDays(today, 6);
        handleQuickSelect(startOfDay(sevenDaysAgo), endOfDay(today));
        break;
      }
      case 'last28Days': {
        const twentyEightDaysAgo = subDays(today, 27); // 27 days ago + today = 28 days
        handleQuickSelect(startOfDay(twentyEightDaysAgo), endOfDay(today));
        break;
      }
      case 'thisMonth':
        handleQuickSelect(startOfMonth(today), endOfDay(today));
        break;
      case 'lastMonth': {
        const lastMonth = subMonths(today, 1);
        handleQuickSelect(startOfMonth(lastMonth), endOfMonth(lastMonth));
        break;
      }
      case 'thisYear': {
        const startOfCurrentYear = startOfYear(today);
        handleQuickSelect(startOfDay(startOfCurrentYear), endOfDay(today));
        break;
      }
    }
  };

  // Use controlled value if provided, otherwise use internal state
  const displayDate = value ?? date;

  return (
    <div className={cn('grid gap-2', className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {isMobile ? (
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        'justify-start text-left font-normal',
                        !displayDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {displayDate?.from ? (
                      displayDate.to ? (
                        <>
                          {format(displayDate.from, 'dd MMM yyyy')} -{' '}
                          {format(displayDate.to, 'dd MMM yyyy')}
                        </>
                      ) : (
                        format(displayDate.from, 'dd MMM yyyy')
                      )
                    ) : (
                      <span>Select date range</span>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !displayDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon />
              {displayDate?.from ? (
                displayDate.to ? (
                  <>
                    {format(displayDate.from, 'dd MMM yyyy')} -{' '}
                    {format(displayDate.to, 'dd MMM yyyy')}
                  </>
                ) : (
                  format(displayDate.from, 'dd MMM yyyy')
                )
              ) : (
                <span>Select date range</span>
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto" align="end">
          <div className="flex flex-col lg:flex-row">
            <div className="me-0 lg:me-4">
              <ToggleGroup
                type="single"
                defaultValue="last28Days"
                className="hidden w-28 flex-col lg:block"
              >
                {dateFilterPresets.map((item, key) => (
                  <ToggleGroupItem
                    key={key}
                    className="text-muted-foreground w-full"
                    value={item.value}
                    onClick={() => changeHandle(item.value)}
                    asChild
                  >
                    <Button className="justify-start rounded-md">
                      {item.name}
                    </Button>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Select
                defaultValue="last28Days"
                onValueChange={(value) => changeHandle(value)}
              >
                <SelectTrigger
                  className="mb-4 flex w-full lg:hidden"
                  // size="sm"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 28 Days" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilterPresets.map((item, key) => (
                    <SelectItem key={key} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Calendar
              className="border-s-0 py-0! ps-0! pe-0! lg:border-s lg:ps-4!"
              mode="range"
              month={currentMonth}
              selected={displayDate}
              onSelect={handleDateChange}
              onMonthChange={setCurrentMonth}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
