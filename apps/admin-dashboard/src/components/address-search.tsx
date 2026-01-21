import { useState, useCallback } from 'react';
import type { JusoApiAddress } from '@starcoex-frontend/graphql';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAddress } from '@starcoex-frontend/address';

interface AddressSearchInputProps {
  onSelectAddress: (address: JusoApiAddress) => void;
  className?: string;
}

export function AddressSearchInput({
  onSelectAddress,
  className,
}: AddressSearchInputProps) {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const {
    smartSearchAddresses,
    searchResults,
    clearSearchResults,
    isLoading,
    error,
  } = useAddress();

  // 검색 실행
  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return;

    await smartSearchAddresses({
      keyword: keyword.trim(),
      currentPage: 1,
      countPerPage: 10,
    });

    setIsOpen(true);
  }, [keyword, smartSearchAddresses]);

  // 주소 선택
  const handleSelect = useCallback(
    (address: JusoApiAddress) => {
      onSelectAddress(address);
      clearSearchResults();
      setIsOpen(false);
      setKeyword('');
    },
    [onSelectAddress, clearSearchResults]
  );

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* 검색 입력 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 강남역, 테헤란로 152"
            className="pl-9"
            disabled={isLoading}
          />
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          disabled={isLoading || !keyword.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              검색 중
            </>
          ) : (
            '검색'
          )}
        </Button>
      </div>

      {/* 에러 메시지 */}
      {error && <div className="mt-2 text-sm text-destructive">{error}</div>}

      {/* 검색 결과 드롭다운 */}
      {isOpen && searchResults.length > 0 && (
        <Card className="absolute z-50 mt-2 w-full max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b p-3">
              <span className="text-sm font-medium">
                검색 결과 ({searchResults.length}건)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  clearSearchResults();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="divide-y">
              {searchResults.map((address, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(address)}
                  className="w-full p-3 text-left hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {address.roadAddr}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {address.jibunAddr}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        우편번호: {address.zipNo}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검색 결과 없음 */}
      {isOpen && searchResults.length === 0 && !isLoading && keyword && (
        <Card className="absolute z-50 mt-2 w-full shadow-lg">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
