import { cn } from '../../utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui';

const NONE_VALUE = '__none__';

const PRESET_COLORS = [
  { label: '없음', value: NONE_VALUE },
  { label: '빨강', value: '#ef4444' },
  { label: '주황', value: '#f97316' },
  { label: '노랑', value: '#eab308' },
  { label: '연두', value: '#84cc16' },
  { label: '초록', value: '#22c55e' },
  { label: '청록', value: '#14b8a6' },
  { label: '하늘', value: '#06b6d4' },
  { label: '파랑', value: '#3b82f6' },
  { label: '남색', value: '#6366f1' },
  { label: '보라', value: '#a855f7' },
  { label: '분홍', value: '#ec4899' },
  { label: '회색', value: '#6b7280' },
  { label: '검정', value: '#111827' },
];

interface ColorThemePickerProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ColorThemePicker({
  value,
  onChange,
  className,
}: ColorThemePickerProps) {
  // 외부 빈 문자열 → 내부 sentinel, 외부 값 → 그대로
  const selectValue = value || NONE_VALUE;

  const handleChange = (v: string) => {
    // sentinel → 빈 문자열로 변환해서 외부에 전달
    onChange(v === NONE_VALUE ? '' : v);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Select value={selectValue} onValueChange={handleChange}>
        <SelectTrigger className="flex-1">
          <SelectValue>
            {value ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: value }}
                />
                {PRESET_COLORS.find((c) => c.value === value)?.label ?? value}
              </span>
            ) : (
              <span className="text-muted-foreground">색상 선택</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PRESET_COLORS.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <span className="flex items-center gap-2">
                {color.value !== NONE_VALUE ? (
                  <span
                    className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: color.value }}
                  />
                ) : (
                  <span className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border border-dashed border-muted-foreground/40" />
                )}
                {color.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value && (
        <span
          className="h-8 w-8 flex-shrink-0 rounded-full border border-black/10 shadow-sm"
          style={{ backgroundColor: value }}
        />
      )}
    </div>
  );
}
