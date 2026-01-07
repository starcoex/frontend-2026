import { useEffect, useMemo } from 'react';
import { TableRecentFiles } from '../components/table-recent-files';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import { useSearchParams } from 'react-router-dom';

export default function RecentFilesPage() {
  // ✅ useMedia에서 데이터(files)와 로딩 상태(isLoading)도 함께 가져옴
  const { loadUserFiles, files, isLoading } = useMedia();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams(); // ✅ 쿼리 파라미터 읽기

  // URL에서 'type' 파라미터 가져오기 (예: 'image', 'video')
  const filterType = searchParams.get('type');

  useEffect(() => {
    // 상세 페이지에서는 더 많은 데이터를 로드하거나, 페이지네이션을 적용할 수 있습니다.
    if (currentUser) {
      // userId가 string인 경우 parseInt 또는 그대로 사용 (백엔드 타입에 맞춤)
      // 여기서는 보통 ID가 string으로 오지만 GraphQL Input이 number일 수 있으므로 주의
      loadUserFiles({ userId: currentUser.id, limit: 50 });
    }
  }, [currentUser, loadUserFiles]);

  // ✅ 클라이언트 사이드 필터링 로직 (FileManagerPage와 동일한 로직 재사용)
  const filteredFiles = useMemo(() => {
    if (!filterType) return files;

    return files.filter((file) => {
      const mime = file.mimeType || '';
      switch (filterType) {
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
            !mime.includes('audio') &&
            !mime.includes('pdf') &&
            !mime.includes('document') &&
            !mime.includes('text')
          );
        default:
          return true;
      }
    });
  }, [files, filterType]);

  return (
    <div className="space-y-4">
      {/* 타이틀에 현재 필터 표시 (선택 사항) */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          {filterType
            ? `${
                filterType.charAt(0).toUpperCase() + filterType.slice(1)
              } Files`
            : 'All Files'}
        </h2>
      </div>

      <TableRecentFiles
        limit={100} // 더 많이 보여줌
        showViewAll={false}
        files={filteredFiles} // ✅ 필터링된 파일 전달
        isLoading={isLoading}
      />
    </div>
  );
}
