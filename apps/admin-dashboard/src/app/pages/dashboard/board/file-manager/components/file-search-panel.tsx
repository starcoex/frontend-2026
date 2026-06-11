import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useMedia } from '@starcoex-frontend/media';
import type { SearchFilesParams } from '@starcoex-frontend/media';
import { PAGE_SIZE_OPTIONS } from '@/app/pages/dashboard/board/file-manager/constants/pagination';

const FILE_TYPE_OPTIONS = [
  { label: '전체', value: '__all__' },
  { label: '이미지', value: 'IMAGE' },
  { label: '동영상', value: 'VIDEO' },
  { label: '문서', value: 'DOCUMENT' },
  { label: '오디오', value: 'AUDIO' },
  { label: '기타', value: 'OTHER' },
] as const;

const ORDER_BY_OPTIONS = [
  { label: '업로드일 (최신순)', value: 'createdAt', dir: 'desc' },
  { label: '업로드일 (오래된순)', value: 'createdAt', dir: 'asc' },
  { label: '파일명 (가나다순)', value: 'originalName', dir: 'asc' },
  { label: '파일 크기 (큰순)', value: 'fileSize', dir: 'desc' },
  { label: '파일 크기 (작은순)', value: 'fileSize', dir: 'asc' },
] as const;

interface FileSearchPanelProps {
  onSearch?: (params: SearchFilesParams) => void;
  onClear?: () => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

export function FileSearchPanel({
  onSearch,
  onClear,
  pageSize = 50,
  onPageSizeChange,
}: FileSearchPanelProps) {
  const { searchFiles, isLoading } = useMedia();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('__all__');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minFileSize, setMinFileSize] = useState('');
  const [maxFileSize, setMaxFileSize] = useState('');
  const [description, setDescription] = useState('');
  const [hasThumbnail, setHasThumbnail] = useState('__all__');
  const [orderKey, setOrderKey] = useState('0'); // 기본: 최신순

  const hasFilters =
    fileName ||
    (fileType && fileType !== '__all__') ||
    startDate ||
    endDate ||
    minFileSize ||
    maxFileSize ||
    description ||
    (hasThumbnail && hasThumbnail !== '__all__');

  const buildParams = (offset = 0): SearchFilesParams => {
    const order = ORDER_BY_OPTIONS[Number(orderKey)];
    return {
      fileName: fileName || undefined,
      fileType: fileType !== '__all__' ? fileType : undefined,
      description: description || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      minFileSize: minFileSize ? Number(minFileSize) * 1024 * 1024 : undefined,
      maxFileSize: maxFileSize ? Number(maxFileSize) * 1024 * 1024 : undefined,
      hasThumbnail:
        hasThumbnail === '__all__' ? undefined : hasThumbnail === 'true',
      orderBy: order.value,
      orderDir: order.dir,
      limit: pageSize,
      offset,
    };
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const params = buildParams(0);
    await searchFiles(params);
    onSearch?.(params);
  };

  const handleClear = () => {
    setFileName('');
    setFileType('__all__');
    setStartDate('');
    setEndDate('');
    setMinFileSize('');
    setMaxFileSize('');
    setDescription('');
    setHasThumbnail('__all__');
    setOrderKey('0');
    onClear?.();
  };

  return (
    <form onSubmit={handleSearch} className="space-y-3">
      {/* 기본 검색 바 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input
            placeholder="파일명으로 검색..."
            className="pl-9"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground absolute right-2.5 top-2.5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ✅ 정렬 기준 항상 노출 */}
        <Select value={orderKey} onValueChange={setOrderKey}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_BY_OPTIONS.map((opt, i) => (
              <SelectItem key={i} value={String(i)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ✅ 페이지 크기 선택 */}
        {onPageSizeChange && (
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}개
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button type="submit" disabled={isLoading}>
          검색
        </Button>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      {/* 고급 검색 필터 */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className="rounded-lg border p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label>파일 유형</Label>
              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  {FILE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>설명 키워드</Label>
              <Input
                placeholder="예: 홍보"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>썸네일</Label>
              <Select value={hasThumbnail} onValueChange={setHasThumbnail}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">전체</SelectItem>
                  <SelectItem value="true">있음</SelectItem>
                  <SelectItem value="false">없음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>업로드 시작일</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>업로드 종료일</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>최소 크기 (MB)</Label>
              <Input
                type="number"
                min={0}
                placeholder="예: 100"
                value={minFileSize}
                onChange={(e) => setMinFileSize(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>최대 크기 (MB)</Label>
              <Input
                type="number"
                min={0}
                placeholder="예: 500"
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(e.target.value)}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </form>
  );
}
