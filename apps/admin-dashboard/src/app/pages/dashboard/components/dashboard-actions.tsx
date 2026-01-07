import { IconDownload } from '@tabler/icons-react';
import CustomDateRangePicker from './custom-date-range-picker';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';

export const DashboardActions = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const handleDateRangeChange = (newRange: DateRange | undefined) => {
    setDateRange(newRange);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button>
        <IconDownload />
        다운로드
      </Button>
      <CustomDateRangePicker
        value={dateRange}
        onChange={handleDateRangeChange}
      />
    </div>
  );
};
