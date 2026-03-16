import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import { FileTable } from '../components/file-table';

export default function RecentFilesPage() {
  const { loadUserFiles, files, isLoading, error } = useMedia();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadUserFiles({ userId: currentUser.id, limit: 50 });
    }
  }, [currentUser, loadUserFiles]);

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
                loadUserFiles({ userId: currentUser.id, limit: 50 })
              }
              className="ml-4"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!error && <FileTable data={files} />}
    </div>
  );
}
