import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMedia } from '@starcoex-frontend/media';
import { FileTable } from '../components/file-table';
import { FileSearchPanel } from '../components/file-search-panel';
import type { SearchFilesParams } from '@starcoex-frontend/media';
import {
  DEFAULT_PAGE_SIZE,
  PageSizeOption,
} from '@/app/pages/dashboard/board/file-manager/constants/pagination';

export default function RecentFilesPage() {
  const { searchFiles, files, pagination, isLoading, error } = useMedia();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  // ✅ 마지막 검색 파라미터 저장 (페이지 이동 시 재사용)
  const [lastParams, setLastParams] = useState<SearchFilesParams>({
    orderBy: 'createdAt',
    orderDir: 'desc',
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
  });

  // ✅ 초기 로드: userId 없이 전체 파일 검색
  useEffect(() => {
    searchFiles(lastParams);
  }, []);

  const handleSearch = (params: SearchFilesParams) => {
    setPageIndex(0);
    setLastParams(params);
  };

  const handleClear = () => {
    const params: SearchFilesParams = {
      orderBy: 'createdAt',
      orderDir: 'desc',
      limit: pageSize,
      offset: 0,
    };
    setPageIndex(0);
    setLastParams(params);
    searchFiles(params);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
    searchFiles({
      ...lastParams,
      limit: pageSize,
      offset: newPageIndex * pageSize,
    });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize as PageSizeOption);
    setPageIndex(0);
    searchFiles({ ...lastParams, limit: newSize, offset: 0 });
  };

  if (isLoading && files.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            파일 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ✅ 정렬 기준 항상 노출 + 페이지 크기 선택 */}
      <FileSearchPanel
        onSearch={handleSearch}
        onClear={handleClear}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && (
        <FileTable
          data={files}
          hideToolbar
          serverPagination={{
            totalCount: pagination.totalCount,
            pageSize,
            pageIndex,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      )}
    </div>
  );
}
