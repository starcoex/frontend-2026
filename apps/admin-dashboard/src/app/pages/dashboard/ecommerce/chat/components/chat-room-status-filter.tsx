import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'WAITING', label: '대기' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'RESOLVED', label: '해결됨' },
  { value: 'CLOSED', label: '종료' },
] as const;

interface ChatRoomStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChatRoomStatusFilter({
  value,
  onChange,
}: ChatRoomStatusFilterProps) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="h-8 w-full">
        {STATUS_OPTIONS.map((opt) => (
          <TabsTrigger key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
