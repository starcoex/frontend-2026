import { Input } from '@/components/ui/input';

interface SearchResult {
  key: string;
  primary: string;
  secondary: string;
}

interface EntitySearchInputProps {
  placeholder: string;
  query: string;
  onQueryChange: (q: string) => void;
  results: SearchResult[];
  onSelect: (key: string) => void;
  isLoading?: boolean;
}

export function EntitySearchInput({
  placeholder,
  query,
  onQueryChange,
  results,
  onSelect,
  isLoading,
}: EntitySearchInputProps) {
  return (
    <div className="space-y-2">
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      {query && (
        <div className="max-h-48 divide-y overflow-y-auto rounded-md border">
          {isLoading ? (
            <p className="text-muted-foreground p-3 text-center text-xs">
              불러오는 중...
            </p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground p-3 text-center text-xs">
              검색 결과가 없습니다.
            </p>
          ) : (
            results.map((item) => (
              <button
                key={item.key}
                type="button"
                className="hover:bg-muted w-full px-3 py-2.5 text-left transition-colors"
                onClick={() => onSelect(item.key)}
              >
                <p className="text-sm font-medium">{item.primary}</p>
                <p className="text-muted-foreground font-mono text-xs">
                  {item.secondary}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
