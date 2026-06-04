import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAddress } from '@starcoex-frontend/address';
import type {
  JusoApiAddress,
  SaveAddressInput,
} from '@starcoex-frontend/address';

interface AddressSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export function AddressSearchDialog({
  open,
  onOpenChange,
  onSaved,
}: AddressSearchDialogProps) {
  const { searchResults, isLoading, smartSearchAddresses, saveAddress } =
    useAddress();
  const [keyword, setKeyword] = useState('');

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    await smartSearchAddresses({ keyword: keyword.trim(), countPerPage: 20 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSave = async (juso: JusoApiAddress) => {
    const input: SaveAddressInput = {
      roadFullAddr: juso.roadAddr,
      roadAddrPart1: juso.roadAddr,
      jibunAddr: juso.jibunAddr,
      engAddr: juso.engAddr ?? '',
      zipNo: juso.zipNo,
      admCd: juso.admCd ?? '',
      siNm: juso.siNm ?? '',
      sggNm: juso.sggNm ?? undefined,
      emdNm: juso.emdNm ?? '',
      rn: juso.rn ?? '',
      rnMgtSn: juso.rnMgtSn ?? '',
      bdMgtSn: juso.bdMgtSn ?? '',
      bdNm: juso.bdNm ?? undefined,
      buldMnnm: parseInt(juso.buldMnnm ?? '0'),
      buldSlno: parseInt(juso.buldSlno ?? '0'),
      lnbrMnnm: 0,
      lnbrSlno: 0,
      emdNo: '00',
    };

    const res = await saveAddress(input);
    if (res.success) {
      toast.success('주소가 저장되었습니다.');
      onOpenChange(false);
      onSaved?.();
    } else {
      toast.error(res.error?.message ?? '주소 저장에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>주소 검색</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 검색 입력 */}
          <div className="flex gap-2">
            <Input
              placeholder="도로명 또는 지번으로 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <Button
              variant="outline"
              onClick={handleSearch}
              disabled={isLoading || !keyword.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <div className="max-h-72 divide-y overflow-y-auto rounded-md border">
              {searchResults.map((juso, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="hover:bg-muted w-full px-3 py-2.5 text-left transition-colors"
                  onClick={() => handleSave(juso)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{juso.roadAddr}</p>
                      <p className="text-muted-foreground text-xs">
                        {juso.jibunAddr}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {juso.zipNo}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && keyword && searchResults.length === 0 && (
            <div className="rounded-lg border border-dashed p-4 text-center">
              <p className="text-muted-foreground text-sm">
                <span className="text-foreground font-medium">"{keyword}"</span>
                에 대한 검색 결과가 없습니다.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
