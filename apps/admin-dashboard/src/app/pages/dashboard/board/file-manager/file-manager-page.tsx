import {
  ChartFileTransfer,
  FolderListCards,
  StorageStatusCard,
  TableRecentFiles,
} from '@/app/pages/dashboard/board/file-manager/components';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const FileManagerPage = () => {
  const {
    loadUserFiles,
    initialized,
    files: allFiles,
    isLoading,
    searchFiles,
  } = useMedia();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 필터 상태 관리
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentUser && !initialized) {
      loadUserFiles({ userId: currentUser.id, limit: 100 });
    }
  }, [currentUser, loadUserFiles, initialized]);

  // 검색 핸들러
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // 검색어 없으면 초기 목록 다시 로드
      if (currentUser) {
        loadUserFiles({ userId: currentUser.id, limit: 100 });
      }
      return;
    }
    // 검색 API 호출 (fileName으로 검색)
    await searchFiles(searchQuery);
  };

  // 검색 초기화
  const clearSearch = () => {
    setSearchQuery('');
    if (currentUser) {
      loadUserFiles({ userId: currentUser.id, limit: 100 });
    }
  };

  // 클라이언트 사이드 필터링 (검색 결과 내에서 또 필터링 가능)
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

  // 스토리지 분석 페이지 이동 핸들러 (StorageStatusCard에 전달 가정)
  const handleAnalyzeStorage = () => {
    navigate('/admin/media/analysis');
  };

  return (
    <div className="space-y-6">
      {/* ✅ 검색 바 영역 추가 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight hidden md:block">
          Quick Access
        </h2>
        <form
          onSubmit={handleSearch}
          className="relative w-full md:w-auto flex-1 md:flex-none max-w-sm flex gap-2"
        >
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
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
      {/* 상단: 폴더 필터 및 스토리지 상태 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            {/*<h2 className="text-lg font-semibold tracking-tight">*/}
            {/*  Quick Access*/}
            {/*</h2>*/}
            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Clear filter
              </button>
            )}
          </div>
          <FolderListCards
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        {/* StorageStatusCard 내부의 화살표 버튼에 onClick={handleAnalyzeStorage} 연결 필요 */}
        <div onClick={handleAnalyzeStorage} className="cursor-pointer">
          <StorageStatusCard />
        </div>
      </div>

      {/* 하단: 차트 및 파일 목록 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFileTransfer />

        {/* 필터링된 목록 중 상위 5개만 표시 */}
        <TableRecentFiles
          limit={5}
          showViewAll={true}
          files={filteredFiles}
          isLoading={isLoading}
          filterType={activeFilter} // ✅ 이 부분이 누락되었습니다. 추가해주세요.
        />
      </div>
    </div>
  );
};
