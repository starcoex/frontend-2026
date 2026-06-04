import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function WorkingAreasTagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      toast.info('이미 추가된 지역입니다.');
      return;
    }
    onChange([...value, trimmed]);
    setInput('');
    inputRef.current?.focus();
  };

  const handleRemove = (area: string) => {
    onChange(value.filter((a) => a !== area));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="예: 제주시"
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={!input.trim()}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          추가
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        Enter 또는 추가 버튼으로 지역 입력 (예: 제주시, 서귀포시 중앙동)
      </p>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((area) => (
            <Badge key={area} variant="secondary" className="gap-1 pr-1">
              {area}
              <button
                type="button"
                onClick={() => handleRemove(area)}
                className="hover:text-destructive ml-0.5 rounded-full"
                aria-label={`${area} 제거`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
