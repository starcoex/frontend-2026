import { useEffect, useState, useMemo } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FolderListCards } from '@/app/pages/dashboard/board/file-manager/components/folder-list-cards';
import { StorageStatusCard } from '@/app/pages/dashboard/board/file-manager/components/storage-status-card';
import { ChartFileTransfer } from '@/app/pages/dashboard/board/file-manager/components/chart-file-transfer';
import { TableRecentFiles } from '@/app/pages/dashboard/board/file-manager/components/table-recent-files';

export const FileManagerPage = () => {
  const {
    loadUserFiles,
    initialized,
    files: allFiles,
    isLoading,
    error,
    searchFiles,
  } = useMedia();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentUser && !initialized) {
      loadUserFiles({ userId: currentUser.id, limit: 100 });
    }
  }, [currentUser, loadUserFiles, initialized]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      if (currentUser) loadUserFiles({ userId: currentUser.id, limit: 100 });
      return;
    }
    await searchFiles(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (currentUser) loadUserFiles({ userId: currentUser.id, limit: 100 });
  };

  const filteredFiles = useMemo(() => {
    if (!activeFilter) return allFiles;
    return allFiles.filter((f) => {
      const mime = f.mimeType || '';
      switch (activeFilter) {
        case 'Images':
          return mime.includes('image');
        case 'Videos':
          return mime.includes('video');
        case 'Documents':
          return (
            mime.includes('pdf') ||
            mime.includes('document') ||
            mime.includes('text')
          );
        case 'Others':
          return (
            !mime.includes('image') &&
            !mime.includes('video') &&
            !mime.includes('pdf') &&
            !mime.includes('document') &&
            !mime.includes('text')
          );
        default:
          return true;
      }
    });
  }, [allFiles, activeFilter]);

  if (isLoading && !initialized) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            파일 목록을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로딩 실패</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                currentUser &&
                loadUserFiles({ userId: currentUser.id, limit: 100 })
              }
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 검색 바 */}
      <div className="flex items-center justify-between">
        <h2 className="hidden text-lg font-semibold tracking-tight md:block">
          Quick Access
        </h2>
        <form
          onSubmit={handleSearch}
          className="relative flex w-full max-w-sm flex-1 gap-2 md:w-auto md:flex-none"
        >
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
            <Input
              placeholder="Search files..."
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-muted-foreground hover:text-foreground absolute right-2 top-2.5"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>

      {/* 폴더 필터 + 스토리지 상태 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="text-muted-foreground hover:text-primary mb-2 text-sm"
            >
              Clear filter
            </button>
          )}
          <FolderListCards
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        <div
          onClick={() => navigate('/admin/media/analysis')}
          className="cursor-pointer"
        >
          <StorageStatusCard />
        </div>
      </div>

      {/* 차트 + 파일 목록 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFileTransfer />
        <TableRecentFiles
          limit={5}
          showViewAll={true}
          files={filteredFiles}
          isLoading={isLoading}
          filterType={activeFilter}
        />
      </div>
    </div>
  );
};
