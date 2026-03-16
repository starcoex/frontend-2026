import { useEffect, useMemo } from 'react';
import { AlertCircle, ArrowLeft, Loader2, PieChart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import { useNavigate } from 'react-router-dom';
import { FileTable } from '../components/file-table';
import { formatSize } from '@/app/utils/file-utils';

export default function StorageAnalysisPage() {
  const { loadUserFiles, files, initialized, isLoading, error } = useMedia();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !initialized) {
      loadUserFiles({ userId: currentUser.id, limit: 100 });
    }
  }, [currentUser, loadUserFiles, initialized]);

  const totalSize = useMemo(
    () => files.reduce((acc, f) => acc + (f.fileSize ?? 0), 0),
    [files]
  );

  const largestFileSize = useMemo(
    () =>
      files.length > 0 ? Math.max(...files.map((f) => f.fileSize ?? 0)) : 0,
    [files]
  );

  if (isLoading && !initialized) {
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
          <h1 className="text-2xl font-bold tracking-tight">
            Storage Analysis
          </h1>
          <p className="text-muted-foreground">
            Identify files taking up the most space.
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Used Space
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSize(totalSize)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Largest File
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
              All Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileTable data={files} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
