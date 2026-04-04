import { useState } from 'react';
import { CheckIcon, ChevronsUpDown, X } from 'lucide-react';
import {
  Button,
  Badge,
  Command,
  Popover,
  PopoverContent,
  PopoverTrigger,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui';
import { cn } from '../../utils';

export interface MultiSelectOption {
  id: number;
  name: string;
  code?: string;
}

interface MultiSelectProps {
  value: number[];
  onChange: (val: number[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = '선택하세요...',
  searchPlaceholder = '검색...',
  emptyMessage = '검색 결과가 없습니다.',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.filter((o) => value.includes(o.id));

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between font-normal"
          >
            {selected.length === 0
              ? placeholder
              : `${selected.length}개 선택됨`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((o) => {
                  const isSelected = value.includes(o.id);
                  return (
                    <CommandItem
                      key={o.id}
                      onSelect={() =>
                        onChange(
                          isSelected
                            ? value.filter((id) => id !== o.id)
                            : [...value, o.id]
                        )
                      }
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span>{o.name}</span>
                      {o.code && (
                        <span className="text-muted-foreground ml-1.5 font-mono text-xs">
                          ({o.code})
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((o) => (
            <Badge key={o.id} variant="secondary" className="gap-1 pr-1">
              {o.name}
              <button
                type="button"
                onClick={() => onChange(value.filter((id) => id !== o.id))}
                className="rounded-full hover:bg-black/10"
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
