import * as React from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

export function DatePicker({
  date,
  onDateChange,
  className,
  placeholder = '날짜 선택',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-8 justify-start text-left font-normal text-xs',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {date ? (
            format(date, 'yyyy.MM.dd', { locale: ko })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={date}
          locale={ko}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
