import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, Loader2, PieChart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedia } from '@starcoex-frontend/media';
import { useNavigate } from 'react-router-dom';
import { FileTable } from '../components/file-table';
import { FileSearchPanel } from '../components/file-search-panel';
import { formatSize } from '@/app/utils/file-utils';
import type { SearchFilesParams } from '@starcoex-frontend/media';
import {
  DEFAULT_PAGE_SIZE,
  PageSizeOption,
} from '@/app/pages/dashboard/board/file-manager/constants/pagination';

export default function StorageAnalysisPage() {
  const { searchFiles, files, pagination, isLoading, error } = useMedia();
  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  // ✅ 저장소 분석은 기본 정렬을 파일 크기 큰순으로
  const [lastParams, setLastParams] = useState<SearchFilesParams>({
    orderBy: 'fileSize',
    orderDir: 'desc',
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
  });

  useEffect(() => {
    searchFiles(lastParams);
  }, []);

  const handleSearch = (params: SearchFilesParams) => {
    setPageIndex(0);
    setLastParams(params);
  };

  const handleClear = () => {
    const params: SearchFilesParams = {
      orderBy: 'fileSize',
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

  const totalSize = useMemo(
    () => files.reduce((acc, f) => acc + (f.fileSize ?? 0), 0),
    [files]
  );

  const largestFileSize = useMemo(
    () =>
      files.length > 0 ? Math.max(...files.map((f) => f.fileSize ?? 0)) : 0,
    [files]
  );

  if (isLoading && files.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            분석 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">저장소 분석</h1>
          <p className="text-muted-foreground">
            가장 많은 공간을 차지하는 파일을 확인하세요.
          </p>
        </div>
      </div>

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

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              총 사용 용량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSize(totalSize)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              전체 파일 수
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ✅ 서버의 totalCount 사용 (현재 페이지 데이터가 아닌 전체 수) */}
            <div className="text-2xl font-bold">
              {pagination.totalCount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              최대 파일 크기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSize(largestFileSize)}
            </div>
          </CardContent>
        </Card>
      </div>

      {!error && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="text-primary h-5 w-5" />
              전체 파일 목록
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileSearchPanel
              onSearch={handleSearch}
              onClear={handleClear}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
